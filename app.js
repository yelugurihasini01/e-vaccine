import { api } from './api.js';

// Application State
const state = {
  activeTab: 'dashboard',
  stats: null,
  beneficiaries: [],
  upcomingSchedules: [],
  overdueSchedules: [],
  vaccines: [],
  notifications: [],
  settings: null,
  selectedChildForCert: null,
  qrCodeInstance: null
};

// Toast Notification Helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-900';
  
  toast.className = `${bg} text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-3 transform transition-all duration-300 translate-y-2 opacity-0`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="text-white/70 hover:text-white">&times;</button>
  `;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  // Close handler
  const closeBtn = toast.querySelector('button');
  const removeToast = () => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  };
  closeBtn.addEventListener('click', removeToast);
  setTimeout(removeToast, 4000);
}

// Age formatting helper
function getAgeString(dobStr) {
  if (!dobStr) return '';
  const dob = new Date(dobStr);
  const now = new Date();
  const diffDays = Math.floor((now - dob) / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} days old`;
  }
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 16) {
    return `${diffWeeks} weeks old`;
  }
  const diffMonths = Math.floor(diffDays / 30.4375);
  if (diffMonths < 24) {
    return `${diffMonths} months old`;
  }
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} years old`;
}

// Tab Switching
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab, .mobile-nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      switchTab(target);
    });
  });
}

function switchTab(tabId) {
  state.activeTab = tabId;

  // Update nav buttons
  document.querySelectorAll('.nav-tab').forEach(b => {
    if (b.getAttribute('data-tab') === tabId) {
      b.className = 'nav-tab px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all text-sky-700 bg-white shadow-sm flex items-center gap-1.5';
    } else {
      b.className = 'nav-tab px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
    }
  });

  document.querySelectorAll('.mobile-nav-tab').forEach(b => {
    if (b.getAttribute('data-tab') === tabId) {
      b.className = 'mobile-nav-tab px-3 py-1.5 text-xs font-semibold rounded-md bg-sky-50 text-sky-700 whitespace-nowrap';
    } else {
      b.className = 'mobile-nav-tab px-3 py-1.5 text-xs font-semibold rounded-md text-slate-600 whitespace-nowrap';
    }
  });

  // Show corresponding tab pane
  document.querySelectorAll('.tab-pane').forEach(pane => {
    if (pane.id === `tab-${tabId}`) {
      pane.classList.remove('hidden');
    } else {
      pane.classList.add('hidden');
    }
  });

  // Refresh tab-specific data
  if (tabId === 'beneficiaries') loadBeneficiariesView();
  if (tabId === 'vaccines') loadVaccinesView();
  if (tabId === 'notifications') loadNotificationsView();
  if (tabId === 'certificate') loadCertificateView();
  if (tabId === 'settings') loadSettingsView();
}

// Modals Manager
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) {
    m.classList.remove('hidden');
    lucide.createIcons();
  }
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('hidden');
}

function initModals() {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('[id^="modal-"]');
      if (modal) modal.classList.add('hidden');
    });
  });

  // Close when clicking outer backdrop
  document.querySelectorAll('[id^="modal-"]').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });
}

// ===================================================================
// DATA LOADERS & RENDERERS
// ===================================================================

async function loadDashboardStats() {
  try {
    const res = await api.getStats();
    if (res.success) {
      state.stats = res.data;
      document.getElementById('stat-total-children').textContent = res.data.totalBeneficiaries;
      document.getElementById('stat-overdue-doses').textContent = res.data.overdue;
      document.getElementById('stat-upcoming-doses').textContent = res.data.upcomingNext7Days;
      document.getElementById('stat-completed-doses').textContent = res.data.completed;
      document.getElementById('stat-completion-rate').textContent = `(${res.data.completionRate}%)`;

      document.getElementById('overdue-count-badge').textContent = `${res.data.overdue} Overdue`;
      document.getElementById('upcoming-count-badge').textContent = `${res.data.upcomingNext7Days} Due Soon`;
    }
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

async function loadDashboardLists() {
  // 1. Overdue List
  try {
    const overdueRes = await api.getOverdueSchedules();
    const container = document.getElementById('dashboard-overdue-list');
    
    if (overdueRes.success && overdueRes.data.length > 0) {
      container.innerHTML = overdueRes.data.map(item => `
        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900 text-sm">${item.child ? item.child.fullName : 'Patient'}</span>
              <span class="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">${item.daysOverdue} Days Overdue</span>
            </div>
            <p class="text-xs text-slate-600 font-semibold">
              <span class="text-rose-600">●</span> ${item.vaccineName} (${item.dose})
            </p>
            <p class="text-[11px] text-slate-400">
              Due Date: <span class="font-medium text-slate-600">${item.dueDate}</span> • Contact: ${item.child ? item.child.phone : 'N/A'}
            </p>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <button class="btn-send-wa px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs flex items-center gap-1 transition"
              data-schedule-id="${item.id}"
              data-child-name="${item.child ? item.child.fullName : ''}"
              data-phone="${item.child ? item.child.phone : ''}"
              title="Send WhatsApp Reminder">
              <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
              <span>WhatsApp</span>
            </button>

            <button class="btn-send-email px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold text-xs flex items-center gap-1 transition"
              data-schedule-id="${item.id}"
              title="Send Email Reminder">
              <i data-lucide="mail" class="w-3.5 h-3.5"></i>
              <span>Email</span>
            </button>

            <button class="btn-mark-administer px-2.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition"
              data-schedule-id="${item.id}"
              data-vaccine-name="${item.vaccineName}"
              data-child-name="${item.child ? item.child.fullName : ''}">
              Administer
            </button>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400 text-xs">
          <i data-lucide="check-circle-2" class="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80"></i>
          <p class="font-bold text-slate-700">All vaccinations are currently up to date!</p>
          <p class="text-slate-400 mt-0.5">No overdue doses detected.</p>
        </div>
      `;
    }
  } catch (err) {
    console.error('Error loading overdue:', err);
  }

  // 2. Upcoming List
  try {
    const upcomingRes = await api.getUpcomingSchedules(7);
    const container = document.getElementById('dashboard-upcoming-list');

    if (upcomingRes.success && upcomingRes.data.length > 0) {
      container.innerHTML = upcomingRes.data.map(item => `
        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900 text-sm">${item.child ? item.child.fullName : 'Patient'}</span>
              <span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                ${item.daysUntilDue === 0 ? 'Due Today' : `Due in ${item.daysUntilDue} days`}
              </span>
            </div>
            <p class="text-xs text-slate-600 font-semibold">${item.vaccineName}</p>
            <p class="text-[11px] text-slate-400">Due Date: ${item.dueDate} • Recommended: ${item.ageLabel}</p>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <button class="btn-send-wa px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs flex items-center gap-1"
              data-schedule-id="${item.id}"
              data-child-name="${item.child ? item.child.fullName : ''}"
              data-phone="${item.child ? item.child.phone : ''}">
              <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
              <span>WhatsApp</span>
            </button>
            <button class="btn-mark-administer px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 font-semibold text-xs"
              data-schedule-id="${item.id}"
              data-vaccine-name="${item.vaccineName}"
              data-child-name="${item.child ? item.child.fullName : ''}">
              Administer
            </button>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400 text-xs">
          No vaccines due within the next 7 days.
        </div>
      `;
    }
  } catch (err) {
    console.error('Error loading upcoming:', err);
  }

  // 3. Notification Stream Feed
  try {
    const notifRes = await api.getNotifications();
    const container = document.getElementById('dashboard-notification-feed');

    if (notifRes.success && notifRes.data.length > 0) {
      container.innerHTML = notifRes.data.slice(0, 5).map(item => `
        <div class="p-3.5 hover:bg-slate-50 transition flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg ${item.channel === 'whatsapp' ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'} flex items-center justify-center shrink-0 mt-0.5">
            <i data-lucide="${item.channel === 'whatsapp' ? 'message-circle' : 'mail'}" class="w-4 h-4"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <span class="font-bold text-slate-900 text-xs truncate">${item.beneficiaryName}</span>
              <span class="text-[10px] text-slate-400 whitespace-nowrap">${new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p class="text-[11px] text-slate-600 truncate">${item.vaccineName}</p>
            <p class="text-[10px] text-slate-400 truncate">${item.recipient} • ${item.status}</p>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = `<div class="p-8 text-center text-slate-400 text-xs">No dispatched notifications yet.</div>`;
    }
  } catch (err) {
    console.error('Error loading notification feed:', err);
  }

  lucide.createIcons();
  attachScheduleActionHandlers();
}

