import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ChevronLeft, Bell, Save, Clock, CalendarDays, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Reminders = () => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const reminderTypes = [
        { type: 'period', label: 'Period starts', icon: '📅', color: '#FF6B8A' },
        { type: 'ovulation', label: 'Ovulation', icon: '✨', color: '#7D95FF' },
        { type: 'contraceptive', label: 'Contraceptive', icon: '💊', color: '#FFD700' },
        { type: 'logs', label: 'Daily Logging', icon: '📝', color: '#4CAF50' }
    ];

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            const response = await api.get('/reminders');
            setReminders(response.data);
        } catch (error) {
            console.error('Failed to fetch reminders', error);
        } finally {
            setLoading(false);
        }
    };

    const updateReminder = async (type, updates) => {
        setSaving(true);
        try {
            const current = reminders.find(r => r.type === type) || {
                type,
                time: "09:00",
                enabled: false,
                days_before: 1
            };

            await api.post('/reminders', { ...current, ...updates });
            await fetchReminders();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (error) {
            console.error('Failed to update reminder', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-content" style={{ paddingBottom: '100px', background: 'linear-gradient(180deg, #FBF8F9 0%, #FFFFFF 100%)', minHeight: '100vh' }}>
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#333', color: 'white', padding: '12px 24px', borderRadius: '20px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}
                    >
                        <CheckCircle2 size={18} color="#FF6B8A" /> Settings Updated
                    </motion.div>
                )}
            </AnimatePresence>

            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'white', width: '44px', height: '44px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={24} />
                </button>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Reminders</h2>
            </header>

            <p className="text-muted px-2 mb-4" style={{ fontSize: '14px', lineHeight: 1.5 }}>
                Personalize your notifications to stay in sync with your cycle.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reminderTypes.map((item) => {
                    const r = reminders.find(rem => rem.type === item.type);
                    const isEnabled = r ? r.enabled : false;

                    return (
                        <motion.div
                            key={item.type}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card"
                            style={{
                                margin: 0,
                                padding: '24px',
                                border: isEnabled ? `1.5px solid ${item.color}33` : '1.5px solid #F0F0F0',
                                boxShadow: isEnabled ? `0 10px 30px ${item.color}11` : '0 4px 12px rgba(0,0,0,0.02)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${item.color}11`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{item.label}</h4>
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: isEnabled ? item.color : '#BBB', textTransform: 'uppercase' }}>
                                            {isEnabled ? 'Notification Active' : 'Off'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => updateReminder(item.type, { enabled: !isEnabled })}
                                    style={{
                                        width: '52px', height: '28px', borderRadius: '14px', border: 'none',
                                        background: isEnabled ? item.color : '#E0E0E0',
                                        position: 'relative', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer'
                                    }}
                                >
                                    <div style={{
                                        width: '22px', height: '22px', borderRadius: '50%', background: 'white',
                                        position: 'absolute', top: '3px', left: isEnabled ? '27px' : '3px',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}></div>
                                </button>
                            </div>

                            <AnimatePresence>
                                {isEnabled && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden', borderTop: '1px solid #F8F8F8', paddingTop: '20px' }}
                                    >
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', fontWeight: 800, color: '#AAA', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                                    <Clock size={12} /> NOTIFICATION TIME
                                                </label>
                                                <input
                                                    type="time"
                                                    value={r?.time || "09:00"}
                                                    onChange={(e) => updateReminder(item.type, { time: e.target.value })}
                                                    style={{ width: '100%', border: 'none', background: '#F9F9F9', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: '#333' }}
                                                />
                                            </div>
                                            {(item.type === 'period' || item.type === 'ovulation') && (
                                                <div style={{ flex: 1 }}>
                                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#AAA', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                                        <CalendarDays size={12} /> DAYS BEFORE
                                                    </label>
                                                    <select
                                                        value={r?.days_before || 1}
                                                        onChange={(e) => updateReminder(item.type, { days_before: parseInt(e.target.value) })}
                                                        style={{ width: '100%', border: 'none', background: '#F9F9F9', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: '#333' }}
                                                    >
                                                        <option value={1}>1 day</option>
                                                        <option value={2}>2 days</option>
                                                        <option value={3}>3 days</option>
                                                        <option value={7}>1 week</option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <div className="card text-center" style={{ marginTop: '32px', padding: '24px', background: '#F1F4FF', border: 'none' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#4A62D6' }}>
                    Push notifications are sent directly to your device.
                </p>
            </div>
        </div>
    );
};

export default Reminders;
