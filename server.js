const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_FILE = path.join(__dirname, 'visits.json');

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Endpoint to log visitor details
app.post('/api/visit', (req, res) => {
  const visitorData = {
    timestamp: new Date().toISOString(),
    ip: req.body.ip || 'Unknown',
    country: req.body.country || 'Unknown',
    region: req.body.region || 'Unknown',
    city: req.body.city || 'Unknown',
    isp: req.body.isp || 'Unknown',
    os: req.body.os || 'Unknown',
    browser: req.body.browser || 'Unknown',
    screen: req.body.screen || 'Unknown',
    timezone: req.body.timezone || 'Unknown',
    referrer: req.body.referrer || 'Direct',
    battery: req.body.battery || 'Unknown'
  };

  console.log(`[VISIT] Connection detected from ${visitorData.ip} (${visitorData.city}, ${visitorData.country}) at ${visitorData.timestamp}`);

  // Read existing visits
  let visits = [];
  if (fs.existsSync(LOG_FILE)) {
    try {
      const fileContent = fs.readFileSync(LOG_FILE, 'utf8');
      visits = JSON.parse(fileContent);
      if (!Array.isArray(visits)) {
        visits = [];
      }
    } catch (e) {
      console.error('[ERROR] Failed to parse visits.json, resetting log.', e);
      visits = [];
    }
  }

  // Add new visit
  visits.push(visitorData);

  // Write back to visits.json
  try {
    fs.writeFileSync(LOG_FILE, JSON.stringify(visits, null, 2), 'utf8');
    res.status(200).json({ success: true, message: 'Visit logged successfully.' });
  } catch (e) {
    console.error('[ERROR] Failed to write visits.json', e);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log('==================================================');
  console.log(`🚀 Sufyan's Portfolio Server is running!`);
  console.log(`🔗 Local Address: http://localhost:${PORT}`);
  console.log(`📂 Log File: ${LOG_FILE}`);
  console.log('==================================================');
});