// Beneficiaries Tab View
async function loadBeneficiariesView() {
  try {
    const res = await api.getBeneficiaries();
    if (res.success) {
      state.beneficiaries = res.data;
      renderBeneficiariesGrid(res.data);
    }
  } catch (err) {
    console.error('Error loading beneficiaries:', err);
  }
}

function renderBeneficiariesGrid(children) {
  const grid = document.getElementById('children-cards-grid');
  if (!grid) return;

  if (children.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full p-12 text-center text-slate-400 text-xs">
        No children matching your query. Click "Register New Child" to add.
      </div>
    `;
    return;
  }

  grid.innerHTML = children.map(child => {
    const m = child.metrics || {};
    const initials = child.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const hasOverdue = m.overdueDoses > 0;

    return `
      <div class="bg-white rounded-2xl border ${hasOverdue ? 'border-rose-200' : 'border-slate-200'} p-5 shadow-sm space-y-4 hover:shadow-md transition">
        
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              ${initials}
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">${child.fullName}</h4>
              <p class="text-[11px] text-slate-500">${getAgeString(child.dateOfBirth)} • DOB: ${child.dateOfBirth}</p>
            </div>
          </div>
          <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${hasOverdue ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}">
            ${hasOverdue ? `${m.overdueDoses} Overdue` : 'Up to Date'}
          </span>
        </div>

        <!-- Guardian & Contacts -->
        <div class="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
          <div class="flex items-center justify-between text-slate-600">
            <span class="text-slate-400">Guardian:</span>
            <span class="font-semibold text-slate-800">${child.guardianName} (${child.guardianRelationship})</span>
          </div>
          <div class="flex items-center justify-between text-slate-600">
            <span class="text-slate-400">WhatsApp:</span>
            <span class="font-semibold text-emerald-700">${child.phone}</span>
          </div>
          <div class="flex items-center justify-between text-slate-600 truncate">
            <span class="text-slate-400">Email:</span>
            <span class="font-medium text-slate-700 truncate max-w-[170px]">${child.email}</span>
          </div>
        </div>

        <!-- Immunization Progress Bar -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-500 font-medium">Immunization Progress:</span>
            <span class="font-bold text-slate-900">${m.completedDoses || 0} / ${m.totalDoses || 0} Doses (${m.progressPercent || 0}%)</span>
          </div>
          <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-sky-500 to-teal-500 h-full rounded-full" style="width: ${m.progressPercent || 0}%;"></div>
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <button class="btn-view-passport text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1" data-child-id="${child.id}">
            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
            <span>View Timeline</span>
          </button>
          
          <button class="btn-child-cert text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1" data-child-id="${child.id}">
            <i data-lucide="award" class="w-3.5 h-3.5"></i>
            <span>Certificate</span>
          </button>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();

  // Attach card event handlers
  document.querySelectorAll('.btn-view-passport').forEach(btn => {
    btn.addEventListener('click', () => {
      openChildPassportModal(btn.getAttribute('data-child-id'));
    });
  });

  document.querySelectorAll('.btn-child-cert').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedChildForCert = btn.getAttribute('data-child-id');
      switchTab('certificate');
    });
  });
}

