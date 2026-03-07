/* script.js - initialize map, charts, navbar behavior, and UI interactions */
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  initMapAndUI();
  setupSmoothScroll();
  setupIdeaToggle();
});

/* NAVBAR: hamburger toggle + active link handling */
function setupNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('show');
    });
  }

  // Auto-hide mobile menu when link clicked
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      if (navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      }
      // update active link class
      document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
      a.classList.add('active');
    });
  });
}

/* Smooth scroll for anchor links */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* Idea section toggle */
function setupIdeaToggle() {
  const toggleBtn = document.getElementById('toggleIdeaBtn');
  const ideaSection = document.getElementById('ideaSection');
  if (!toggleBtn || !ideaSection) return;

  toggleBtn.addEventListener('click', () => {
    if (ideaSection.style.display === 'none') {
      ideaSection.style.display = '';
      toggleBtn.textContent = 'Hide';
    } else {
      ideaSection.style.display = 'none';
      toggleBtn.textContent = 'Show';
    }
  });
}

/* MAP & UI Initialization */
function initMapAndUI() {
  // Map container check
  const mapEl = document.getElementById('map');
  if (!mapEl) {
    console.error('Map container (#map) not found.');
    return;
  }

  // Initialize Leaflet map
  const map = L.map('map', { preferCanvas: true }).setView([20.5937, 78.9629], 5);

  // Base layers
  const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CARTO' });
  const light = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' });
  const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri' });

  dark.addTo(map);

  // Sample data (replace with API)
  const sampleStrikes = [
    [19.076, 72.8777, 0.92, '2025-11-12T07:40:00Z', 'Mumbai'],
    [13.0827, 80.2707, 0.68, '2025-11-12T08:10:00Z', 'Chennai'],
    [18.5204, 73.8567, 0.45, '2025-11-12T06:50:00Z', 'Pune'],
    [26.9124, 75.7873, 0.81, '2025-11-12T05:30:00Z', 'Jaipur'],
    [28.6139, 77.2090, 0.62, '2025-11-12T04:20:00Z', 'Delhi']
  ];

  // Heatmap
  const heatPoints = sampleStrikes.map(s => [s[0], s[1], s[2]]);
  const heat = L.heatLayer(heatPoints, { radius: 22, blur: 18, maxZoom: 10, gradient: { 0.3: 'blue', 0.5: 'lime', 0.7: 'orange', 1.0: 'red' } });

  // Marker cluster
  const markers = L.markerClusterGroup({ chunkedLoading: true });
  sampleStrikes.forEach(([lat, lng, intensity, ts, place]) => {
    const color = intensity >= 0.8 ? '#e63946' : (intensity >= 0.6 ? '#ffb703' : '#fefae0');
    const r = 6 + Math.round(intensity * 10);
    const cm = L.circleMarker([lat, lng], { radius: r, color: color, weight: 1.2, fillColor: color, fillOpacity: 0.85 });
    const popup = `<strong>${place || 'Unknown'}</strong><br/>Risk: <b style="color:${color}">${intensity >= 0.8 ? 'High' : (intensity >= 0.6 ? 'Moderate' : 'Low')}</b><br/>Intensity: ${Math.round(intensity*100)}%<br/>Time: ${ts || '—'}`;
    cm.bindPopup(popup);

    cm.on('mouseover', function () { this.setStyle({ weight: 2.6, color: '--neon', fillOpacity: 1.0 }); this.setRadius(r + 6); if (this.bringToFront) this.bringToFront(); });
    cm.on('mouseout', function () { this.setStyle({ weight: 1.2, color: color, fillOpacity: 0.85 }); this.setRadius(r); });

    markers.addLayer(cm);
  });

  // Sample polygons (risk zones)
  const highZone = L.polygon([[18.8,72.6],[19.3,72.6],[19.3,73.1],[18.8,73.1]], { color:'red', fillOpacity:0.14, weight:1.4 }).bindPopup('High Risk Zone');
  const modZone  = L.polygon([[13.0,80.0],[13.3,80.0],[13.3,80.4],[13.0,80.4]], { color:'orange', fillOpacity:0.12, weight:1.2 }).bindPopup('Moderate Zone');
  const lowZone  = L.polygon([[18.4,73.6],[18.7,73.6],[18.7,74.0],[18.4,74.0]], { color:'yellow', fillOpacity:0.09, weight:1.0 }).bindPopup('Low Risk Zone');

  const baseLayers = { "Dark": dark, "Light": light, "Satellite": satellite };
  const overlayLayers = { "Heatmap": heat, "Clusters": markers, "High Risk": highZone, "Moderate": modZone, "Low": lowZone };

  L.control.layers(baseLayers, overlayLayers, { collapsed: false }).addTo(map);

  // Add defaults
  markers.addTo(map);
  heat.addTo(map);
  highZone.addTo(map);
  modZone.addTo(map);
  lowZone.addTo(map);

  map.attributionControl.setPrefix('');

  // Charts (Chart.js)
  try {
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pie = new Chart(pieCtx, {
      type: 'pie',
      data: { labels:['High','Moderate','Low'], datasets:[{ data:[8,12,20], backgroundColor:['#e63946','#ffb703','#fefae0'] }]},
      options: { plugins:{ legend:{ labels:{ color:'#d0eef7' }}}}
    });

    const barCtx = document.getElementById('barChart').getContext('2d');
    const bar = new Chart(barCtx, {
      type: 'bar',
      data: { labels:['00:00','04:00','08:00','12:00','16:00','20:00'], datasets:[{ label:'Strikes', data:[10,15,25,35,30,20], backgroundColor:'#00eaff' }]},
      options: { scales:{ x: { ticks:{ color:'#dbeef6' } }, y: { ticks:{ color:'#dbeef6' } }}, plugins:{ legend:{ labels:{ color:'#dbeef6' }}}}
    });
  } catch (err) {
    console.warn('Chart init failed', err);
  }

  // Alerts (example)
  const alertsList = document.getElementById('alertsList');
  if (alertsList) {
    alertsList.innerHTML = `
      <li><span class="red-dot"></span> High-Risk detected near Mumbai (Intensity: 92%)</li>
      <li><span class="orange-dot"></span> Moderate activity near Chennai (Intensity: 68%)</li>
    `;
  }

  // expose objects for debugging (optional)
  window._LPM = { map, markers, heat, highZone, modZone, lowZone };
}
