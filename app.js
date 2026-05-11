/* ================================================
   EduMatch Web3 — app.js
   Simulasi sistem blockchain, wallet, sertifikat,
   dan smart contract tanpa dependensi eksternal.
================================================ */

// ===== STATE GLOBAL =====
const state = {
  walletConnected: false,
  walletAddress: null,
  ethBalance: 0,
  eduTokens: 0,
  reputation: 0,
  sessions: [],
  transactions: [],
  certificates: [],
  selectedMentor: null,
  selectedDuration: 60,
};

// ===== DATA MENTOR =====
const MENTORS = [
  {
    id: 1, name: "Andi Pratama", emoji: "👨‍💻",
    title: "Senior Full-Stack Developer",
    skills: ["Web Development", "React", "Node.js"],
    rating: 4.9, reviews: 128,
    pricePerHour: 0.012, sessions: 340,
    walletAddr: "0x3A7f...d2B1",
    verified: true,
    bio: "8 tahun pengalaman di industri teknologi. Spesialisasi React, Node.js, dan arsitektur microservices. Mentor aktif di berbagai bootcamp."
  },
  {
    id: 2, name: "Sari Dewi", emoji: "👩‍🎨",
    title: "Lead UI/UX Designer",
    skills: ["UI/UX Design", "Figma", "Design System"],
    rating: 4.8, reviews: 94,
    pricePerHour: 0.009, sessions: 210,
    walletAddr: "0x9C2e...f4A3",
    verified: true,
    bio: "Designer dengan portofolio di 30+ startup Indonesia. Expert Figma, design thinking, dan UX research. Pernah bekerja di GoTo dan Tokopedia."
  },
  {
    id: 3, name: "Budi Santoso", emoji: "🧠",
    title: "Data Scientist & ML Engineer",
    skills: ["Data Science", "Python", "Machine Learning"],
    rating: 4.7, reviews: 76,
    pricePerHour: 0.015, sessions: 180,
    walletAddr: "0x1F5a...c8D7",
    verified: true,
    bio: "PhD Data Science UI. Berpengalaman di analisis data finansial dan computer vision. Penulis 3 paper di jurnal internasional."
  },
  {
    id: 4, name: "Rizky Fauzan", emoji: "⛓️",
    title: "Blockchain Developer",
    skills: ["Blockchain", "Solidity", "Web3.js"],
    rating: 4.9, reviews: 52,
    pricePerHour: 0.02, sessions: 130,
    walletAddr: "0x7D8b...e3F2",
    verified: true,
    bio: "Core developer di beberapa DeFi protocol. Expert Solidity, smart contract security audit, dan pengembangan dApp di Ethereum & Polygon."
  },
  {
    id: 5, name: "Nina Kartika", emoji: "📱",
    title: "Mobile Developer (React Native)",
    skills: ["Mobile Dev", "React Native", "Flutter"],
    rating: 4.6, reviews: 88,
    pricePerHour: 0.011, sessions: 195,
    walletAddr: "0x4E6c...a1B9",
    verified: true,
    bio: "Developer aplikasi mobile dengan 50+ app di Play Store dan App Store. Spesialis React Native dan Flutter dengan klien multinasional."
  },
  {
    id: 6, name: "Hendra Wijaya", emoji: "☁️",
    title: "Cloud & DevOps Engineer",
    skills: ["DevOps", "AWS", "Kubernetes"],
    rating: 4.7, reviews: 63,
    pricePerHour: 0.013, sessions: 145,
    walletAddr: "0x2B3d...f7C5",
    verified: true,
    bio: "AWS Certified Solutions Architect. Berpengalaman setup infrastruktur cloud skala enterprise. Pernah mengelola sistem dengan 10M+ request/hari."
  },
];

