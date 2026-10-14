/* =====================================================================
   dashboard.js  —  Stackly · Healthcare Management
   Shared by patient.html + doctor.html.

   The page tells us who it is via <html data-dash-role="patient|doctor">.
   From that we:
     1. guard the route (no signed-in user -> back to login)
     2. build the sidebar menu and every view body for that role
     3. wire the shell: drawer, search, logout, toasts

   localStorage contract (shared with auth.js):
     stacklyUser  { name, email, role }   -> the signed-in visitor
   ===================================================================== */

(function () {
  'use strict';

  var doc = document;
  var win = window;
  var root = doc.documentElement;

  var REDUCED = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- role contract ---------- */
  var ROLE_FILE = { patient: 'patient.html', doctor: 'doctor.html' };

  var ROLES = {
    patient: { label: 'Patient', icon: 'fa-user', tagline: 'Book care, track results and keep every record in one place.' },
    doctor:  { label: 'Doctor',  icon: 'fa-user-doctor', tagline: 'Run your list, note every round and keep the clinic moving.' }
  };

  var role = String(root.getAttribute('data-dash-role') || '').trim();
  if (!ROLES[role]) return;

  /* ---------- localStorage helpers ---------- */
  function read(key) {
    try { return win.localStorage.getItem(key); } catch (e) { return null; }
  }
  function write(key, value) {
    try { win.localStorage.setItem(key, value); } catch (e) {}
  }
  function clear(key) {
    try { win.localStorage.removeItem(key); } catch (e) {}
  }

  /* ---------- auth guard ----------
     no session -> login. if the stored role points at the OTHER dashboard we
     send them somewhere useful instead of rendering the wrong desk. */
  var user = null;
  try { user = JSON.parse(read('stacklyUser') || 'null'); } catch (e) {}
  if (!user || !user.email || !ROLES[user.role]) {
    win.location.replace('login.html');
    return;
  }
  if (user.role !== role) {
    win.location.replace(ROLE_FILE[user.role]);
    return;
  }

  var greetName = String(user.name || user.email.split('@')[0] || 'there').trim();

  function initials(name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'S';
    return parts[0].charAt(0).toUpperCase();
  }

  /* =====================================================================
     MENUS
     ===================================================================== */
  var MENUS = {
    patient: [
      { id: 'overview',      label: 'Overview',      icon: 'fa-chart-pie' },
      { id: 'appointments',  label: 'Appointments',  icon: 'fa-calendar-check' },
      { id: 'records',       label: 'My Records',    icon: 'fa-file-medical' },
      { id: 'prescriptions', label: 'Prescriptions', icon: 'fa-prescription-bottle-medical' },
      { id: 'messages',      label: 'Messages',      icon: 'fa-comments' }
    ],
    doctor: [
      { id: 'overview',      label: 'Overview',      icon: 'fa-gauge-high' },
      { id: 'appointments',  label: 'Appointments',  icon: 'fa-calendar-check' },
      { id: 'patients',      label: 'My Patients',   icon: 'fa-hospital-user' },
      { id: 'prescriptions', label: 'Prescriptions', icon: 'fa-prescription-bottle-medical' },
      { id: 'messages',      label: 'Messages',      icon: 'fa-comments' }
    ]
  };

  var menu = MENUS[role];

  /* =====================================================================
     DATA
     ===================================================================== */
  var DEPTS = ['Cardiology', 'Pediatrics', 'Orthopedics', 'Radiology', 'Dermatology', 'Oncology'];

  var DATA = {
    patient: {
      next: [
        { doc: 'Dr. Alana Yorke',   dept: 'Cardiology', img: '../Images/doctor-03.webp', when: 'Today · 10:30 AM',  place: 'Room 214 · OPD',   state: 'ok',   label: 'Confirmed' },
        { doc: 'Dr. Omar Kent',     dept: 'Orthopedics', img: '../Images/doctor-07.webp', when: 'Thu · 2:00 PM',    place: 'Room 108 · Block B', state: 'warn', label: 'Check-in' },
        { doc: 'Dr. Priya Nand',    dept: 'Dermatology', img: '../Images/doctor-12.webp', when: 'Mon · 9:15 AM',   place: 'Virtual care',      state: 'mute', label: 'Scheduled' }
      ],
      meds: [
        { name: 'Atorvastatin 10mg', note: 'Once daily · after dinner', done: true,  time: '8:00 PM' },
        { name: 'Vitamin D3 2000IU', note: 'Once daily · with breakfast', done: true, time: '8:00 AM' },
        { name: 'Naproxen 250mg',    note: 'As needed · max 2 per day', done: false, time: 'Evening' }
      ],
      activity: [
        { icon: 'fa-vial',              title: 'Lipid profile uploaded',   note: 'Reviewed by Dr. Alana Yorke', when: '2h ago' },
        { icon: 'fa-prescription',      title: 'Prescription renewed',     note: 'Atorvastatin · 30 days',      when: 'Yesterday' },
        { icon: 'fa-calendar-check',    title: 'Visit confirmed',          note: 'Cardiology · Today',          when: '2d ago' },
        { icon: 'fa-message',           title: 'New message',              note: 'From Dr. Omar Kent',          when: '3d ago' }
      ],
      vitals: [
        { icon: 'fa-heart-pulse', label: 'Blood pressure', value: '118/76', note: 'Stable this month' },
        { icon: 'fa-weight-scale', label: 'Weight',         value: '71.4 kg', note: 'Down 0.6 kg' },
        { icon: 'fa-lungs',        label: 'Resting pulse',  value: '72 bpm',  note: 'Within range' },
        { icon: 'fa-droplet',      label: 'Blood sugar',    value: '94 mg/dL', note: 'Fasting · normal' }
      ],
      care: [
        { k: 'Primary physician', v: 'Dr. Ade Faseyi' },
        { k: 'Membership',        v: 'Stackly Care Plus' },
        { k: 'Allergies',         v: 'Penicillin' },
        { k: 'Blood group',       v: 'O positive' },
        { k: 'Next review',       v: '18 May' }
      ],
      plan: [
        { label: 'Annual health check', pct: 72 },
        { label: 'Cardio rehabilitation', pct: 45 },
        { label: 'Vaccination schedule', pct: 100 }
      ]
    },

    doctor: {
      schedule: [
        { name: 'Amara Osei',     dept: 'Cardiology', img: '../Images/doctor-02.webp', when: '09:30 AM', reason: 'Follow-up · BP review', state: 'ok',   label: 'In room' },
        { name: 'Daniel Whitfield', dept: 'Orthopedics', img: '../Images/doctor-05.webp', when: '10:15 AM', reason: 'Post-op check',        state: 'warn', label: 'Waiting' },
        { name: 'Grace Miller',   dept: 'Pediatrics', img: '../Images/doctor-09.webp', when: '11:00 AM', reason: 'Vaccination visit',     state: 'mute', label: 'Booked' },
        { name: 'Isaac Brandt',   dept: 'Radiology',  img: '../Images/doctor-11.webp', when: '11:45 AM', reason: 'MRI · results review',  state: 'mute', label: 'Booked' }
      ],
      patients: [
        { name: 'Amara Osei',      id: 'PT-4821', img: '../Images/doctor-04.webp', cond: 'Hypertension',  last: 'Today',     state: 'ok',   label: 'Stable' },
        { name: 'Daniel Whitfield', id: 'PT-3170', img: '../Images/doctor-06.webp', cond: 'ACL recovery',  last: '2d ago',    state: 'warn', label: 'Monitor' },
        { name: 'Grace Miller',    id: 'PT-2298', img: '../Images/doctor-08.webp', cond: 'Asthma',        last: '5d ago',    state: 'mute', label: 'Routine' },
        { name: 'Isaac Brandt',    id: 'PT-5540', img: '../Images/doctor-10.webp', cond: 'Migraine',      last: '1w ago',    state: 'bad',  label: 'Escalate' }
      ],
      notes: [
        { title: 'Sign off 4 discharge notes', note: 'Ward B · due before 5 PM', done: false, time: 'Today' },
        { title: 'Review lipid panel · A. Osei', note: 'Cardiology', done: false, time: '11:00 AM' },
        { title: 'Confirm MRI report · I. Brandt', note: 'Radiology', done: true, time: 'Done' }
      ],
      feed: [
        { icon: 'fa-flask-vial',   title: 'Lab result ready',      note: 'PT-4821 · lipid panel',      when: '12m ago' },
        { icon: 'fa-x-ray',        title: 'Imaging uploaded',      note: 'PT-5540 · MRI brain',        when: '40m ago' },
        { icon: 'fa-bed-pulse',    title: 'Bed 214 now free',      note: 'Ward B',                     when: '1h ago' },
        { icon: 'fa-message',      title: 'Nurse handover note',   note: 'Ward A · night shift',       when: '2h ago' }
      ],
      target: [
        { label: 'Consultations seen', pct: 82 },
        { label: 'Notes completed',    pct: 58 },
        { label: 'Follow-ups booked',  pct: 64 }
      ]
    }
  };

  var data = DATA[role];

  /* =====================================================================
     TINY HTML HELPERS
     ===================================================================== */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pill(state, label) {
    var cls = state === 'ok' ? 'pill--ok'
      : state === 'warn' ? 'pill--warn'
      : state === 'bad' ? 'pill--bad'
      : 'pill--mute';
    return '<span class="pill ' + cls + '">' + esc(label) + '</span>';
  }

  function panel(title, linkId, linkLabel, inner) {
    var head = '<div class="panel__head"><h3>' + esc(title) + '</h3>';
    if (linkId) head += '<button type="button" data-go="' + esc(linkId) + '">' + esc(linkLabel || 'View all') + '</button>';
    head += '</div>';
    return '<section class="panel">' + head + inner + '</section>';
  }

  /* =====================================================================
     SHARED BLOCKS
     ===================================================================== */
  function heroBlock(tag, title, sub) {
    return '' +
      '<header class="card-hero">' +
        '<div>' +
          '<p class="hero-tag"><i class="fa-solid fa-heart-pulse"></i> ' + esc(tag) + '</p>' +
          '<h2 class="hero-title">' + title + '</h2>' +
          '<p class="hero-sub">' + esc(sub) + '</p>' +
        '</div>' +
      '</header>';
  }

  function statStrip(items) {
    var cells = items.map(function (s) {
      return '<div class="stat-cell">' +
        '<i class="fa-solid ' + esc(s.icon) + '"></i>' +
        '<div><strong>' + esc(s.value) + '</strong><span>' + esc(s.label) + '</span></div>' +
      '</div>';
    }).join('');
    return '<div class="stat-strip">' + cells + '</div>';
  }

  function quickBlock(items) {
    var btns = items.map(function (q) {
      return '<button type="button" data-go="' + esc(q.go) + '"><i class="fa-solid ' + esc(q.icon) + '"></i> ' + esc(q.label) + '</button>';
    }).join('');
    return '<section class="panel"><div class="panel__head"><h3>Quick actions</h3></div>' +
      '<div class="quick">' + btns + '</div></section>';
  }

  /* =====================================================================
     PATIENT VIEWS
     ===================================================================== */
  var PATIENT_VIEWS = {
    overview: function () {
      var next = data.next.map(function (r) {
        return '<tr><td><div class="cell-prod"><img src="' + esc(r.img) + '" alt="" loading="lazy" />' +
          '<div><strong>' + esc(r.doc) + '</strong><span>' + esc(r.dept) + '</span></div></div></td>' +
          '<td>' + esc(r.when) + '</td><td>' + esc(r.place) + '</td><td>' + pill(r.state, r.label) + '</td></tr>';
      }).join('');

      var care = data.care.map(function (r) {
        return '<div class="kv__row"><span>' + esc(r.k) + '</span><strong>' + esc(r.v) + '</strong></div>';
      }).join('');

      var plans = data.plan.map(function (p) {
        return '<div class="prog"><div class="prog__top"><span>' + esc(p.label) + '</span>' +
          '<span>' + p.pct + '%</span></div><div class="prog__track">' +
          '<div class="prog__fill" data-fill="' + p.pct + '"></div></div></div>';
      }).join('');

      var vitals = data.vitals.map(function (v) {
        return '<div class="tile"><span class="tile__top"><i class="fa-solid ' + esc(v.icon) + '"></i> ' +
          esc(v.label) + '</span><strong>' + esc(v.value) + '</strong><span>' + esc(v.note) + '</span></div>';
      }).join('');

      var meds = data.meds.map(function (m) {
        return '<div class="todo' + (m.done ? ' is-done' : '') + '">' +
          '<i class="fa-solid ' + (m.done ? 'fa-circle-check' : 'fa-circle') + '"></i>' +
          '<div><strong>' + esc(m.name) + '</strong><span>' + esc(m.note) + '</span></div>' +
          '<div class="row__tail"><span class="pill pill--mute">' + esc(m.time) + '</span></div></div>';
      }).join('');

      var activity = data.activity.map(function (a) {
        return '<div class="row"><span class="row__ico"><i class="fa-solid ' + esc(a.icon) + '"></i></span>' +
          '<div><strong>' + esc(a.title) + '</strong><span>' + esc(a.note) + '</span></div>' +
          '<div class="row__tail"><span>' + esc(a.when) + '</span></div></div>';
      }).join('');

      return '' +
        heroBlock('Patient desk', 'Good to see you, ' + esc(greetName.split(' ')[0]) + '.', ROLES.patient.tagline) +
        statStrip([
          { icon: 'fa-calendar-check', value: '3',  label: 'Upcoming visits' },
          { icon: 'fa-prescription-bottle-medical', value: '4', label: 'Active prescriptions' },
          { icon: 'fa-folder-open',    value: '12', label: 'Reports ready' },
          { icon: 'fa-heart',          value: 'Good', label: 'Health score' }
        ]) +
        '<div class="grid-2">' +
          panel('Upcoming appointments', 'appointments', 'See all',
            '<div class="table-wrap"><table class="table"><thead><tr><th>Care team</th><th>When</th><th>Where</th><th>Status</th></tr></thead><tbody>' + next + '</tbody></table></div>') +
          panel('Care summary', null, null,
            '<div class="kv">' + care + '</div>' +
            '<div style="margin-top:1rem">' + plans + '</div>') +
        '</div>' +
        '<div class="grid-3">' +
          panel('Vitals at a glance', null, null, '<div class="tiles">' + vitals + '</div>') +
          panel('Today&#39;s plan', 'prescriptions', 'Manage',
            '<div style="margin-top:.2rem">' + meds + '</div>') +
          panel('Recent activity', null, null, '<div style="margin-top:-.2rem">' + activity + '</div>') +
        '</div>' +
        quickBlock([
          { go: 'appointments', icon: 'fa-calendar-plus',      label: 'Book a visit' },
          { go: 'records',      icon: 'fa-file-arrow-down',    label: 'Download reports' },
          { go: 'prescriptions',icon: 'fa-prescription',       label: 'Refill medicine' },
          { go: 'messages',     icon: 'fa-comment-medical',    label: 'Message a doctor' }
        ]);
    },

    appointments: function () {
      var rows = data.next.concat(data.next).map(function (r) {
        return '<tr><td><div class="cell-prod"><img src="' + esc(r.img) + '" alt="" loading="lazy" />' +
          '<div><strong>' + esc(r.doc) + '</strong><span>' + esc(r.dept) + '</span></div></div></td>' +
          '<td>' + esc(r.when) + '</td><td>' + esc(r.place) + '</td><td>' + pill(r.state, r.label) + '</td></tr>';
      }).join('');
      return '' +
        heroBlock('Appointments', 'Your visits', 'Everything booked, past and upcoming, with the care team who will see you.') +
        '<div class="note"><i class="fa-solid fa-circle-info"></i>' +
          '<span>Bring a photo ID to in-person visits. Virtual visits open in this window 10 minutes before your slot.</span></div>' +
        panel('All appointments', null, null,
          '<div class="table-wrap"><table class="table"><thead><tr><th>Care team</th><th>When</th><th>Where</th><th>Status</th></tr></thead><tbody>' + rows + '</tbody></table></div>') +
        quickBlock([
          { go: 'appointments', icon: 'fa-calendar-plus', label: 'Book another visit' },
          { go: 'records',      icon: 'fa-file-medical',  label: 'View reports' }
        ]);
    },

    records: function () {
      var records = [
        { img: '../Images/care-07.webp', name: 'Lipid profile',        type: 'Blood test',  date: '02 Apr 2026', doc: 'Dr. Alana Yorke', state: 'ok',   label: 'Normal' },
        { img: '../Images/care-12.webp', name: 'Chest X-ray',          type: 'Imaging',     date: '19 Mar 2026', doc: 'Dr. Elias Frost', state: 'ok',   label: 'Reviewed' },
        { img: '../Images/care-18.webp', name: 'ECG report',           type: 'Cardiology',  date: '05 Mar 2026', doc: 'Dr. Alana Yorke', state: 'warn', label: 'Follow-up' },
        { img: '../Images/care-23.webp', name: 'Knee MRI',             type: 'Imaging',     date: '22 Feb 2026', doc: 'Dr. Omar Kent',   state: 'ok',   label: 'Reviewed' },
        { img: '../Images/care-29.webp', name: 'Skin screening notes', type: 'Dermatology', date: '10 Feb 2026', doc: 'Dr. Priya Nand',  state: 'mute', label: 'Archived' }
      ];
      var rows = records.map(function (r) {
        return '<tr><td><div class="cell-prod"><img src="' + esc(r.img) + '" alt="" loading="lazy" />' +
          '<div><strong>' + esc(r.name) + '</strong><span>' + esc(r.type) + '</span></div></div></td>' +
          '<td>' + esc(r.date) + '</td><td>' + esc(r.doc) + '</td><td>' + pill(r.state, r.label) + '</td></tr>';
      }).join('');
      return '' +
        heroBlock('My Records', 'Your medical records', 'Secure reports, imaging and results — ready whenever you need them.') +
        panel('All reports', null, null,
          '<div class="table-wrap"><table class="table"><thead><tr><th>Report</th><th>Date</th><th>Doctor</th><th>Status</th></tr></thead><tbody>' + rows + '</tbody></table></div>') +
        '<div class="grid-2">' +
          panel('What is stored', null, null,
            '<div class="kv">' +
              '<div class="kv__row"><span>Blood &amp; lab work</span><strong>4 files</strong></div>' +
              '<div class="kv__row"><span>Imaging</span><strong>3 files</strong></div>' +
              '<div class="kv__row"><span>Consultation notes</span><strong>5 files</strong></div>' +
              '<div class="kv__row"><span>Total</span><strong>12 files</strong></div>' +
            '</div>') +
          panel('Need a copy?', null, null,
            '<div class="note"><i class="fa-solid fa-shield-halved"></i>' +
            '<span>Records are encrypted and shared only with your care team. Request an export and it lands in your inbox within minutes.</span></div>' +
            '<div class="quick"><button type="button" data-go="records"><i class="fa-solid fa-file-export"></i> Request export</button></div>') +
        '</div>';
    },

    prescriptions: function () {
      var meds = data.meds.concat([
        { name: 'Amlodipine 5mg',  note: 'Once daily · morning', done: false, time: '8:00 AM' },
        { name: 'Omeprazole 20mg', note: 'Once daily · before food', done: true, time: '7:30 AM' }
      ]);
      var rows = meds.map(function (m) {
        return '<div class="row"><span class="row__ico"><i class="fa-solid fa-pills"></i></span>' +
          '<div><strong>' + esc(m.name) + '</strong><span>' + esc(m.note) + '</span></div>' +
          '<div class="row__tail">' + pill(m.done ? 'ok' : 'warn', m.done ? 'Active' : 'Refill soon') + '</div></div>';
      }).join('');
      return '' +
        heroBlock('Prescriptions', 'Your medicines', 'Active prescriptions, doses and refill reminders in one list.') +
        panel('Current prescriptions', null, null, rows) +
        quickBlock([
          { go: 'messages', icon: 'fa-comment-medical', label: 'Request a refill' },
          { go: 'records',  icon: 'fa-file-medical',    label: 'See linked reports' }
        ]);
    },

    messages: function () {
      var msgs = [
        { ico: 'fa-user-doctor', name: 'Dr. Alana Yorke', note: 'Lipid results look good — keep the current dose.', when: '2h ago', state: 'ok',   label: 'Unread' },
        { ico: 'fa-user-doctor', name: 'Dr. Omar Kent',   note: 'Physio plan attached for your knee.',            when: '1d ago', state: 'mute', label: 'Read' },
        { ico: 'fa-headset',     name: 'Stackly Support', note: 'Your export is ready to download.',              when: '3d ago', state: 'mute', label: 'Read' }
      ];
      var rows = msgs.map(function (m) {
        return '<div class="row"><span class="row__ico"><i class="fa-solid ' + esc(m.ico) + '"></i></span>' +
          '<div><strong>' + esc(m.name) + '</strong><span>' + esc(m.note) + '</span></div>' +
          '<div class="row__tail">' + pill(m.state, m.label) + '<br><span>' + esc(m.when) + '</span></div></div>';
      }).join('');
      return '' +
        heroBlock('Messages', 'Your inbox', 'Talk to your care team without picking up the phone.') +
        panel('Conversations', null, null, rows) +
        quickBlock([
          { go: 'appointments', icon: 'fa-calendar-plus', label: 'Book with a doctor' },
          { go: 'overview',     icon: 'fa-chart-pie',     label: 'Back to overview' }
        ]);
    }
  };

  /* =====================================================================
     DOCTOR VIEWS
     ===================================================================== */
  var DOCTOR_VIEWS = {
    overview: function () {
      var sched = data.schedule.map(function (r) {
        return '<tr><td><div class="cell-prod"><img src="' + esc(r.img) + '" alt="" loading="lazy" />' +
          '<div><strong>' + esc(r.name) + '</strong><span>' + esc(r.dept) + '</span></div></div></td>' +
          '<td>' + esc(r.when) + '</td><td>' + esc(r.reason) + '</td><td>' + pill(r.state, r.label) + '</td></tr>';
      }).join('');

      var targets = data.target.map(function (t) {
        return '<div class="prog"><div class="prog__top"><span>' + esc(t.label) + '</span>' +
          '<span>' + t.pct + '%</span></div><div class="prog__track">' +
          '<div class="prog__fill" data-fill="' + t.pct + '"></div></div></div>';
      }).join('');

      var tiles = [
        { icon: 'fa-stethoscope',   label: 'Consults today', value: '18', note: '6 walk-ins' },
        { icon: 'fa-bed-pulse',     label: 'Beds occupied',  value: '42', note: 'of 60' },
        { icon: 'fa-clock',         label: 'Avg wait',       value: '12m', note: 'Down 4m' },
        { icon: 'fa-face-smile',    label: 'Satisfaction',   value: '4.8', note: 'from 96 reviews' }
      ].map(function (v) {
        return '<div class="tile"><span class="tile__top"><i class="fa-solid ' + esc(v.icon) + '"></i> ' +
          esc(v.label) + '</span><strong>' + esc(v.value) + '</strong><span>' + esc(v.note) + '</span></div>';
      }).join('');

      var notes = data.notes.map(function (n) {
        return '<div class="todo' + (n.done ? ' is-done' : '') + '">' +
          '<i class="fa-solid ' + (n.done ? 'fa-circle-check' : 'fa-circle') + '"></i>' +
          '<div><strong>' + esc(n.title) + '</strong><span>' + esc(n.note) + '</span></div>' +
          '<div class="row__tail"><span class="pill pill--mute">' + esc(n.time) + '</span></div></div>';
      }).join('');

      var feed = data.feed.map(function (f) {
        return '<div class="row"><span class="row__ico"><i class="fa-solid ' + esc(f.icon) + '"></i></span>' +
          '<div><strong>' + esc(f.title) + '</strong><span>' + esc(f.note) + '</span></div>' +
          '<div class="row__tail"><span>' + esc(f.when) + '</span></div></div>';
      }).join('');

      return '' +
        heroBlock('Doctor desk', 'Good morning, ' + esc(greetName.split(' ')[0]) + '.', ROLES.doctor.tagline) +
        statStrip([
          { icon: 'fa-hospital-user', value: '18', label: 'Patients today' },
          { icon: 'fa-calendar-check', value: '26', label: 'Appointments' },
          { icon: 'fa-pen-clip',      value: '7',  label: 'Notes pending' },
          { icon: 'fa-clock',         value: '12m', label: 'Average wait' }
        ]) +
        '<div class="grid-2">' +
          panel('Today&#39;s schedule', 'appointments', 'Full list',
            '<div class="table-wrap"><table class="table"><thead><tr><th>Patient</th><th>Time</th><th>Reason</th><th>Status</th></tr></thead><tbody>' + sched + '</tbody></table></div>') +
          panel('Clinic targets', null, null, targets) +
        '</div>' +
        '<div class="grid-3">' +
          panel('Ward at a glance', null, null, '<div class="tiles">' + tiles + '</div>') +
          panel('To-do before close', 'patients', 'Open',
            '<div style="margin-top:.2rem">' + notes + '</div>') +
          panel('Live updates', null, null, '<div style="margin-top:-.2rem">' + feed + '</div>') +
        '</div>' +
        quickBlock([
          { go: 'appointments', icon: 'fa-calendar-plus', label: 'Add appointment' },
          { go: 'patients',     icon: 'fa-hospital-user',  label: 'Open patient list' },
          { go: 'prescriptions',icon: 'fa-prescription',   label: 'Write a prescription' },
          { go: 'messages',     icon: 'fa-comments',       label: 'Message a patient' }
        ]);
    },

    appointments: function () {
      var rows = data.schedule.concat(data.schedule).map(function (r) {
        return '<tr><td><div class="cell-prod"><img src="' + esc(r.img) + '" alt="" loading="lazy" />' +
          '<div><strong>' + esc(r.name) + '</strong><span>' + esc(r.dept) + '</span></div></div></td>' +
          '<td>' + esc(r.when) + '</td><td>' + esc(r.reason) + '</td><td>' + pill(r.state, r.label) + '</td></tr>';
      }).join('');
      return '' +
        heroBlock('Appointments', 'Your schedule', 'Today&#39;s clinic, in order, with each patient&#39;s reason for the visit.') +
        '<div class="note note--warn"><i class="fa-solid fa-triangle-exclamation"></i>' +
          '<span>Two patients are still waiting in the corridor. Aim to keep the average wait under 15 minutes.</span></div>' +
        panel('All appointments', null, null,
          '<div class="table-wrap"><table class="table"><thead><tr><th>Patient</th><th>Time</th><th>Reason</th><th>Status</th></tr></thead><tbody>' + rows + '</tbody></table></div>') +
        quickBlock([
          { go: 'patients', icon: 'fa-hospital-user', label: 'Open patient list' },
          { go: 'overview', icon: 'fa-gauge-high',    label: 'Back to overview' }
        ]);
    },

    patients: function () {
      var rows = data.patients.map(function (p) {
        return '<tr><td><div class="cell-prod"><img src="' + esc(p.img) + '" alt="" loading="lazy" />' +
          '<div><strong>' + esc(p.name) + '</strong><span>' + esc(p.id) + '</span></div></div></td>' +
          '<td>' + esc(p.cond) + '</td><td>' + esc(p.last) + '</td><td>' + pill(p.state, p.label) + '</td></tr>';
      }).join('');
      var conds = DEPTS.map(function (d, i) {
        var pct = [82, 64, 91, 47, 58, 73][i];
        return '<div class="hbar"><div class="hbar__top"><span>' + esc(d) + '</span><strong>' + pct + '%</strong></div>' +
          '<div class="hbar__track"><div class="hbar__fill" data-fill="' + pct + '"></div></div></div>';
      }).join('');
      return '' +
        heroBlock('My Patients', 'Patient list', 'Everyone under your care, with condition, latest contact and how they are tracking.') +
        panel('Active patients', null, null,
          '<div class="table-wrap"><table class="table"><thead><tr><th>Patient</th><th>Condition</th><th>Last seen</th><th>Status</th></tr></thead><tbody>' + rows + '</tbody></table></div>') +
        '<div class="grid-2">' +
          panel('Load by department', null, null, conds) +
          panel('Care notes', null, null,
            '<div class="note"><i class="fa-solid fa-circle-info"></i>' +
            '<span>Flagged patients are escalated to the on-call registrar automatically when their status turns red.</span></div>' +
            '<div class="quick"><button type="button" data-go="messages"><i class="fa-solid fa-comment-medical"></i> Message the team</button></div>') +
        '</div>';
    },

    prescriptions: function () {
      var rx = [
        { name: 'Amara Osei',      med: 'Amlodipine 5mg',  note: '30 days · once daily', state: 'ok',   label: 'Issued' },
        { name: 'Daniel Whitfield', med: 'Naproxen 250mg', note: '14 days · as needed',  state: 'warn', label: 'Review' },
        { name: 'Grace Miller',    med: 'Salbutamol',      note: 'Inhaler · as needed',  state: 'ok',   label: 'Issued' },
        { name: 'Isaac Brandt',    med: 'Sumatriptan 50mg',note: '9 days · at onset',    state: 'mute', label: 'Draft' }
      ];
      var rows = rx.map(function (r) {
        return '<div class="row"><span class="row__ico"><i class="fa-solid fa-prescription"></i></span>' +
          '<div><strong>' + esc(r.med) + '</strong><span>' + esc(r.name) + ' · ' + esc(r.note) + '</span></div>' +
          '<div class="row__tail">' + pill(r.state, r.label) + '</div></div>';
      }).join('');
      return '' +
        heroBlock('Prescriptions', 'Prescriptions issued', 'Sign off, review or draft scripts for the patients on your list.') +
        panel('This week', null, null, rows) +
        quickBlock([
          { go: 'patients', icon: 'fa-hospital-user', label: 'Open patient list' },
          { go: 'overview', icon: 'fa-gauge-high',    label: 'Back to overview' }
        ]);
    },

    messages: function () {
      var msgs = [
        { ico: 'fa-user',        name: 'Amara Osei',    note: 'Can I move Thursday&#39;s slot earlier?', when: '30m ago', state: 'ok',   label: 'Unread' },
        { ico: 'fa-user-nurse',  name: 'Ward B · Nurse',note: 'Bed 214 cleaned and ready.',             when: '1h ago',  state: 'mute', label: 'Read' },
        { ico: 'fa-flask',       name: 'Lab desk',      note: 'Lipid panel for PT-4821 is in.',         when: '2h ago',  state: 'mute', label: 'Read' }
      ];
      var rows = msgs.map(function (m) {
        return '<div class="row"><span class="row__ico"><i class="fa-solid ' + esc(m.ico) + '"></i></span>' +
          '<div><strong>' + esc(m.name) + '</strong><span>' + esc(m.note) + '</span></div>' +
          '<div class="row__tail">' + pill(m.state, m.label) + '<br><span>' + esc(m.when) + '</span></div></div>';
      }).join('');
      return '' +
        heroBlock('Messages', 'Team &amp; patient inbox', 'Coordinate with the ward, the lab and your patients from one place.') +
        panel('Conversations', null, null, rows) +
        quickBlock([
          { go: 'appointments', icon: 'fa-calendar-plus', label: 'Add appointment' },
          { go: 'overview',     icon: 'fa-gauge-high',    label: 'Back to overview' }
        ]);
    }
  };

  var VIEWS = role === 'doctor' ? DOCTOR_VIEWS : PATIENT_VIEWS;

  /* =====================================================================
     SHELL ELEMENTS
     ===================================================================== */
  var side = doc.getElementById('dashSide');
  var navList = doc.getElementById('dashNav');
  var bodyEl = doc.getElementById('dashBody');
  var boot = doc.getElementById('dashBoot');
  var scrim = doc.getElementById('dashScrim');
  var sideClose = doc.getElementById('sideClose');
  var sideToggle = doc.getElementById('sideToggle');
  var searchInput = doc.getElementById('searchInput');
  var searchBox = doc.getElementById('searchBox');
  var headTitle = doc.getElementById('headTitle');
  var headSub = doc.getElementById('headSub');
  var logoutBtn = doc.getElementById('logoutBtn');
  var toasts = doc.getElementById('toasts');

  var current = 'overview';
  var DRAWER_AT = 900;

  /* ---------- identity ---------- */
  function paintIdentity() {
    var init = initials(user.name || user.email);
    ['headAvatar', 'sideAvatar'].forEach(function (id) {
      var el = doc.getElementById(id);
      if (el) el.textContent = init;
    });
    ['headUserName', 'sideUserName'].forEach(function (id) {
      var el = doc.getElementById(id);
      if (el) el.textContent = user.name || user.email;
    });
    ['sideUserRole'].forEach(function (id) {
      var el = doc.getElementById(id);
      if (el) el.textContent = ROLES[role].label;
    });
    var badge = doc.getElementById('sideRole');
    if (badge) badge.textContent = ROLES[role].label + ' account';
  }

  /* ---------- nav ---------- */
  function buildNav() {
    if (!navList) return;
    navList.innerHTML = menu.map(function (m) {
      var on = m.id === current ? ' is-on' : '';
      return '<li><button type="button" class="side-link' + on + '" data-view="' + esc(m.id) + '">' +
        '<i class="fa-solid ' + esc(m.icon) + '"></i> <span>' + esc(m.label) + '</span></button></li>';
    }).join('');
  }

  function markActive(id) {
    if (!navList) return;
    navList.querySelectorAll('[data-view]').forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-view') === id);
    });
  }

  function animateBars(scope) {
    if (!scope) return;
    scope.querySelectorAll('[data-fill]').forEach(function (el) {
      var pct = Math.max(0, Math.min(100, parseFloat(el.getAttribute('data-fill')) || 0));
      if (REDUCED) { el.style.width = pct + '%'; return; }
      win.requestAnimationFrame(function () {
        win.setTimeout(function () { el.style.width = pct + '%'; }, 40);
      });
    });
  }

  var toastTimer = null;
  function toast(msg, bad) {
    if (!toasts) return;
    var t = doc.createElement('div');
    t.className = 'toast' + (bad ? ' is-bad' : '');
    t.innerHTML = '<i class="fa-solid ' + (bad ? 'fa-circle-exclamation' : 'fa-circle-check') + '"></i><span>' + esc(msg) + '</span>';
    toasts.appendChild(t);
    if (toastTimer) win.clearTimeout(toastTimer);
    toastTimer = win.setTimeout(function () {
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
      win.setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
    }, 3200);
  }

  function render(id, opts) {
    var builder = VIEWS[id] || VIEWS.overview;
    current = VIEWS[id] ? id : 'overview';
    markActive(current);

    var item = menu.filter(function (m) { return m.id === current; })[0];
    if (headTitle) headTitle.textContent = item ? item.label : 'Overview';
    if (headSub) {
      if (current === 'overview') {
        headSub.textContent = 'Signed in as ' + (user.email || user.name || '');
        headSub.hidden = false;
      } else {
        headSub.textContent = '';
        headSub.hidden = true;
      }
    }

    if (bodyEl) {
      bodyEl.innerHTML = '<div class="dash-view" data-current="' + esc(current) + '">' + builder() + '</div>';
      animateBars(bodyEl);
      if (!REDUCED) {
        var view = bodyEl.firstChild;
        if (view && view.animate) {
          view.animate(
            [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
            { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' }
          );
        }
      }
    }

    if (!opts || !opts.keepSearch) closeDrawer();
    win.scrollTo(0, 0);
  }

  /* ---------- drawer ---------- */
  function openDrawer() {
    if (!side) return;
    side.classList.add('is-open');
    if (scrim) scrim.classList.add('is-on');
    doc.body.classList.add('is-locked');
  }

  function closeDrawer() {
    if (!side) return;
    side.classList.remove('is-open');
    if (scrim) scrim.classList.remove('is-on');
    doc.body.classList.remove('is-locked');
  }

  /* ---------- search ---------- */
  function runSearch() {
    if (!searchInput || !bodyEl) return;
    var q = searchInput.value.trim().toLowerCase();
    if (searchBox) searchBox.classList.remove('is-bad');

    var view = bodyEl.querySelector('.dash-view');
    if (!view) return;

    if (!q) {
      view.querySelectorAll('tr, .row, .todo, .tile').forEach(function (row) {
        row.style.display = '';
      });
      return;
    }

    var pool = view.querySelectorAll('tr, .row, .todo, .tile');
    var hits = 0;
    pool.forEach(function (row) {
      var match = row.textContent.toLowerCase().indexOf(q) !== -1;
      row.style.display = match ? '' : 'none';
      if (match) hits += 1;
    });

    if (!hits) {
      if (searchBox) searchBox.classList.add('is-bad');
      toast('No results for "' + searchInput.value.trim() + '"', true);
    }
  }

  /* ---------- logout ---------- */
  function logout() {
    clear('stacklyUser');
    win.location.href = 'login.html';
  }

  /* =====================================================================
     WIRE UP
     ===================================================================== */
  paintIdentity();
  buildNav();
  render('overview');

  if (sideToggle) sideToggle.addEventListener('click', openDrawer);
  if (sideClose) sideClose.addEventListener('click', closeDrawer);
  if (scrim) scrim.addEventListener('click', closeDrawer);
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  if (navList) {
    navList.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-view]');
      if (!btn) return;
      var id = btn.getAttribute('data-view');
      if (searchInput) searchInput.value = '';
      render(id);
    });
  }

  /* in-view actions — every content button leads to the 404 page */
  if (bodyEl) {
    bodyEl.addEventListener('click', function (e) {
      var go = e.target.closest('[data-go]');
      if (!go) return;
      win.location.href = '404.html';
    });
  }

  if (searchInput) {
    var searchTimer = null;
    searchInput.addEventListener('input', function () {
      if (searchTimer) win.clearTimeout(searchTimer);
      searchTimer = win.setTimeout(runSearch, 160);
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      var q = searchInput.value.trim();
      if (!q) {
        if (searchBox) {
          searchBox.classList.remove('is-bad');
          void searchBox.offsetWidth;
          searchBox.classList.add('is-bad');
        }
        toast('Type something to search.', true);
        return;
      }
      win.location.href = '404.html';
    });
  }

  /* drawer should never survive a resize back to desktop */
  win.addEventListener('resize', function () {
    if (win.innerWidth > DRAWER_AT) closeDrawer();
  });

  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* boot overlay fades once the first view is painted */
  function ready() {
    if (boot) {
      boot.classList.add('is-done');
      win.setTimeout(function () {
        if (boot.parentNode) boot.parentNode.removeChild(boot);
      }, 500);
    }
  }
  if (REDUCED) ready();
  else win.requestAnimationFrame(function () { win.setTimeout(ready, 260); });
})();
