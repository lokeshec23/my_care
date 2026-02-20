import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ChevronLeft, Save, Droplets, Zap, Activity, History, CheckCircle2, CloudRain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, differenceInDays } from 'date-fns';

const LogCycle = () => {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');
    const [flowLevel, setFlowLevel] = useState('medium');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [symptoms, setSymptoms] = useState({ cramps: 0, bloating: 0, mood: 'fine' });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchContext = async () => {
            try {
                const [cyclesRes, dashboardRes] = await Promise.all([
                    api.get('/cycles'),
                    api.get('/dashboard')
                ]);
                const sortedHistory = [...cyclesRes.data].sort((a, b) => new Date(b.start_date) - new Date(a.start_date)).slice(0, 3);
                setHistory(sortedHistory);
                setStats(dashboardRes.data.prediction);
            } catch (error) {
                console.error('Failed to fetch logging context', error);
            }
        };
        fetchContext();
    }, []);

    const duration = endDate ? differenceInDays(parseISO(endDate), parseISO(startDate)) + 1 : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/cycles', { start_date: startDate, end_date: endDate || null, flow_level: flowLevel, notes: notes });
            if (symptoms.cramps > 0 || symptoms.bloating > 0 || symptoms.mood !== 'fine') {
                await api.post('/symptoms', { date: startDate, cramps: symptoms.cramps, bloating: symptoms.bloating, mood: symptoms.mood });
            }
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error) {
            console.error('Failed to log period', error);
        } finally {
            setLoading(false);
        }
    };

    const flowTiers = [
        { id: 'spotting', label: 'Spot', icon: '💧', color: '#FFB7B7' },
        { id: 'light', label: 'Light', icon: '🩸', color: '#FF8E8E' },
        { id: 'medium', label: 'Medium', icon: '🩸🩸', color: '#FF6B8A' },
        { id: 'heavy', label: 'Heavy', icon: '🍷', color: '#D64545' }
    ];

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

    return (
        <div className="dashboard-content" style={{ padding: '20px', minHeight: '100vh', background: 'linear-gradient(180deg, #FFF5F7 0%, #FFFFFF 100%)' }}>
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(255,255,255,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
                    >
                        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }}>
                            <CheckCircle2 size={100} color="#FF6B8A" strokeWidth={1.5} />
                        </motion.div>
                        <h2 style={{ marginTop: '24px', fontWeight: 700, color: 'var(--color-primary-dark)' }}>Saved Perfectly!</h2>
                    </motion.div>
                )}
            </AnimatePresence>

            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'white', width: '44px', height: '44px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={24} />
                </button>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>Track Period</h2>
            </header>

            <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* DATE SELECTOR SECTION */}
                <motion.section variants={itemVariants} className="card" style={{ padding: '24px', borderRadius: '24px', border: '1px solid #FFF', boxShadow: '0 10px 30px rgba(255,107,138,0.08)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05, color: 'var(--color-primary)' }}><History size={120} /></div>
                    <div style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: '#AAA', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>START DATE</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ border: 'none', width: '100%', fontSize: '16px', fontWeight: 700, padding: '0', background: 'transparent', color: 'var(--color-primary-dark)' }} />
                        </div>
                        <div style={{ width: '1px', background: '#EEE' }}></div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: '#AAA', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>END DATE</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ border: 'none', width: '100%', fontSize: '16px', fontWeight: 700, padding: '0', background: 'transparent', color: 'var(--color-primary-dark)' }} />
                        </div>
                    </div>
                    {duration && (
                        <div style={{ marginTop: '20px', display: 'inline-block', background: 'var(--color-secondary)', color: 'var(--color-primary)', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 700 }}>
                            ✨ Period lasted {duration} days
                        </div>
                    )}
                </motion.section>

                {/* FLOW INTENSITY SECTION */}
                <motion.section variants={itemVariants}>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', paddingLeft: '8px' }}>Flow Intensity</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {flowTiers.map((tier) => (
                            <motion.div
                                key={tier.id} whileTap={{ scale: 0.95 }}
                                onClick={() => setFlowLevel(tier.id)}
                                style={{
                                    cursor: 'pointer', padding: '16px 8px', borderRadius: '20px', textAlign: 'center', transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                    background: flowLevel === tier.id ? tier.color : 'white',
                                    color: flowLevel === tier.id ? 'white' : 'inherit',
                                    border: '1px solid', borderColor: flowLevel === tier.id ? tier.color : '#F0F0F0',
                                    boxShadow: flowLevel === tier.id ? `0 10px 20px ${tier.color}33` : '0 4px 12px rgba(0,0,0,0.03)'
                                }}
                            >
                                <div style={{ fontSize: '20px', marginBottom: '8px' }}>{tier.icon}</div>
                                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>{tier.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* FEELING / SYMPTOMS SECTION */}
                <motion.section variants={itemVariants} className="card" style={{ padding: '24px', borderRadius: '24px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={18} color="#FFD700" fill="#FFD700" /> How are you feeling?
                    </h4>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', background: '#F9F9F9', padding: '16px', borderRadius: '16px' }}>
                        {['happy', 'fine', 'sad', 'irritable'].map(m => (
                            <motion.button
                                key={m} type="button" whileTap={{ scale: 0.9 }}
                                onClick={() => setSymptoms({ ...symptoms, mood: m })}
                                style={{ border: 'none', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: symptoms.mood === m ? 1 : 0.4 }}
                            >
                                <span style={{ fontSize: '24px' }}>{m === 'happy' ? '😊' : m === 'fine' ? '😐' : m === 'sad' ? '😢' : '😠'}</span>
                                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'capitalize' }}>{m}</span>
                            </motion.button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700 }}>Cramps</p>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {[0, 1, 2, 3].map(lvl => (
                                    <button
                                        key={lvl} type="button" onClick={() => setSymptoms({ ...symptoms, cramps: lvl })}
                                        style={{ border: 'none', height: '32px', flex: 1, borderRadius: '8px', background: symptoms.cramps === lvl ? '#FF7D7D' : '#F0F0F0', color: symptoms.cramps === lvl ? 'white' : '#888', fontWeight: 800, fontSize: '12px' }}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.section variants={itemVariants} className="card" style={{ padding: '20px', borderRadius: '24px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#AAA', display: 'block', marginBottom: '12px' }}>EXTRAS</label>
                    <textarea placeholder="Notes about today..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ width: '100%', border: 'none', background: '#F8F8F8', padding: '16px', borderRadius: '16px', fontSize: '14px', resize: 'none', fontWeight: 600 }} />
                </motion.section>

                {/* BOTTOM HISTORY STRIP */}
                <motion.section variants={itemVariants} style={{ marginBottom: '180px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 800, color: '#BBB', textAlign: 'center', marginBottom: '16px' }}>RECENT CYCLES</p>
                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 8px 10px', scrollbarWidth: 'none' }}>
                        {history.map((c, i) => (
                            <div key={i} style={{ minWidth: '140px', background: 'rgba(255,255,255,0.7)', border: '1px solid #EEE', padding: '12px', borderRadius: '16px', backdropFilter: 'blur(4px)' }}>
                                <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)' }}>{format(parseISO(c.start_date), 'MMM d')}</p>
                                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600 }}>{c.flow_level} Flow</p>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </motion.div>

            {/* FLOATING ACTION BUTTON */}
            <div style={{ position: 'fixed', bottom: '110px', left: '25px', right: '25px', zIndex: 10 }}>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit} disabled={loading}
                    style={{ width: '100%', border: 'none', background: 'linear-gradient(135deg, #FF6B8A 0%, #FF4D7E 100%)', height: '64px', borderRadius: '24px', color: 'white', fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 15px 35px rgba(255,107,138,0.4)' }}
                >
                    {loading ? 'SYNCING...' : <><Save size={20} /> LOG PERIOD</>}
                </motion.button>
            </div>
        </div>
    );
};

export default LogCycle;
