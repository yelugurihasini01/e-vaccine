import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import PatientModal from './components/PatientModal';
import ReminderHub from './components/ReminderHub';
import VaccineLibrary from './components/VaccineLibrary';
import CertificateView from './components/CertificateView';
import NotificationLogs from './components/NotificationLogs';
import AcademicDocsModal from './components/AcademicDocsModal';
import HydrationCareCenter from './components/HydrationCareCenter';
import MilestoneTimeline from './components/MilestoneTimeline';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';

import { INITIAL_PATIENTS, INITIAL_LOGS } from './data/initialData';
import { VACCINE_SCHEDULE_DEFINITIONS } from './data/vaccineSchedule';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('vaxalert_theme') || 'dark';
  });

  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('evaccine_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Patients state (cached in localStorage and synced with MongoDB backend)
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('vaxalert_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  // Notification logs state
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('vaxalert_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // Modal controls
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isAcademicDocsOpen, setIsAcademicDocsOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);
  const [selectedPatientForCert, setSelectedPatientForCert] = useState(null);

  // Sync theme attribute to HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vaxalert_theme', theme);
  }, [theme]);

  // Sync patients to localStorage
  useEffect(() => {
    localStorage.setItem('vaxalert_patients', JSON.stringify(patients));
  }, [patients]);

  // Sync logs to localStorage
  useEffect(() => {
    localStorage.setItem('vaxalert_logs', JSON.stringify(logs));
  }, [logs]);

  // Check auth session & load backend data
  useEffect(() => {
    const token = localStorage.getItem('evaccine_token');
    if (token) {
      api.getMe()
        .then(res => {
          if (res.user) {
            setCurrentUser(res.user);
            localStorage.setItem('evaccine_user', JSON.stringify(res.user));
          }
        })
        .catch(err => {
          console.warn('Session expired or offline:', err.message);
        });
    }

    // Load live notifications from backend
    api.getNotifications()
      .then(res => {
        if (res.logs && res.logs.length > 0) {
          const mappedLogs = res.logs.map(l => ({
            id: l._id,
            childName: l.childName,
            parentName: currentUser?.fullName || 'Parent',
            channel: l.channel === 'whatsapp' ? 'WhatsApp' : 'Email',
            recipient: l.recipient,
            vaccineName: l.vaccineName,
            messagePreview: l.messageBody?.substring(0, 80) + '...',
            timestamp: new Date(l.sentAt).toLocaleString('en-IN'),
            status: l.status === 'sent' || l.status === 'simulated' ? 'Delivered' : l.status,
            statusBadge: l.status === 'failed' ? 'danger' : 'success'
          }));
          setLogs(prev => [...mappedLogs, ...prev.filter(p => !mappedLogs.some(m => m.id === p.id))]);
        }
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    alert('You have been logged out successfully.');
  };

  // Generate initial schedule status for a newly registered child
  const generateInitialSchedule = (dobString) => {
    const customStatus = {};
    VACCINE_SCHEDULE_DEFINITIONS.forEach(group => {
      group.vaccines.forEach(vac => {
        customStatus[vac.code] = {
          status: 'Scheduled',
          dueDate: `${group.milestone} (Target)`
        };
      });
    });
    return customStatus;
  };

  // Add or Update Patient
  const handleSavePatient = async (formData) => {
    if (patientToEdit) {
      // Edit existing
      setPatients(patients.map(p => p.id === patientToEdit.id ? { ...p, ...formData } : p));
      setPatientToEdit(null);

      // Try updating backend if ID is valid
      if (patientToEdit.backendId) {
        api.updateFamilyMember(patientToEdit.backendId, {
          childName: formData.childName,
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
          relationship: formData.parentRelation,
          primaryHospital: formData.clinicName,
          doctorOrAnmName: formData.doctorName,
          notes: formData.notes
        }).catch(err => console.warn('Could not sync update to backend:', err.message));
      }
    } else {
      // Add new child
      const newId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
      const newPatient = {
        id: newId,
        ...formData,
        regDate: new Date().toISOString().split('T')[0],
        customVaccineStatus: generateInitialSchedule(formData.dob)
      };

      setPatients([newPatient, ...patients]);

      // Sync to live backend API if token is present
      const token = localStorage.getItem('evaccine_token');
      if (token) {
        try {
          const res = await api.createFamilyMember({
            childName: formData.childName,
            dob: formData.dob,
            gender: formData.gender,
            bloodGroup: formData.bloodGroup || 'O+',
            relationship: formData.parentRelation || 'Child',
            primaryHospital: formData.clinicName || 'Primary Health Centre (PHC)',
            doctorOrAnmName: formData.doctorName || 'Medical Officer',
            notes: formData.notes || ''
          });
          if (res.familyMember) {
            newPatient.backendId = res.familyMember._id;
          }
        } catch (err) {
          console.warn('Backend sync warning:', err.message);
        }
      }
    }
  };

  // Delete Patient
  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this infant record?')) {
      const patient = patients.find(p => p.id === patientId);
      setPatients(patients.filter(p => p.id !== patientId));

      if (patient?.backendId) {
        api.deleteFamilyMember(patient.backendId).catch(() => {});
      }
    }
  };

  // Toggle single vaccine status (Scheduled <-> Completed)
  const handleToggleVaccineStatus = (patientId, vaccineCode) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const current = p.customVaccineStatus?.[vaccineCode] || { status: 'Scheduled' };
        const isDone = current.status === 'Completed';
        const updatedStatus = {
          ...p.customVaccineStatus,
          [vaccineCode]: {
            ...current,
            status: isDone ? 'Scheduled' : 'Completed',
            dateAdministered: isDone ? undefined : new Date().toISOString().split('T')[0],
            batchNo: isDone ? undefined : `GOI-UIP-${Math.floor(100000 + Math.random() * 900000)}`
          }
        };
        return { ...p, customVaccineStatus: updatedStatus };
      }
      return p;
    }));
  };

  // Quick action: Mark vaccine completed directly from dashboard
  const handleMarkCompletedFromDash = (patientId, vaccineName) => {
    handleToggleVaccineStatus(patientId, vaccineName);
  };

  // Add Log Entry
  const handleAddLog = (newLog) => {
    const logItem = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newLog
    };
    setLogs([logItem, ...logs]);
  };

  // Quick Action: Trigger WhatsApp from anywhere
  const handleSendWhatsAppQuick = async (patient, vaccineName, dueDate, isOverdue) => {
    const rawPhone = (patient.phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('91') ? `+${rawPhone}` : `+91${rawPhone}`;

    const msg = isOverdue
      ? `🚨 *URGENT IMMUNIZATION ALERT - ${patient.clinicName}*\n\nDear *${patient.parentName}*,\nThis is an urgent immunization alert for *${patient.childName}* under Universal Immunization Programme (UIP).\n\n💉 *Vaccine Due:* ${vaccineName}\n📅 *Due Date:* ${dueDate} (OVERDUE)\n📍 *Location:* ${patient.clinicName}\n\n💧 *Care Tip:* Please keep your child well-hydrated post-vaccination. Water and milk help prevent fever spikes.\n📞 *National Health Helpline:* 1075`
      : `✨ *IMMUNIZATION REMINDER - ${patient.clinicName}*\n\nDear *${patient.parentName}*,\nUpcoming vaccination scheduled for *${patient.childName}* under Universal Immunization Programme.\n\n💉 *Vaccine:* ${vaccineName}\n📅 *Date:* ${dueDate}\n📍 *Centre:* ${patient.clinicName}\n\nPlease reply *CONFIRM* to lock in your appointment spot.`;

    const waUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(msg)}`;

    // Record log in state
    handleAddLog({
      patientId: patient.id,
      childName: patient.childName,
      parentName: patient.parentName,
      channel: 'WhatsApp',
      recipient: cleanPhone,
      vaccineName: `${vaccineName} ${isOverdue ? '(Overdue)' : ''}`,
      messagePreview: msg.substring(0, 90) + '...',
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Sent',
      statusBadge: 'success'
    });

    // Also sync to backend API if available
    api.quickTestNotification({
      channel: 'whatsapp',
      recipient: cleanPhone,
      childName: patient.childName,
      vaccineName,
      dueDate: dueDate.includes('(') ? new Date().toISOString().split('T')[0] : dueDate,
      clinicName: patient.clinicName
    }).catch(err => console.warn('Backend log notification warning:', err.message));

    window.open(waUrl, '_blank');
  };

  // Broadcast WhatsApp to all overdue patients
  const handleBatchDispatchWhatsApp = () => {
    let count = 0;
    patients.forEach(patient => {
      if (patient.customVaccineStatus) {
        Object.entries(patient.customVaccineStatus).forEach(([vacName, info]) => {
          if (info.status === 'Overdue') {
            count++;
            handleAddLog({
              patientId: patient.id,
              childName: patient.childName,
              parentName: patient.parentName,
              channel: 'WhatsApp Broadcast',
              recipient: patient.phone,
              vaccineName: `${vacName} (Overdue Alert)`,
              messagePreview: `Broadcast Alert: Urgent vaccination reminder for ${patient.childName} (${vacName}).`,
              timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
              status: 'Delivered',
              statusBadge: 'success'
            });
          }
        });
      }
    });

    // Also trigger backend cron scan
    api.triggerCronNow().catch(() => {});

    alert(`Successfully broadcasted ${count} WhatsApp urgent alert notifications to registered parents!`);
  };

  // Quick Action: Trigger Email
  const handleSendEmailQuick = (patient, vaccineName, dueDate) => {
    setActiveTab('reminder');
  };

  // Open Certificate tab for specific patient
  const handleOpenCertificate = (patient) => {
    setSelectedPatientForCert(patient);
    setActiveTab('certificate');
  };

  // Compute total overdue count across all patients
  const overdueCount = patients.reduce((acc, p) => {
    if (p.customVaccineStatus) {
      const overdues = Object.values(p.customVaccineStatus).filter(v => v.status === 'Overdue').length;
      return acc + overdues;
    }
    return acc;
  }, 0);

  const stats = {
    totalPatients: patients.length,
    overdueCount,
    sentLogsCount: logs.length
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenAddPatient={() => {
          setPatientToEdit(null);
          setIsAddPatientModalOpen(true);
        }}
        onOpenAcademicDocs={() => setIsAcademicDocsOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        stats={stats}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main View Switcher */}
      <main style={{ flex: 1 }}>
        {activeTab === 'dashboard' && (
          <Dashboard 
            patients={patients}
            logs={logs}
            setActiveTab={setActiveTab}
            onSendWhatsApp={handleSendWhatsAppQuick}
            onSendEmail={handleSendEmailQuick}
            onMarkCompleted={handleMarkCompletedFromDash}
            onOpenAddPatient={() => {
              setPatientToEdit(null);
              setIsAddPatientModalOpen(true);
            }}
            onBatchDispatchWhatsApp={handleBatchDispatchWhatsApp}
          />
        )}

        {activeTab === 'patients' && (
          <PatientList 
            patients={patients}
            onOpenAddModal={(p) => {
              setPatientToEdit(p);
              setIsAddPatientModalOpen(true);
            }}
            onEditPatient={(p) => {
              setPatientToEdit(p);
              setIsAddPatientModalOpen(true);
            }}
            onDeletePatient={handleDeletePatient}
            onSendWhatsApp={handleSendWhatsAppQuick}
            onSendEmail={handleSendEmailQuick}
            onOpenCertificate={handleOpenCertificate}
            onToggleVaccineStatus={handleToggleVaccineStatus}
          />
        )}

        {activeTab === 'milestones' && (
          <MilestoneTimeline 
            patients={patients}
            onToggleVaccineStatus={handleToggleVaccineStatus}
            onSendWhatsApp={handleSendWhatsAppQuick}
          />
        )}

        {activeTab === 'reminder' && (
          <ReminderHub 
            patients={patients}
            onAddLog={handleAddLog}
          />
        )}

        {activeTab === 'hydration' && (
          <HydrationCareCenter 
            patients={patients}
          />
        )}

        {activeTab === 'library' && (
          <VaccineLibrary />
        )}

        {activeTab === 'certificate' && (
          <CertificateView 
            patients={patients}
            selectedPatientProp={selectedPatientForCert}
          />
        )}

        {activeTab === 'logs' && (
          <NotificationLogs 
            logs={logs}
            onResendLog={(log) => {
              const patient = patients.find(p => p.id === log.patientId);
              if (patient) {
                handleSendWhatsAppQuick(patient, log.vaccineName, 'Immediate', false);
              } else {
                alert(`Re-triggering alert payload to ${log.recipient}...`);
              }
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard 
            currentUser={currentUser} 
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.25rem 0', background: 'var(--bg-card)', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div>
            <strong>VaxAlert Pro (India UIP Edition)</strong> — Child Immunization WhatsApp & Email Reminder Platform
          </div>
          <div>
            Universal Immunization Programme (UIP) • Ministry of Health and Family Welfare (MoHFW), Govt. of India
          </div>
        </div>
      </footer>

      {/* Patient Register / Edit Modal */}
      <PatientModal 
        isOpen={isAddPatientModalOpen}
        onClose={() => {
          setIsAddPatientModalOpen(false);
          setPatientToEdit(null);
        }}
        onSave={handleSavePatient}
        patientToEdit={patientToEdit}
      />

      {/* Academic Project Presentation Modal */}
      <AcademicDocsModal 
        isOpen={isAcademicDocsOpen}
        onClose={() => setIsAcademicDocsOpen(false)}
      />

      {/* Indian Login & Registration Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

    </div>
  );
}