// Child Passport Modal Viewer
async function openChildPassportModal(childId) {
  try {
    const res = await api.getBeneficiary(childId);
    if (!res.success) return;

    const child = res.data;
    document.getElementById('passport-name').textContent = child.fullName;
    document.getElementById('passport-avatar').textContent = child.fullName.substring(0, 2).toUpperCase();
    document.getElementById('passport-sub').textContent = `DOB: ${child.dateOfBirth} • Age: ${getAgeString(child.dateOfBirth)} • Guardian: ${child.guardianName} (${child.phone})`;

    const m = child.metrics;
    document.getElementById('passport-progress-text').textContent = `${m.completedDoses}/${m.totalDoses} Doses Completed (${m.progressPercent}%)`;
    document.getElementById('passport-progress-bar').style.width = `${m.progressPercent}%`;

    const container = document.getElementById('passport-timeline-list');
    container.innerHTML = child.schedules.map(sch => {
      const isDone = sch.status === 'completed';
      const isOverdue = sch.status === 'overdue';

      return `
        <div class="p-3.5 rounded-xl border ${isDone ? 'border-emerald-200 bg-emerald-50/30' : isOverdue ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200'} flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900 text-sm">${sch.vaccineName}</span>
              <span class="font-mono text-[10px] text-slate-500">(${sch.vaccineCode})</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isDone ? 'bg-emerald-100 text-emerald-800' : isOverdue ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800'}">
                ${sch.status.toUpperCase()}
              </span>
            </div>
            <p class="text-slate-600 font-medium">Protects Against: ${sch.targetDisease}</p>
            <p class="text-slate-400 text-[11px]">Milestone: ${sch.ageLabel} • Scheduled Due: <strong class="text-slate-700">${sch.dueDate}</strong> ${isDone ? `• Administered: ${sch.administeredDate} (Lot: ${sch.batchNumber})` : ''}</p>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            ${!isDone ? `
              <button class="btn-send-wa px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs flex items-center gap-1"
                data-schedule-id="${sch.id}">
                <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
                <span>Remind WhatsApp</span>
              </button>
              <button class="btn-mark-administer px-2.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs"
                data-schedule-id="${sch.id}"
                data-vaccine-name="${sch.vaccineName}"
                data-child-name="${child.fullName}">
                Record Dose
              </button>
            ` : `
              <span class="text-emerald-700 font-bold flex items-center gap-1">
                <i data-lucide="check" class="w-4 h-4"></i> Administered
              </span>
            `}
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons();
    attachScheduleActionHandlers();
    openModal('modal-child-passport');
  } catch (err) {
    console.error('Error opening child passport:', err);
  }
}

// Vaccines Master View
async function loadVaccinesView() {
  try {
    const res = await api.getVaccines();
    if (res.success) {
      state.vaccines = res.data;
      const tbody = document.getElementById('master-vaccines-tbody');
      tbody.innerHTML = res.data.map(v => `
        <tr class="hover:bg-slate-50 transition">
          <td class="px-5 py-3 font-mono font-bold text-sky-700">${v.code}</td>
          <td class="px-5 py-3 font-semibold text-slate-900">${v.name}</td>
          <td class="px-5 py-3 text-slate-600">${v.targetDisease}</td>
          <td class="px-5 py-3">${v.dose}</td>
          <td class="px-5 py-3"><span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">${v.ageLabel}</span></td>
          <td class="px-5 py-3 text-slate-500">${v.route}</td>
          <td class="px-5 py-3">
            <span class="text-emerald-700 font-semibold">Standard Mandatory</span>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading vaccines:', err);
  }
}

// Notifications Audit View
async function loadNotificationsView(channelFilter = '') {
  try {
    const res = await api.getNotifications(channelFilter);
    if (res.success) {
      state.notifications = res.data;
      const tbody = document.getElementById('notifications-table-tbody');

      if (res.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-slate-400">No notifications logged.</td></tr>`;
        return;
      }

      tbody.innerHTML = res.data.map(n => `
        <tr class="hover:bg-slate-50 transition">
          <td class="px-5 py-3">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${n.channel === 'whatsapp' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'} uppercase">
              <i data-lucide="${n.channel === 'whatsapp' ? 'message-circle' : 'mail'}" class="w-3 h-3"></i>
              ${n.channel}
            </span>
          </td>
          <td class="px-5 py-3 font-mono text-slate-800 font-medium">${n.recipient}</td>
          <td class="px-5 py-3 font-semibold text-slate-900">${n.beneficiaryName}</td>
          <td class="px-5 py-3 text-slate-600">${n.vaccineName}</td>
          <td class="px-5 py-3 text-slate-400">${new Date(n.sentAt).toLocaleString()}</td>
          <td class="px-5 py-3">
            <span class="text-emerald-600 font-bold">✓ Delivered</span>
          </td>
          <td class="px-5 py-3 text-right">
            <button class="btn-inspect-notif text-sky-600 hover:text-sky-800 font-semibold" data-notif-id="${n.id}">
              Inspect Preview
            </button>
          </td>
        </tr>
      `).join('');

      lucide.createIcons();

      // Inspect preview handler
      document.querySelectorAll('.btn-inspect-notif').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-notif-id');
          const notif = state.notifications.find(item => item.id === id);
          if (notif) {
            showWhatsAppModal(notif.fullMessage || notif.messagePreview, notif.waLink);
          }
        });
      });
    }
  } catch (err) {
    console.error('Error loading notifications:', err);
  }
}