// ===== FAKE BLOCKCHAIN UTILS =====
function generateHash() {
  const chars = '0123456789abcdef';
  return '0x' + Array.from({length: 40}, () => chars[Math.floor(Math.random() * 16)]).join('');
}
function generateAddress() {
  const hash = generateHash();
  return hash.slice(0, 6) + '...' + hash.slice(-4);
}
function generateTxHash() {
  return generateHash().slice(0, 10) + '...' + generateHash().slice(-6);
}
function randomEth(min, max) {
  return (Math.random() * (max - min) + min).toFixed(4);
}
function truncateAddress(addr) {
  if (!addr) return '';
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

// ===== WALLET =====
function connectWallet() {
  if (state.walletConnected) { return; }
  showToast('🦊 Menghubungkan MetaMask...', 'info');
  // Simulate connection delay
  setTimeout(() => {
    state.walletConnected = true;
    state.walletAddress = '0x' + Math.random().toString(16).slice(2, 10).toUpperCase() + '...F3a9';
    state.ethBalance = parseFloat(randomEth(0.5, 3.0));
    state.eduTokens = Math.floor(Math.random() * 500 + 100);
    state.reputation = Math.floor(Math.random() * 30 + 70);

    // Mock transactions
    state.transactions = [
      { name: 'Sesi: React Fundamentals', hash: generateTxHash(), amount: '-0.0120 ETH', status: 'confirmed', icon: '📤', time: '2 jam lalu' },
      { name: 'Release Payment', hash: generateTxHash(), amount: '+0.0200 ETH', status: 'confirmed', icon: '📥', time: '1 hari lalu' },
      { name: 'Sesi: Solidity Basics', hash: generateTxHash(), amount: '-0.0150 ETH', status: 'confirmed', icon: '📤', time: '3 hari lalu' },
      { name: 'Bonus EDU Token', hash: generateTxHash(), amount: '+50 EDU', status: 'confirmed', icon: '🪙', time: '5 hari lalu' },
    ];

    // Mock active sessions
    state.sessions = [
      { mentor: 'Andi Pratama', skill: 'Web Development', status: 'escrow', amount: '0.0120 ETH', date: 'Besok, 14:00 WIB' },
      { mentor: 'Budi Santoso', skill: 'Data Science', status: 'completed', amount: '0.0150 ETH', date: '3 hari lalu' },
    ];

    // Mock certificates
    state.certificates = [
      { name: 'React Developer Certificate', issuer: 'Dicoding', skill: 'Web Development', hash: generateHash(), date: '2024-03-15', ipfs: 'QmX7f2...' },
      { name: 'Python for Data Science', issuer: 'Coursera', skill: 'Data Science', hash: generateHash(), date: '2024-01-20', ipfs: 'QmA4d9...' },
    ];

    updateWalletUI();
    showToast('✅ Wallet berhasil terhubung!', 'success');
    renderDashboard();
    renderCertificates();
  }, 1200);
}

function updateWalletUI() {
  const btn = document.getElementById('walletBtn');
  const txt = document.getElementById('walletText');
  if (state.walletConnected) {
    btn.classList.add('connected');
    txt.textContent = truncateAddress(state.walletAddress);
  }
}

// ===== NAVIGATION =====
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  const nav = document.getElementById('nav-' + page);
  if (el) el.classList.add('active');
  if (nav) nav.classList.add('active');

  if (page === 'mentors') renderMentors(MENTORS);
  if (page === 'dashboard') renderDashboard();
  if (page === 'certificates') renderCertificates();
}

// ===== TOAST =====
function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.borderColor = type === 'success' ? 'var(--accent3)' : type === 'error' ? 'var(--danger)' : 'var(--accent)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== MENTORS =====
function renderMentors(mentors) {
  const grid = document.getElementById('mentorsGrid');
  if (!mentors.length) {
    grid.innerHTML = '<div class="empty-state">🔍 Tidak ada mentor ditemukan.</div>';
    return;
  }
  grid.innerHTML = mentors.map(m => `
    <div class="mentor-card" onclick="openBooking(${m.id})">
      <div class="mentor-top">
        <div class="mentor-avatar" style="background:${avatarBg(m.id)}">${m.emoji}</div>
        <div class="mentor-info">
          <div class="mentor-name">${m.name}</div>
          <div class="mentor-title">${m.title}</div>
          ${m.verified ? `<div class="mentor-verified">✓ On-Chain Verified</div>` : ''}
        </div>
      </div>
      <div class="mentor-skills">
        ${m.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
      <div class="mentor-meta">
        <div class="mentor-rating">
          <span class="stars">★★★★★</span>
          <span class="rating-num">${m.rating}</span>
          <span class="rating-count">(${m.reviews} ulasan)</span>
        </div>
        <div class="mentor-price">${m.pricePerHour} ETH/jam</div>
      </div>
    </div>
  `).join('');
}

function avatarBg(id) {
  const colors = [
    'rgba(0,229,255,0.15)', 'rgba(124,58,237,0.15)',
    'rgba(16,185,129,0.15)', 'rgba(245,158,11,0.15)',
    'rgba(239,68,68,0.15)', 'rgba(59,130,246,0.15)',
  ];
  return colors[(id - 1) % colors.length];
}

