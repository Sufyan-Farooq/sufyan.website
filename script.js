// ========== PARTICLE SYSTEM ==========
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: 0, y: 0 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = ['#00d4ff', '#7b61ff', '#ff6b9d'][Math.floor(Math.random() * 3)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function initParticles() {
  const count = Math.min(80, Math.floor(window.innerWidth * 0.05));
  particles = [];
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ========== CURSOR GLOW ==========
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ========== NAVBAR ==========
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active section highlight
  let current = '';
  sections.forEach(s => {
    const top = s.offsetTop - 100;
    if (window.scrollY >= top) current = s.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// ========== MOBILE MENU ==========
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ========== TYPEWRITER ==========
const typewriterEl = document.getElementById('typewriter');
const phrases = [
  'Full Stack Developer 💻',
  'AI Explorer & Builder 🤖',
  'Cyber Security Explorer 🔐',
  'IT Support Specialist 🛠️',
  'MERN Stack Enthusiast 🚀',
  'MBA Candidate 📚'
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typewriter() {
  const current = phrases[phraseIdx];
  typewriterEl.textContent = current.substring(0, charIdx);

  if (!isDeleting && charIdx < current.length) {
    charIdx++;
    setTimeout(typewriter, 60 + Math.random() * 40);
  } else if (!isDeleting && charIdx === current.length) {
    setTimeout(() => { isDeleting = true; typewriter(); }, 2000);
  } else if (isDeleting && charIdx > 0) {
    charIdx--;
    setTimeout(typewriter, 30);
  } else {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    setTimeout(typewriter, 500);
  }
}
typewriter();

// ========== COUNTER ANIMATION ==========
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ========== SCROLL REVEAL ==========
const revealEls = document.querySelectorAll(
  '.about-card, .skill-category, .skills-terminal, .timeline-item, .project-card, .education-card, .contact-card, .contact-form-wrapper'
);
revealEls.forEach(el => el.classList.add('reveal'));

let countersDone = false;
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Trigger counters when hero stats come into view
      if (!countersDone && entry.target.closest('#hero')) {
        animateCounters();
        countersDone = true;
      }
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => observer.observe(el));

// Also observe the hero stats
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersDone) {
      animateCounters();
      countersDone = true;
    }
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

// ========== STAGGERED REVEAL ==========
document.querySelectorAll('.about-grid, .skills-grid, .projects-grid, .education-grid').forEach(grid => {
  const children = grid.children;
  Array.from(children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.1}s`;
  });
});

// ========== CONTACT FORM ==========
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  const originalHTML = btn.innerHTML;

  // Disable button to prevent multiple clicks
  btn.disabled = true;
  btn.innerHTML = '<span>Sending... <i class="fas fa-spinner fa-spin"></i></span>';

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      btn.innerHTML = '<span>Message Sent! ✨</span>';
      btn.style.background = 'linear-gradient(135deg, #28c840, #00d4ff)';
      form.reset();
    } else {
      btn.innerHTML = '<span>Error! ❌</span>';
      console.error('Form submission error');
    }
  } catch (error) {
    btn.innerHTML = '<span>Error! ❌</span>';
    console.error('Form submission failed', error);
  }

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
    btn.disabled = false;
  }, 4000);
});

// ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ========== TILT EFFECT ON CARDS (desktop only) ==========
if (window.matchMedia('(min-width: 900px)').matches) {
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

console.log('%c🚀 Welcome to Sufyan\'s Portfolio!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%c"Bugs are just features in disguise! 🐛✨"', 'color: #7b61ff; font-size: 14px;');

// ========== CYBER SOUND EFFECTS SYNTHESIZER ==========
let soundMuted = true;
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, type, duration, volume = 0.05) {
  if (soundMuted) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type; // sine, square, sawtooth, triangle
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.error('Audio synthesis failed', e);
  }
}

const sfx = {
  click: () => playTone(600 + Math.random() * 400, 'sine', 0.04, 0.02),
  beep: () => playTone(880, 'sine', 0.08, 0.04),
  boop: () => playTone(440, 'sine', 0.08, 0.04),
  success: () => {
    playTone(523.25, 'triangle', 0.15, 0.05); // C5
    setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.05), 100); // E5
    setTimeout(() => playTone(783.99, 'triangle', 0.3, 0.05), 200); // G5
  },
  fail: () => {
    playTone(150, 'sawtooth', 0.3, 0.06);
  },
  alarm: () => {
    playTone(800, 'square', 0.15, 0.03);
    setTimeout(() => playTone(700, 'square', 0.15, 0.03), 150);
  }
};

// ========== VISITOR DIAGNOSTICS & GEOLOCATION ==========
function getOS() {
  const ua = navigator.userAgent;
  if (ua.indexOf("Win") !== -1) return "Windows";
  if (ua.indexOf("Mac") !== -1) return "macOS";
  if (ua.indexOf("Linux") !== -1) return "Linux";
  if (ua.indexOf("Android") !== -1) return "Android";
  if (ua.indexOf("like Mac") !== -1) return "iOS";
  return "Linux/Unix OS";
}

function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.indexOf("Chrome") !== -1 && ua.indexOf("Safari") !== -1) return "Chrome";
  if (ua.indexOf("Firefox") !== -1) return "Firefox";
  if (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1) return "Safari";
  if (ua.indexOf("Edge") !== -1) return "Edge";
  if (ua.indexOf("MSIE") !== -1 || !!document.documentMode) return "IE";
  return "Modern Web Browser";
}

async function fetchVisitorDetails() {
  const details = {
    ip: '127.0.0.1',
    country: 'Unknown Location',
    region: 'Proxy Net',
    city: 'Encrypted Grid',
    isp: 'Incognito Provider',
    os: getOS(),
    browser: getBrowser(),
    screen: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    referrer: document.referrer || 'Direct Access',
    battery: '100% (AC Locked)'
  };

  try {
    if (navigator.getBattery) {
      const battery = await navigator.getBattery();
      details.battery = `${Math.round(battery.level * 100)}% (${battery.charging ? 'Charging' : 'Discharging'})`;
    }
  } catch (e) {}

  try {
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      details.ip = data.ip || details.ip;
      details.country = data.country_name || details.country;
      details.region = data.region || details.region;
      details.city = data.city || details.city;
      details.isp = data.org || details.isp;
    }
  } catch (err) {
    console.warn('Geolocation lookup failed, proceeding with local browser metadata.');
  }

  return details;
}

// ========== INTERACTIVE COMMAND DECK CLI ==========
const terminalOutput = document.getElementById('terminal-deck-output');
const terminalInput = document.getElementById('terminal-deck-input');
const terminalBody = document.getElementById('terminal-deck-body');
const terminalTitle = document.getElementById('terminal-deck-title');
const terminalContainer = document.getElementById('terminal-deck');

const techStackHTML = `<pre><span class="code-keyword">const</span> <span class="code-variable">myTechStack</span> = {
  <span class="code-key">frontend</span>: [<span class="code-string">'HTML'</span>, <span class="code-string">'CSS'</span>, <span class="code-string">'JavaScript'</span>, <span class="code-string">'React'</span>],
  <span class="code-key">backend</span>:  [<span class="code-string">'Node.js'</span>, <span class="code-string">'Express'</span>, <span class="code-string">'MongoDB'</span>],
  <span class="code-key">tools</span>:    [<span class="code-string">'Git'</span>, <span class="code-string">'Docker'</span>, <span class="code-string">'VS Code'</span>, <span class="code-string">'Postman'</span>],
  <span class="code-key">cloud</span>:    [<span class="code-string">'AWS EC2'</span>, <span class="code-string">'CI/CD'</span>, <span class="code-string">'GitHub Actions'</span>],
  <span class="code-key">learning</span>: [<span class="code-string">'Python'</span>, <span class="code-string">'DevOps'</span>, <span class="code-string">'Docker'</span>],
  <span class="code-key">funFact</span>:  <span class="code-string">"Bugs are just features in disguise! 🐛✨"</span>
};</pre>`;

function initTerminal() {
  writeToTerminal('Welcome to Sufyan\'s interactive Command Deck.', 'info');
  writeToTerminal('Click or Type: <span class="terminal-cmd-link" onclick="runTerminalCmd(\'help\')">"help"</span> for logs, <span class="terminal-cmd-link" onclick="runTerminalCmd(\'play\')">"play"</span> to bypass firewall, or <span class="terminal-cmd-link" onclick="runTerminalCmd(\'hack\')">"hack"</span> to audit connection.', 'info');
  terminalOutput.innerHTML += techStackHTML;
  scrollToBottom();
}

function writeToTerminal(text, type = '') {
  const line = document.createElement('div');
  line.className = `terminal-line ${type}`;
  line.innerHTML = text;
  terminalOutput.appendChild(line);
  scrollToBottom();
}

function scrollToBottom() {
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

const commands = {
  help: () => {
    writeToTerminal('Authorization Console - Available Logs:', 'success');
    writeToTerminal('  <b>neofetch</b>   - Display retro hacker environment specs');
    writeToTerminal('  <b>hack</b>       - Trigger diagnostic scan of client connection');
    writeToTerminal('  <b>play</b>       - Bypass security node (Fallout terminal puzzle)');
    writeToTerminal('  <b>about</b>      - Scroll navigation -> About section');
    writeToTerminal('  <b>skills</b>     - Scroll navigation -> Skills section');
    writeToTerminal('  <b>experience</b> - Scroll navigation -> Experience section');
    writeToTerminal('  <b>projects</b>   - Scroll navigation -> Projects section');
    writeToTerminal('  <b>contact</b>    - Scroll navigation -> Contact section');
    writeToTerminal('  <b>clear</b>      - Clear terminal outputs');
  },
  clear: () => {
    terminalOutput.innerHTML = '';
  },
  neofetch: () => {
    const asciiArt = `
<span style="color:#00d4ff">       ____   ____</span>
<span style="color:#00d4ff">      / __/  / __/</span>
<span style="color:#00d4ff">     _\\ \\   / _/  </span>
<span style="color:#00d4ff">    /___/  /_/    </span>
`;
    const details = `
<span style="color:#00ff66">sufyan@portfolio</span>
----------------
<span style="color:#7b61ff">OS</span>: ${getOS()}
<span style="color:#7b61ff">Browser</span>: ${getBrowser()}
<span style="color:#7b61ff">Resolution</span>: ${window.screen.width}x${window.screen.height}
<span style="color:#7b61ff">Cores</span>: ${navigator.hardwareConcurrency || 'N/A'} logical processors
<span style="color:#7b61ff">Timezone</span>: ${Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'}
<span style="color:#7b61ff">Aesthetic</span>: Hacker Cyberpunk v2.0
`;
    writeToTerminal(`<div style="display:flex; gap: 20px; overflow-x: auto;">${asciiArt}<div>${details}</div></div>`);
  },
  about: () => {
    scrollToSection('about');
    writeToTerminal('Navigating target section: about', 'info');
  },
  skills: () => {
    scrollToSection('skills');
    writeToTerminal('Navigating target section: skills', 'info');
  },
  experience: () => {
    scrollToSection('experience');
    writeToTerminal('Navigating target section: experience', 'info');
  },
  projects: () => {
    scrollToSection('projects');
    writeToTerminal('Navigating target section: projects', 'info');
  },
  contact: () => {
    scrollToSection('contact');
    writeToTerminal('Navigating target section: contact', 'info');
  },
  hack: async () => {
    writeToTerminal('[*] Executing deep diagnostic audit scan...', 'warning');
    sfx.alarm();
    
    const hud = document.getElementById('cyber-hud');
    if (hud && hud.classList.contains('minimized')) {
      hud.classList.remove('minimized');
    }
    
    let visitorData = await fetchVisitorDetails();
    
    let steps = [
      `[*] Ping diagnostics resolved... OK.`,
      `[+] Detected Node IP: <span style="color:#ff6b9d">${visitorData.ip}</span>`,
      `[+] Node Position: ${visitorData.city}, ${visitorData.region}, ${visitorData.country}`,
      `[+] Routing Provider: ${visitorData.isp}`,
      `[+] Core Environment: ${visitorData.os} / ${visitorData.browser}`,
      `[+] Frame Resolution: ${visitorData.screen}`,
      `[+] Host Clock: ${new Date().toLocaleTimeString()} (${visitorData.timezone})`,
      `[+] Node Power Status: ${visitorData.battery}`,
      `[*] DIAGNOSTICS LOGGED SUCCESSFULLY.`
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 350));
      writeToTerminal(steps[i], 'success');
      sfx.click();
    }
  },
  play: () => {
    startHackingGame();
  }
};

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ========== FALLOUT PASSPHRASE MINIGAME LOGIC ==========
let gameActive = false;
let secretWord = "";
let attempts = 4;
let gameWordsList = [];
let clickedBrackets = new Set();

const wordPool = [
  "NETWORK", "FIREWALL", "ROUTING", "GATEWAY", "MONITOR", "HACKING", "EXPLOIT",
  "SCANNER", "MALWARE", "SPYWARE", "ROOTKIT", "RECOVER", "SESSION", "CAPTURE",
  "COMPILE", "DECRYPT", "ENCRYPT", "LOGGING", "AUDITED", "SYSTEMS", "PROCESS"
];

function startHackingGame() {
  gameActive = true;
  attempts = 4;
  clickedBrackets.clear();
  
  terminalContainer.classList.add('hacker-theme');
  terminalTitle.textContent = 'sufyan@portfolio:~/firewall_bypass';
  terminalOutput.innerHTML = '';
  
  writeToTerminal('ROBCO INDUSTRIES (TM) TERMLINK ACTIVE', 'success');
  writeToTerminal('BYPASS SECURITY NODE TO DECRYPT SECRET ARCHIVE.', 'success');
  writeToTerminal('================================================', 'success');
  
  const availableWords = wordPool.filter(w => w.length === 7);
  const shuffled = [...availableWords].sort(() => 0.5 - Math.random());
  gameWordsList = shuffled.slice(0, 8);
  secretWord = gameWordsList[Math.floor(Math.random() * gameWordsList.length)];
  
  renderGameScreen();
}

function renderGameScreen() {
  let hexStart = 0xF4A0;
  let gameRowsHTML = "";
  const symbols = "$%&*/()[]{}<>@#*!;:,.?";
  
  let stream = "";
  let wordIndex = 0;
  while (wordIndex < gameWordsList.length || stream.length < 240) {
    if (wordIndex < gameWordsList.length && Math.random() < 0.35) {
      stream += gameWordsList[wordIndex];
      wordIndex++;
    } else {
      if (Math.random() < 0.15) {
        const brType = [['[', ']'], ['{', '}'], ['<', '>'], ['(', ')']][Math.floor(Math.random() * 4)];
        const length = Math.floor(Math.random() * 3) + 2;
        let contents = "";
        for (let k = 0; k < length; k++) {
          contents += symbols[Math.floor(Math.random() * symbols.length)];
        }
        stream += brType[0] + contents + brType[1];
      } else {
        stream += symbols[Math.floor(Math.random() * symbols.length)];
      }
    }
  }

  let i = 0;
  let tokens = [];
  while (i < stream.length) {
    let foundWord = null;
    for (let word of gameWordsList) {
      if (stream.substring(i, i + word.length) === word) {
        foundWord = word;
        break;
      }
    }
    
    if (foundWord) {
      tokens.push({ type: 'word', text: foundWord });
      i += foundWord.length;
      continue;
    }
    
    const openBrs = ['[', '{', '<', '('];
    const closeBrs = [']', '}', '>', ')'];
    const brIdx = openBrs.indexOf(stream[i]);
    
    if (brIdx !== -1) {
      const openBr = stream[i];
      const closeBr = closeBrs[brIdx];
      let matchIdx = -1;
      for (let j = i + 1; j < Math.min(i + 12, stream.length); j++) {
        if (stream[j] === closeBr) {
          matchIdx = j;
          break;
        }
        if (openBrs.includes(stream[j])) break;
      }
      
      if (matchIdx !== -1) {
        const bracketText = stream.substring(i, matchIdx + 1);
        tokens.push({ type: 'bracket', text: bracketText, id: `br-${i}` });
        i = matchIdx + 1;
        continue;
      }
    }
    
    tokens.push({ type: 'char', text: stream[i] });
    i++;
  }

  let currentOffset = 0;
  let tempRowText = "";
  let tempRowHTML = "";
  
  function flushRow() {
    if (tempRowHTML !== "") {
      const addr = "0x" + (hexStart + currentOffset * 12).toString(16).toUpperCase();
      gameRowsHTML += `<div class="game-row"><span class="game-hex">${addr}</span><span class="game-words">${tempRowHTML}</span></div>`;
      tempRowHTML = "";
      tempRowText = "";
      currentOffset++;
    }
  }
  
  for (let token of tokens) {
    let tokenHTML = "";
    if (token.type === 'word') {
      tokenHTML = `<span class="game-word" data-word="${token.text}">${token.text}</span>`;
    } else if (token.type === 'bracket') {
      tokenHTML = `<span class="game-bracket" data-br-id="${token.id}" data-text="${token.text}">${token.text}</span>`;
    } else {
      tokenHTML = token.text;
    }
    
    if (tempRowText.length + token.text.length > 14) {
      flushRow();
    }
    
    tempRowText += token.text;
    tempRowHTML += tokenHTML;
  }
  flushRow();
  
  let parsedHTML = `<div class="game-container">`;
  parsedHTML += `<div class="game-col-memory">${gameRowsHTML}</div>`;
  parsedHTML += `<div class="game-col-feedback">`;
  parsedHTML += `<div class="game-attempts-row">`;
  parsedHTML += `ATTEMPTS REMAINING: <span id="game-attempts-count">${attempts}</span><br/>`;
  parsedHTML += `<span id="game-attempts-blocks" style="color:#00ff66">${"█ ".repeat(attempts)}</span>`;
  parsedHTML += `</div>`;
  parsedHTML += `<div class="game-feedback-logs" id="game-feedback-logs">`;
  parsedHTML += `<div>> ATTACHING COMPILER...</div>`;
  parsedHTML += `</div>`;
  parsedHTML += `<div style="font-size:0.7rem; color:rgba(0, 255, 102, 0.6)">Type "abort" to exit.</div>`;
  parsedHTML += `</div>`;
  parsedHTML += `</div>`;
  
  terminalOutput.innerHTML = parsedHTML;
  scrollToBottom();
  
  document.querySelectorAll('.game-word').forEach(el => {
    el.addEventListener('click', (e) => {
      const word = e.target.dataset.word;
      if (word === '.......') return;
      handleWordGuess(word, e.target);
    });
  });
  
  document.querySelectorAll('.game-bracket').forEach(el => {
    el.addEventListener('click', (e) => {
      const brId = e.currentTarget.dataset.brId;
      const text = e.currentTarget.dataset.text;
      if (clickedBrackets.has(brId)) return;
      clickedBrackets.add(brId);
      handleBracketClick(brId, text, e.currentTarget);
    });
  });
}

function handleWordGuess(word, element) {
  if (word === secretWord) {
    sfx.success();
    logGameFeedback(`> ACCESS GRANTED!`);
    logGameFeedback(`> DECRYPTING NODE...`);
    
    element.style.background = '#00ff66';
    element.style.color = '#050508';
    
    setTimeout(() => {
      terminalContainer.classList.remove('hacker-theme');
      terminalTitle.textContent = 'sufyan@portfolio:~';
      terminalOutput.innerHTML = '';
      writeToTerminal('=======================================', 'success');
      writeToTerminal('🔓 SECURE ARCHIVE DECRYPTED SUCCESSFULLY', 'success');
      writeToTerminal('=======================================', 'success');
      writeToTerminal('<b>[LOG ENTRY DECRYPTED]</b>: "Greetings! Sufyan is a senior operations technician and developer. Specializes in building modern interfaces, scripting local integrations, and solving complex support structures. Ready for connection! 🚀"', 'info');
      writeToTerminal('<br>Type "help" to list available deck processes.', 'info');
      gameActive = false;
    }, 1500);
  } else {
    let likeness = 0;
    for (let k = 0; k < word.length; k++) {
      if (word[k] === secretWord[k]) likeness++;
    }
    
    attempts--;
    sfx.fail();
    logGameFeedback(`> GUESS: "${word}"`);
    logGameFeedback(`> LIKENESS = ${likeness}`);
    
    element.textContent = '.'.repeat(word.length);
    element.dataset.word = '.......';
    element.className = 'game-word-dud';
    element.style.color = 'rgba(0, 255, 102, 0.2)';
    
    document.getElementById('game-attempts-count').textContent = attempts;
    document.getElementById('game-attempts-blocks').textContent = "█ ".repeat(attempts);
    
    if (attempts <= 0) {
      sfx.alarm();
      logGameFeedback(`> !!! SECURE LOCKOUT !!!`);
      setTimeout(() => {
        terminalContainer.classList.remove('hacker-theme');
        terminalTitle.textContent = 'sufyan@portfolio:~';
        terminalOutput.innerHTML = '';
        writeToTerminal('❌ TERMINAL LOCKOUT ACTIVE. ACCESS REJECTED.', 'warning');
        writeToTerminal('Type "play" to re-authorize entry credentials.', 'info');
        gameActive = false;
      }, 1500);
    }
  }
}

function handleBracketClick(brId, text, element) {
  sfx.click();
  element.style.color = 'rgba(0, 255, 102, 0.2)';
  
  if (Math.random() < 0.4) {
    attempts = 4;
    logGameFeedback(`> ATTEMPTS REPLENISHED.`);
    document.getElementById('game-attempts-count').textContent = attempts;
    document.getElementById('game-attempts-blocks').textContent = "█ ".repeat(attempts);
  } else {
    const activeDuds = gameWordsList.filter(w => w !== secretWord && w !== '.......');
    if (activeDuds.length > 0) {
      const targetDud = activeDuds[Math.floor(Math.random() * activeDuds.length)];
      const idx = gameWordsList.indexOf(targetDud);
      gameWordsList[idx] = '.......';
      
      document.querySelectorAll(`.game-word[data-word="${targetDud}"]`).forEach(el => {
        el.textContent = '.'.repeat(targetDud.length);
        el.dataset.word = '.......';
        el.className = 'game-word-dud';
        el.style.color = 'rgba(0, 255, 102, 0.2)';
      });
      
      logGameFeedback(`> REMOVED DUD: "${targetDud}"`);
    } else {
      logGameFeedback(`> STABLE SYNC.`);
    }
  }
}

function logGameFeedback(msg) {
  const logs = document.getElementById('game-feedback-logs');
  if (logs) {
    const line = document.createElement('div');
    line.innerHTML = msg;
    logs.appendChild(line);
    logs.scrollTop = logs.scrollHeight;
  }
}

// ========== TERMINAL COMMAND EXECUTION ==========
function executeCommand(rawCmd) {
  const inputVal = rawCmd.trim().toLowerCase();
  
  if (gameActive) {
    if (inputVal === 'exit' || inputVal === 'abort') {
      gameActive = false;
      terminalContainer.classList.remove('hacker-theme');
      terminalTitle.textContent = 'sufyan@portfolio:~';
      terminalOutput.innerHTML = '';
      initTerminal();
    } else {
      logGameFeedback(`> INVALID CMD DURING PUZZLE.`);
    }
    return;
  }
  
  if (inputVal === '') return;
  
  if (commands[inputVal]) {
    commands[inputVal]();
  } else {
    writeToTerminal(`bash: command not found: ${rawCmd}. Type "help" for log command references.`, 'warning');
  }
}

window.runTerminalCmd = function(cmd) {
  const el = document.getElementById('skills');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  
  setTimeout(() => {
    terminalInput.focus();
    writeToTerminal(`<span class="terminal-prompt">${terminalTitle.textContent.split(':')[1] || '~'} $</span> ${cmd}`);
    sfx.click();
    executeCommand(cmd);
  }, 500);
};

// ========== TERMINAL KEY HANDLING ==========
terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const rawVal = terminalInput.value;
    sfx.click();
    writeToTerminal(`<span class="terminal-prompt">${terminalTitle.textContent.split(':')[1] || '~'} $</span> ${rawVal}`);
    terminalInput.value = '';
    executeCommand(rawVal);
  }
});

terminalBody.addEventListener('click', () => {
  terminalInput.focus();
});

// ========== CYBER SOUND UI CONTROL ==========
const soundControlBtn = document.getElementById('sound-control');
soundControlBtn.addEventListener('click', () => {
  soundMuted = !soundMuted;
  if (soundMuted) {
    soundControlBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    soundControlBtn.title = "Unmute retro sounds";
  } else {
    soundControlBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    soundControlBtn.title = "Mute retro sounds";
    sfx.click();
  }
});

// ========== CYBER HUD DIAGNOSTICS WIDGET ==========
const hudBody = document.getElementById('cyber-hud-body');
const hudHeader = document.getElementById('cyber-hud-header');
const hudToggleBtn = document.getElementById('cyber-hud-toggle-btn');
const hudDot = document.getElementById('cyber-hud-status-dot');
const cyberHud = document.getElementById('cyber-hud');

hudHeader.addEventListener('click', () => {
  cyberHud.classList.toggle('minimized');
  const icon = hudToggleBtn.querySelector('i');
  if (cyberHud.classList.contains('minimized')) {
    icon.className = 'fas fa-chevron-up';
    if (hudDot) hudDot.className = 'cyber-hud-dot warning';
  } else {
    icon.className = 'fas fa-minus';
    if (hudDot) hudDot.className = 'cyber-hud-dot';
  }
});

function writeToHUD(msg, type = '') {
  if (!hudBody) return;
  const line = document.createElement('div');
  line.className = `cyber-hud-line ${type}`;
  line.textContent = msg;
  hudBody.appendChild(line);
  hudBody.scrollTop = hudBody.scrollHeight;
}

async function logVisitToBackend(details) {
  try {
    const response = await fetch('/api/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(details)
    });
    if (response.ok) {
      console.log('Visit logged successfully to local backend.');
    }
  } catch (e) {
    console.log('Express backend log unavailable (running dynamically/statically).');
  }
}

async function runIntrusionScan() {
  writeToHUD('[SYS] TARGET ENGAGED. MONITORING CONSOLE DATA...');
  sfx.click();
  
  const visitorData = await fetchVisitorDetails();
  logVisitToBackend(visitorData);
  
  let logLines = [
    { text: `IP: ${visitorData.ip}`, type: 'success' },
    { text: `LOC: ${visitorData.city}, ${visitorData.country}`, type: 'info' },
    { text: `ISP: ${visitorData.isp}`, type: 'info' },
    { text: `OS: ${visitorData.os}`, type: 'info' },
    { text: `NAV: ${visitorData.browser}`, type: 'info' },
    { text: `RES: ${visitorData.screen}`, type: 'info' },
    { text: `TIME: ${new Date().toLocaleTimeString()}`, type: 'info' },
    { text: `BATTERY: ${visitorData.battery}`, type: 'info' },
    { text: `[SYS] CONSOLE INTRUSION COMPLETED.`, type: 'success' }
  ];
  
  for (let k = 0; k < logLines.length; k++) {
    await new Promise(resolve => setTimeout(resolve, 600));
    writeToHUD(logLines[k].text, logLines[k].type);
    sfx.click();
  }
  
  // Append minigame trigger button
  await new Promise(resolve => setTimeout(resolve, 400));
  const btnContainer = document.createElement('div');
  btnContainer.style.marginTop = '8px';
  btnContainer.innerHTML = `<button class="btn btn-primary btn-full" style="padding: 6px 8px; font-size: 0.72rem; border-radius: var(--radius-sm); font-family: var(--font-mono); width: 100%; border: 1px solid var(--accent); color: var(--accent); background: rgba(0, 212, 255, 0.05); cursor: pointer; transition: 0.2s;" onclick="runTerminalCmd('play')">BYPASS FIREWALL NODE</button>`;
  
  const btn = btnContainer.querySelector('button');
  btn.onmouseover = () => { btn.style.background = 'rgba(0, 212, 255, 0.2)'; btn.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.3)'; };
  btn.onmouseout = () => { btn.style.background = 'rgba(0, 212, 255, 0.05)'; btn.style.boxShadow = 'none'; };
  
  hudBody.appendChild(btnContainer);
  hudBody.scrollTop = hudBody.scrollHeight;
  sfx.beep();
}

// Start CLI and HUD scan on window load
window.addEventListener('load', () => {
  initTerminal();
  setTimeout(runIntrusionScan, 800);
});