// Digital Certificate View
async function loadCertificateView() {
  try {
    const res = await api.getBeneficiaries();
    if (!res.success) return;

    state.beneficiaries = res.data;
    const select = document.getElementById('cert-child-select');
    select.innerHTML = res.data.map(c => `
      <option value="${c.id}" ${state.selectedChildForCert === c.id ? 'selected' : ''}>${c.fullName} (DOB: ${c.dateOfBirth})</option>
    `).join('');

    const targetId = state.selectedChildForCert || res.data[0]?.id;
    if (targetId) {
      renderChildCertificate(targetId);
    }

    select.onchange = (e) => {
      renderChildCertificate(e.target.value);
    };
  } catch (err) {
    console.error('Error loading certificate view:', err);
  }
}

async function renderChildCertificate(childId) {
  try {
    const res = await api.getBeneficiary(childId);
    if (!res.success) return;

    const child = res.data;
    document.getElementById('cert-child-name').textContent = child.fullName;
    document.getElementById('cert-child-dob').textContent = child.dateOfBirth;
    document.getElementById('cert-child-meta').textContent = `${child.gender} • Blood Group: ${child.bloodGroup}`;
    document.getElementById('cert-child-guardian').textContent = `${child.guardianName} (${child.phone})`;

    // Certificate Table
    const tbody = document.getElementById('cert-schedule-tbody');
    tbody.innerHTML = child.schedules.map(sch => {
      const isDone = sch.status === 'completed';
      return `
        <tr class="${isDone ? 'bg-emerald-50/20' : ''}">
          <td class="px-4 py-2.5 font-bold text-slate-800">${sch.vaccineName}</td>
          <td class="px-4 py-2.5 text-slate-500">${sch.ageLabel}</td>
          <td class="px-4 py-2.5 text-slate-500">${sch.dueDate}</td>
          <td class="px-4 py-2.5 font-semibold ${isDone ? 'text-emerald-700' : 'text-slate-400'}">${isDone ? sch.administeredDate : '—'}</td>
          <td class="px-4 py-2.5 font-mono text-slate-600">${isDone ? sch.batchNumber : '—'}</td>
          <td class="px-4 py-2.5 text-slate-600">${isDone ? sch.administeredBy : '—'}</td>
          <td class="px-4 py-2.5 text-right font-bold ${isDone ? 'text-emerald-700' : 'text-slate-400'}">
            ${isDone ? '✓ Administered' : 'Pending'}
          </td>
        </tr>
      `;
    }).join('');

    // QR Code generation
    const qrContainer = document.getElementById('cert-qrcode');
    qrContainer.innerHTML = '';
    const qrData = `EVAX-CERT|PATIENT:${child.fullName}|DOB:${child.dateOfBirth}|DOSES:${child.metrics.completedDoses}/${child.metrics.totalDoses}|REGISTRY:CareWell`;
    
    new QRCode(qrContainer, {
      text: qrData,
      width: 72,
      height: 72,
      colorDark: "#0f172a",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });

  } catch (err) {
    console.error('Error rendering certificate:', err);
  }
}