function filterMentors() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const skill = document.getElementById('filterSkill').value;
  const price = document.getElementById('filterPrice').value;
  let filtered = MENTORS.filter(m => {
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.skills.some(s => s.toLowerCase().includes(q));
    const matchSkill = !skill || m.skills.includes(skill);
    const matchPrice = !price ||
      (price === 'low' && m.pricePerHour < 0.01) ||
      (price === 'high' && m.pricePerHour >= 0.01);
    return matchQ && matchSkill && matchPrice;
  });
  renderMentors(filtered);
}

// ===== BOOKING MODAL =====
function openBooking(id) {
  state.selectedMentor = MENTORS.find(m => m.id === id);
  state.selectedDuration = 60;
  renderModal();
  document.getElementById('bookingModal').classList.add('open');
}

function renderModal() {
  const m = state.selectedMentor;
  const dur = state.selectedDuration;
  const price = ((m.pricePerHour * dur) / 60).toFixed(4);
  const gasFee = '0.0003';
  const total = (parseFloat(price) + parseFloat(gasFee)).toFixed(4);

  document.getElementById('modalBody').innerHTML = `
    <div class="modal-mentor-header">
      <div class="modal-avatar" style="background:${avatarBg(m.id)}">${m.emoji}</div>
      <div>
        <div class="modal-name">${m.name}</div>
        <div class="modal-sub">${m.title}</div>
        <div class="mentor-verified" style="margin-top:6px">✓ On-Chain Verified · ⭐ ${m.rating} (${m.reviews})</div>
      </div>
    </div>
    <p style="color:var(--text2);font-size:0.85rem;margin-bottom:20px;">${m.bio}</p>

    <p style="font-weight:700;margin-bottom:12px;font-size:0.85rem;">Pilih Durasi Sesi:</p>
    <div class="session-options">
      ${[30,60,90,120].map(d => `
        <div class="session-opt ${d === dur ? 'selected' : ''}" onclick="selectDuration(${d})">
          <div class="opt-dur">${d} menit</div>
          <div class="opt-price">${((m.pricePerHour * d) / 60).toFixed(4)} ETH</div>
        </div>
      `).join('')}
    </div>

    <div class="payment-info">
      <div class="pay-row"><span class="pay-label">Harga Sesi</span><span class="pay-val">${price} ETH</span></div>
      <div class="pay-row"><span class="pay-label">Gas Fee (est.)</span><span class="pay-val">${gasFee} ETH</span></div>
      <div class="pay-row"><span class="pay-label">Platform Fee</span><span class="pay-val">0.0000 ETH (Gratis!)</span></div>
      <div class="pay-row total"><span class="pay-label" style="font-weight:700">Total (Escrow)</span><span class="pay-val accent">${total} ETH</span></div>
    </div>
    <p style="font-size:0.75rem;color:var(--text3);font-family:var(--mono);margin-bottom:16px;">
      💡 Dana dikunci di smart contract hingga sesi selesai. Aman, transparan, otomatis.
    </p>
    <button class="btn-book" onclick="confirmBooking()">⚡ Konfirmasi & Bayar via Smart Contract</button>
  `;
}

function selectDuration(dur) {
  state.selectedDuration = dur;
  renderModal();
}

function confirmBooking() {
  if (!state.walletConnected) {
    showToast('⚠️ Hubungkan wallet MetaMask terlebih dahulu!', 'error');
    return;
  }
  const m = state.selectedMentor;
  const price = ((m.pricePerHour * state.selectedDuration) / 60).toFixed(4);

  document.getElementById('modalBody').innerHTML = `
    <div style="text-align:center;padding:32px 0">
      <div style="font-size:2.5rem;margin-bottom:16px">⛓️</div>
      <h3 style="margin-bottom:8px">Memproses Transaksi...</h3>
      <p style="color:var(--text2);font-size:0.85rem;margin-bottom:24px">
        Mengirim ${price} ETH ke smart contract escrow...
      </p>
      <div class="loading-dots"><span></span><span></span><span></span></div>
    </div>
  `;

  setTimeout(() => {
    const txHash = generateTxHash();
    state.transactions.unshift({
      name: `Sesi: ${m.skills[0]} dengan ${m.name}`,
      hash: txHash, amount: `-${price} ETH`, status: 'confirmed', icon: '📤', time: 'Baru saja'
    });
    state.sessions.unshift({
      mentor: m.name, skill: m.skills[0], status: 'escrow', amount: `${price} ETH`, date: 'Hari ini'
    });

    document.getElementById('modalBody').innerHTML = `
      <div style="text-align:center;padding:32px 0">
        <div style="font-size:3rem;margin-bottom:16px">✅</div>
        <h3 style="margin-bottom:8px;color:var(--accent3)">Booking Berhasil!</h3>
        <p style="color:var(--text2);font-size:0.85rem;margin-bottom:20px">
          ${price} ETH telah dikunci di smart contract escrow.<br>
          Dana akan otomatis dikirim setelah sesi selesai.
        </p>
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px;text-align:left;margin-bottom:20px">
          <div style="font-size:0.72rem;color:var(--text3);font-family:var(--mono);margin-bottom:6px">TX HASH</div>
          <div style="font-family:var(--mono);font-size:0.8rem;color:var(--accent)">${txHash}</div>
        </div>
        <button class="btn-primary" onclick="closeBookingModal();showPage('dashboard')">
          Lihat di Dashboard →
        </button>
      </div>
    `;
    showToast('✅ Transaksi on-chain berhasil!', 'success');
  }, 2000);
}

