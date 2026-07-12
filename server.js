const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const STATS_FILE = path.join(__dirname, 'stats.json');

// Used only to one-way-hash IPs for de-duplication (never stored/output raw).
// Set a real secret in production via env var so hashes aren't guessable.
const SALT = process.env.VISIT_SALT || 'change-me-please';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// ---------- storage helpers ----------

function loadStats() {
  if (!fs.existsSync(STATS_FILE)) {
    return { totalVisits: 0, uniqueHashes: [], byCity: {}, byCountry: {}, byDate: {} };
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
    return {
      totalVisits: parsed.totalVisits || 0,
      uniqueHashes: Array.isArray(parsed.uniqueHashes) ? parsed.uniqueHashes : [],
      byCity: parsed.byCity || {},
      byCountry: parsed.byCountry || {},
      byDate: parsed.byDate || {},
    };
  } catch (e) {
    console.error('[ERROR] Failed to parse stats.json, resetting.', e);
    return { totalVisits: 0, uniqueHashes: [], byCity: {}, byCountry: {}, byDate: {} };
  }
}

function saveStats(stats) {
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf8');
}

function hashIp(ip) {
  return crypto.createHash('sha256').update(ip + SALT).digest('hex');
}

// Get the real client IP even behind a reverse proxy (nginx sets X-Forwarded-For)
function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return fwd.split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

// Server-side geo lookup (server-to-server, so the visitor's browser never
// talks to a third party just to be tracked). Swap for any geo-IP provider.
async function lookupGeo(ip) {
  // Local/dev IPs won't resolve to a real location.
  if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('::1') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { city: 'Local/Dev', country: 'Local/Dev' };
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,city`);
    if (!res.ok) return { city: 'Unknown', country: 'Unknown' };
    const data = await res.json();
    if (data.status !== 'success') return { city: 'Unknown', country: 'Unknown' };
    return { city: data.city || 'Unknown', country: data.country || 'Unknown' };
  } catch (e) {
    console.error('[ERROR] Geo lookup failed:', e.message);
    return { city: 'Unknown', country: 'Unknown' };
  }
}

// ---------- routes ----------

// Record a visit. No body required — location is derived from the
// connecting IP on the server, nothing identifying is stored.
app.post('/api/visit', async (req, res) => {
  try {
    const ip = getClientIp(req);
    const geo = await lookupGeo(ip);
    const hash = hashIp(ip);
    const today = new Date().toISOString().slice(0, 10);

    const stats = loadStats();
    stats.totalVisits += 1;

    if (!stats.uniqueHashes.includes(hash)) {
      stats.uniqueHashes.push(hash);
    }

    const cityKey = `${geo.city}, ${geo.country}`;
    stats.byCity[cityKey] = (stats.byCity[cityKey] || 0) + 1;
    stats.byCountry[geo.country] = (stats.byCountry[geo.country] || 0) + 1;
    stats.byDate[today] = (stats.byDate[today] || 0) + 1;

    saveStats(stats);

    console.log(`[VISIT] +1 from ${cityKey} (total: ${stats.totalVisits}, unique: ${stats.uniqueHashes.length})`);
    res.status(200).json({ success: true });
  } catch (e) {
    console.error('[ERROR] Failed to record visit:', e);
    res.status(500).json({ success: false });
  }
});

// Aggregate stats only — no per-visitor data ever leaves this endpoint.
app.get('/api/stats', (req, res) => {
  const stats = loadStats();

  const topCities = Object.entries(stats.byCity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([city, count]) => ({ city, count }));

  const topCountries = Object.entries(stats.byCountry)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));

  res.status(200).json({
    totalVisits: stats.totalVisits,
    totalUnique: stats.uniqueHashes.length,
    topCities,
    topCountries,
    byDate: stats.byDate,
  });
});

// Proxy endpoint for Grok AI Profile Analysis
app.post('/api/proxy-profile', async (req, res) => {
  try {
    const clientIp = getClientIp(req);
    const response = await fetch('https://yourinfo.hsingh.app/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': clientIp
      },
      body: JSON.stringify(req.body)
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ERROR] Proxy profile API returned status:', response.status, errorText);
      return res.status(response.status).send(errorText);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    console.error('[ERROR] Failed to proxy profile:', e);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Proxy endpoint for RTB Ad Auction Simulator
app.post('/api/proxy-auction', async (req, res) => {
  try {
    const response = await fetch('https://yourinfo.hsingh.app/api/ai-auction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ERROR] Proxy auction API returned status:', response.status, errorText);
      return res.status(response.status).send(errorText);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    console.error('[ERROR] Failed to proxy auction:', e);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log('==================================================');
  console.log(`Sufyan's Portfolio Server is running!`);
  console.log(`Local Address: http://localhost:${PORT}`);
  console.log(`Stats File: ${STATS_FILE}`);
  console.log('==================================================');
});