// Settings View
async function loadSettingsView() {
  try {
    const res = await api.getSettings();
    if (res.success) {
      state.settings = res.data;
      document.getElementById('settings-clinic-name').value = res.data.clinic.name || '';
      document.getElementById('settings-clinic-phone').value = res.data.clinic.phone || '';
      document.getElementById('settings-clinic-email').value = res.data.clinic.email || '';
      document.getElementById('settings-clinic-address').value = res.data.clinic.address || '';
      document.getElementById('settings-wa-provider').value = res.data.whatsapp.provider || 'simulator';
      document.getElementById('settings-email-enabled').checked = Boolean(res.data.email.enabled);
    }
  } catch (err) {
    console.error('Error loading settings:', err);
  }
}

// Show WhatsApp Simulator Modal
function showWhatsAppModal(messageText, waLink = null) {
  const modal = document.getElementById('modal-whatsapp-preview');
  const textElem = document.getElementById('wa-preview-text');
  const directLinkElem = document.getElementById('wa-preview-direct-link');
  const timeElem = document.getElementById('wa-preview-time');

  textElem.textContent = messageText;
  timeElem.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (waLink) {
    directLinkElem.href = waLink;
    directLinkElem.classList.remove('hidden');
  } else {
    directLinkElem.classList.add('hidden');
  }

  openModal('modal-whatsapp-preview');
}