function closeModal(e) {
  if (e.target.id === 'bookingModal') closeBookingModal();
}
function closeBookingModal() {
  document.getElementById('bookingModal').classList.remove('open');
}

// ===== DASHBOARD =====
function renderDashboard() {
  if (!state.walletConnected) {
    document.getElementById('dashNotConnected').style.display = 'block';
    document.getElementById('dashConnected').style.display = 'none';
    return;
  }
  document.getElementById('dashNotConnected').style.display = 'none';
  document.getElementById('dashConnected').style.display = 'block';

  document.getElementById('dashAddress').textContent = state.walletAddress;
  document.getElementById('dashEth').textContent = state.ethBalance.toFixed(4) + ' ETH';
  document.getElementById('dashEdu').textContent = state.eduTokens + ' EDU';
  document.getElementById('dashRep').textContent = state.reputation + ' / 100';

  document.getElementById('dsTotalSesi').textContent = state.sessions.length;
  document.getElementById('dsSelesai').textContent = state.sessions.filter(s => s.status === 'completed').length;
  document.getElementById('dsPending').textContent = state.sessions.filter(s => s.status === 'escrow').length;
  document.getElementById('dsRating').textContent = '4.85';

  // Transactions
  const txList = document.getElementById('txList');
  if (!state.transactions.length) {
    txList.innerHTML = '<div class="empty-state">Belum ada transaksi.</div>';
  } else {
    txList.innerHTML = state.transactions.map(tx => `
      <div class="tx-item">
        <div class="tx-left">
          <div class="tx-icon">${tx.icon}</div>
          <div>
            <div class="tx-name">${tx.name}</div>
            <div class="tx-hash">${tx.hash} · ${tx.time}</div>
          </div>
        </div>
        <div class="tx-right">
          <div class="tx-amount">${tx.amount}</div>
          <div class="tx-status ${tx.status}">${tx.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}</div>
        </div>
      </div>
    `).join('');
  }

  // Sessions
  const sessions = document.getElementById('activeSessions');
  if (!state.sessions.length) {
    sessions.innerHTML = '<div class="empty-state">Belum ada sesi aktif.</div>';
  } else {
    sessions.innerHTML = state.sessions.map(s => `
      <div class="session-item">
        <div>
          <div class="sess-mentor">${s.mentor}</div>
          <div class="sess-skill">${s.skill} · ${s.date} · ${s.amount}</div>
        </div>
        <span class="sess-badge ${s.status}">${s.status === 'escrow' ? '⏳ Dalam Escrow' : '✅ Selesai'}</span>
      </div>
    `).join('');
  }
}

// ===== CERTIFICATES =====
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  document.getElementById('uploadArea').innerHTML = `
    <div class="upload-icon">✅</div>
    <p><strong>${file.name}</strong></p>
    <small>${(file.size / 1024).toFixed(1)} KB · Siap diupload</small>
  `;
  document.getElementById('uploadForm').style.display = 'block';
}

function dragOver(e) {
  e.preventDefault();
  document.getElementById('uploadArea').classList.add('dragover');
}

function dropFile(e) {
  e.preventDefault();
  document.getElementById('uploadArea').classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) {
    const input = document.getElementById('certFile');
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    handleFileUpload({ target: { files: [file] } });
  }
}

function uploadCertificate() {
  if (!state.walletConnected) {
    showToast('⚠️ Hubungkan wallet MetaMask terlebih dahulu!', 'error');
    return;
  }
  const name = document.getElementById('certName').value.trim();
  const issuer = document.getElementById('certIssuer').value.trim();
  const skill = document.getElementById('certSkill').value.trim();
  if (!name || !issuer || !skill) {
    showToast('⚠️ Lengkapi semua field sertifikat!', 'error');
    return;
  }

  showToast('⛓️ Menyimpan ke IPFS & Blockchain...', 'info');
  setTimeout(() => {
    const cert = {
      name, issuer, skill,
      hash: generateHash(),
      date: new Date().toISOString().split('T')[0],
      ipfs: 'Qm' + Math.random().toString(36).slice(2, 10),
    };
    state.certificates.unshift(cert);
    renderCertificates();
    // Reset form
    document.getElementById('certName').value = '';
    document.getElementById('certIssuer').value = '';
    document.getElementById('certSkill').value = '';
    document.getElementById('uploadForm').style.display = 'none';
    document.getElementById('uploadArea').innerHTML = `
      <div class="upload-icon">📄</div>
      <p>Klik atau drag & drop file sertifikat</p>
      <small>PDF, JPG, PNG — Max 10MB</small>
    `;
    showToast('✅ Sertifikat berhasil disimpan di blockchain!', 'success');
  }, 1800);
}

function verifyCertificate() {
  const hash = document.getElementById('verifyHash').value.trim();
  const result = document.getElementById('verifyResult');
  if (!hash) { showToast('⚠️ Masukkan hash sertifikat!', 'error'); return; }

  result.innerHTML = `<div style="color:var(--text2);font-family:var(--mono);font-size:0.8rem;padding:12px">🔍 Memverifikasi di blockchain...</div>`;

  setTimeout(() => {
    // Check local certs or random result
    const found = state.certificates.find(c => c.hash === hash);
    if (found) {
      result.innerHTML = `
        <div class="verify-success">
          ✅ <strong>Sertifikat Valid!</strong>
          <div class="verify-detail">
            Nama: ${found.name}<br>
            Penerbit: ${found.issuer}<br>
            Skill: ${found.skill}<br>
            Tanggal: ${found.date}<br>
            IPFS: ${found.ipfs}
          </div>
        </div>
      `;
    } else {
      result.innerHTML = `
        <div class="verify-fail">
          ❌ <strong>Hash Tidak Ditemukan</strong>
          <div class="verify-detail" style="color:var(--text3)">
            Hash ini tidak terdaftar di blockchain EduMatch.<br>
            Pastikan hash yang Anda masukkan benar.
          </div>
        </div>
      `;
    }
  }, 1200);
}

function renderCertificates() {
  const list = document.getElementById('certsList');
  if (!state.certificates.length) {
    list.innerHTML = '<div class="empty-state">Belum ada sertifikat tersimpan.</div>';
    return;
  }
  list.innerHTML = state.certificates.map(c => `
    <div class="cert-item">
      <div class="cert-icon">🏅</div>
      <div class="cert-info">
        <div class="cert-name">${c.name}</div>
        <div class="cert-meta">
          <span class="cert-issuer">📌 ${c.issuer} · ${c.date}</span>
          <span class="cert-hash">Hash: ${c.hash.slice(0, 18)}...</span>
        </div>
      </div>
      <span class="cert-badge">✓ On-Chain</span>
    </div>
  `).join('');
}

// ===== HERO CANVAS ANIMATION =====
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particles
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  function drawHex(ctx, x, y, size, opacity) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  let hexes = Array.from({ length: 12 }, () => ({
    x: Math.random() * 1200,
    y: Math.random() * 800,
    size: Math.random() * 40 + 20,
    opacity: Math.random() * 0.12 + 0.03,
    speed: Math.random() * 0.2 + 0.05,
    phase: Math.random() * Math.PI * 2,
  }));

  let t = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.005;

    // Draw hexagons
    hexes.forEach(h => {
      h.y -= h.speed;
      if (h.y + h.size < 0) {
        h.y = canvas.height + h.size;
        h.x = Math.random() * canvas.width;
      }
      const pulse = Math.sin(t + h.phase) * 0.04;
      drawHex(ctx, h.x, h.y, h.size, h.opacity + pulse);
    });

    // Draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,229,255,${p.opacity})`;
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,229,255,${0.08 * (1 - dist / 80)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 24);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  setTimeout(animateCounters, 400);
  renderMentors(MENTORS);

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.style.background = window.scrollY > 20
      ? 'rgba(8,11,16,0.96)'
      : 'rgba(8,11,16,0.85)';
  });
});