// Attach action handlers to dynamic buttons
function attachScheduleActionHandlers() {
  // WhatsApp Reminder Dispatch
  document.querySelectorAll('.btn-send-wa').forEach(btn => {
    btn.onclick = async () => {
      const scheduleId = btn.getAttribute('data-schedule-id');
      btn.disabled = true;
      showToast('Dispatching WhatsApp reminder...', 'info');

      try {
        const res = await api.sendScheduleReminder(scheduleId, 'whatsapp');
        if (res.success) {
          showToast('WhatsApp reminder sent successfully!', 'success');
          const waResult = res.results.whatsapp;
          if (waResult && waResult.preview) {
            showWhatsAppModal(waResult.preview, waResult.waLink);
          }
          await loadDashboardStats();
          await loadDashboardLists();
        } else {
          showToast(res.error || 'Failed to dispatch WhatsApp', 'error');
        }
      } catch (err) {
        showToast('Error dispatching reminder', 'error');
      } finally {
        btn.disabled = false;
      }
    };
  });

  // Email Reminder Dispatch
  document.querySelectorAll('.btn-send-email').forEach(btn => {
    btn.onclick = async () => {
      const scheduleId = btn.getAttribute('data-schedule-id');
      btn.disabled = true;
      showToast('Dispatching Email reminder...', 'info');

      try {
        const res = await api.sendScheduleReminder(scheduleId, 'email');
        if (res.success) {
          showToast('Email reminder sent successfully!', 'success');
          await loadDashboardStats();
          await loadDashboardLists();
        } else {
          showToast(res.error || 'Failed to dispatch email', 'error');
        }
      } catch (err) {
        showToast('Error dispatching reminder', 'error');
      } finally {
        btn.disabled = false;
      }
    };
  });

  // Administer Vaccine Button
  document.querySelectorAll('.btn-mark-administer').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-schedule-id');
      const vac = btn.getAttribute('data-vaccine-name');
      const child = btn.getAttribute('data-child-name');

      document.getElementById('administer-schedule-id').value = id;
      document.getElementById('administer-vaccine-name').textContent = vac;
      document.getElementById('administer-child-name').textContent = `Beneficiary: ${child}`;
      document.getElementById('administer-date').value = new Date().toISOString().split('T')[0];
      document.getElementById('administer-batch').value = `LOT-${Math.floor(100000 + Math.random() * 900000)}`;

      openModal('modal-administer');
    };
  });
}

// ===================================================================
// EVENT LISTENERS INITIALIZATION
// ===================================================================
document.addEventListener('DOMContentLoaded', async () => {
  initTabs();
  initModals();

  // Load Initial Dashboard Data
  await loadDashboardStats();
  await loadDashboardLists();

  // Top Run Cron button
  const runCronBtn = document.getElementById('btn-run-cron');
  const bannerScanBtn = document.getElementById('btn-banner-scan');

  const executeCron = async () => {
    const spinner = document.getElementById('cron-spinner');
    if (spinner) spinner.classList.add('animate-spin');
    showToast('Running automated vaccine reminder scan...', 'info');

    try {
      const res = await api.runCronNow();
      if (res.success) {
        const s = res.data;
        showToast(`Scan complete: ${s.emailsSent} Emails, ${s.whatsAppSent} WhatsApp sent!`, 'success');
        await loadDashboardStats();
        await loadDashboardLists();
      } else {
        showToast(res.error || 'Failed to run scan', 'error');
      }
    } catch (err) {
      showToast('Error executing scan', 'error');
    } finally {
      if (spinner) spinner.classList.remove('animate-spin');
    }
  };

  runCronBtn.addEventListener('click', executeCron);
  if (bannerScanBtn) bannerScanBtn.addEventListener('click', executeCron);

  // Quick Add Child Buttons
  document.getElementById('btn-quick-add-child').addEventListener('click', () => openModal('modal-add-child'));
  document.getElementById('btn-add-child-main')?.addEventListener('click', () => openModal('modal-add-child'));

  // Open Live Simulator Test button
  document.getElementById('btn-open-live-test')?.addEventListener('click', () => switchTab('notifications'));
  document.getElementById('btn-open-simulator-from-card')?.addEventListener('click', () => switchTab('notifications'));
  document.getElementById('btn-view-all-notifs')?.addEventListener('click', () => switchTab('notifications'));

  // Search Filter in Children Tab
  const searchInput = document.getElementById('input-search-children');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderBeneficiariesGrid(state.beneficiaries);
      } else {
        const filtered = state.beneficiaries.filter(b => 
          b.fullName.toLowerCase().includes(q) ||
          b.guardianName.toLowerCase().includes(q) ||
          b.phone.includes(q)
        );
        renderBeneficiariesGrid(filtered);
      }
    });
  }

  // Add Child Form Submission
  const formAddChild = document.getElementById('form-add-child');
  formAddChild.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      fullName: document.getElementById('add-child-name').value,
      dateOfBirth: document.getElementById('add-child-dob').value,
      gender: document.getElementById('add-child-gender').value,
      bloodGroup: document.getElementById('add-child-blood').value,
      guardianName: document.getElementById('add-child-guardian').value,
      guardianRelationship: document.getElementById('add-child-rel').value,
      phone: document.getElementById('add-child-phone').value,
      email: document.getElementById('add-child-email').value,
      address: document.getElementById('add-child-address').value,
      allergies: document.getElementById('add-child-allergies').value
    };

    try {
      const res = await api.createBeneficiary(payload);
      if (res.success) {
        showToast('Child registered & full immunization schedule generated!', 'success');
        closeModal('modal-add-child');
        formAddChild.reset();
        await loadDashboardStats();
        await loadDashboardLists();
        if (state.activeTab === 'beneficiaries') await loadBeneficiariesView();
      } else {
        showToast(res.error || 'Failed to register child', 'error');
      }
    } catch (err) {
      showToast('Error registering child', 'error');
    }
  });

  // Administer Vaccine Form Submission
  const formAdminister = document.getElementById('form-administer');
  formAdminister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const scheduleId = document.getElementById('administer-schedule-id').value;
    const payload = {
      administeredDate: document.getElementById('administer-date').value,
      batchNumber: document.getElementById('administer-batch').value,
      administeredBy: document.getElementById('administer-by').value,
      clinic: document.getElementById('administer-clinic').value,
      notes: document.getElementById('administer-notes').value
    };

    try {
      const res = await api.administerSchedule(scheduleId, payload);
      if (res.success) {
        showToast('Vaccine administration recorded successfully!', 'success');
        closeModal('modal-administer');
        closeModal('modal-child-passport');
        await loadDashboardStats();
        await loadDashboardLists();
        if (state.activeTab === 'beneficiaries') await loadBeneficiariesView();
        if (state.activeTab === 'certificate') await loadCertificateView();
      } else {
        showToast(res.error || 'Failed to record dose', 'error');
      }
    } catch (err) {
      showToast('Error recording administration', 'error');
    }
  });

  // Direct Test Dispatcher Form in Notifications Tab
  const formDirectTest = document.getElementById('form-direct-test');
  const testChannelSelect = document.getElementById('test-channel-select');
  const testRecipientInput = document.getElementById('test-recipient-input');
  const testRecipientLabel = document.getElementById('test-recipient-label');

  testChannelSelect.addEventListener('change', () => {
    if (testChannelSelect.value === 'whatsapp') {
      testRecipientLabel.textContent = 'Target Phone (+1XXXXXXXXXX)';
      testRecipientInput.placeholder = '+14155552671';
      testRecipientInput.type = 'text';
    } else {
      testRecipientLabel.textContent = 'Target Email (parent@example.com)';
      testRecipientInput.placeholder = 'parent@gmail.com';
      testRecipientInput.type = 'email';
    }
  });

  formDirectTest.addEventListener('submit', async (e) => {
    e.preventDefault();
    const channel = testChannelSelect.value;
    const recipient = testRecipientInput.value;
    const sampleVaccine = document.getElementById('test-vaccine-select').value;

    showToast(`Dispatching live ${channel} test...`, 'info');

    try {
      const res = await api.testDirectNotification({
        channel,
        recipient,
        sampleVaccine,
        sampleChildName: 'Baby Leo'
      });

      if (res.success) {
        showToast(`Test ${channel} notification dispatched!`, 'success');
        if (channel === 'whatsapp' && res.result && res.result.preview) {
          showWhatsAppModal(res.result.preview, res.result.waLink);
        }
        await loadNotificationsView();
      } else {
        showToast(res.error || 'Test delivery failed', 'error');
      }
    } catch (err) {
      showToast('Error during test dispatch', 'error');
    }
  });

  // Notification Channel Filters
  document.querySelectorAll('.notif-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.notif-filter-btn').forEach(b => {
        b.className = 'notif-filter-btn px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100';
      });
      btn.className = 'notif-filter-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700';
      const f = btn.getAttribute('data-filter-notif');
      loadNotificationsView(f === 'all' ? '' : f);
    });
  });

  // Print Certificate Button
  document.getElementById('btn-print-certificate')?.addEventListener('click', () => {
    window.print();
  });

  // Settings Form Submit
  const formSettings = document.getElementById('form-settings');
  formSettings?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      clinicName: document.getElementById('settings-clinic-name').value,
      clinicPhone: document.getElementById('settings-clinic-phone').value,
      clinicEmail: document.getElementById('settings-clinic-email').value,
      clinicAddress: document.getElementById('settings-clinic-address').value,
      whatsappProvider: document.getElementById('settings-wa-provider').value,
      emailEnabled: document.getElementById('settings-email-enabled').checked
    };

    try {
      const res = await api.updateSettings(payload);
      if (res.success) {
        showToast('Settings saved successfully!', 'success');
        document.getElementById('clinic-name-header').textContent = payload.clinicName;
        document.getElementById('cert-clinic-name').textContent = payload.clinicName;
        document.getElementById('cert-clinic-address').textContent = `${payload.clinicAddress} • Tel: ${payload.clinicPhone}`;
      }
    } catch (err) {
      showToast('Error updating settings', 'error');
    }
  });

});
