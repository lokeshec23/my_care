import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Calendar, Activity, PlusCircle, TrendingUp, Droplet, Zap, Info, ChevronRight, Heart, Wind, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [waterCount, setWaterCount] = useState(0);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/dashboard');
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch dashboard', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();

        // Load water count from local storage for quick habit tracking
        const savedWater = localStorage.getItem('mycare_water_today');
        const todayStr = new Date().toDateString();
        const lastSavedDate = localStorage.getItem('mycare_water_date');

        if (lastSavedDate === todayStr) {
            setWaterCount(parseInt(savedWater || '0'));
        } else {
            localStorage.setItem('mycare_water_date', todayStr);
            localStorage.setItem('mycare_water_today', '0');
            setWaterCount(0);
        }
    }, []);

    const updateWater = (val) => {
        const newVal = Math.max(0, waterCount + val);
        setWaterCount(newVal);
        localStorage.setItem('mycare_water_today', newVal.toString());
    };

    if (loading) return (
        <div className="text-center" style={{ padding: '80px 20px' }}>
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ color: 'var(--color-primary)', marginBottom: '16px' }}
            >
                <Heart size={48} fill="var(--color-primary)" />
            </motion.div>
            <p className="text-muted" style={{ fontWeight: 500 }}>Personalizing your cycle insights...</p>
        </div>
    );

    const { prediction, user, recent_symptoms, stats } = data || {};
    const currentPhase = prediction?.current_phase || 'unknown';
    const hormones = prediction?.hormone_levels || {};
    const cycleDay = prediction?.current_cycle_day || 1;
    const avgCycle = prediction?.average_cycle_length || 28;

    // Fertility calculation (rough visual mapping)
    const fertilityLevel = currentPhase === 'ovulation' ? 100 : (currentPhase === 'follicular' ? 60 : 20);

    return (
        <div className="dashboard-content">
            <header className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 className="mb-1">Hi, {user?.name.split(' ')[0]} 👋</h3>
                    <p className="text-muted" style={{ fontSize: '13px' }}>Today is Day {cycleDay} of your cycle</p>
                </div>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '21px', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, boxShadow: '0 4px 10px rgba(255,125,125,0.3)' }}>
                        {user?.name?.[0]}
                    </div>
                </Link>
            </header>

            {/* MAIN PHASE CARD */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card phase-card"
                style={{ position: 'relative', overflow: 'hidden', padding: '24px' }}
            >
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 className="mb-1" style={{ textTransform: 'capitalize', fontSize: '28px' }}>{currentPhase.replace('_', ' ')}</h2>
                            <p className="countdown-text" style={{ fontSize: '16px', opacity: 0.9 }}>
                                {prediction?.days_until_next_period > 0
                                    ? `Next period in ${prediction.days_until_next_period} days`
                                    : 'Period starting soon!'}
                            </p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.3)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                            Day {cycleDay}
                        </div>
                    </div>

                    {/* Hormone Snapshot */}
                    <div style={{ display: 'flex', gap: '8px', margin: '20px 0' }}>
                        {Object.entries(hormones).map(([name, level]) => (
                            <div key={name} style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '10px', fontSize: '11px', flex: 1, textAlign: 'center' }}>
                                <span style={{ opacity: 0.8, textTransform: 'capitalize', display: 'block', fontSize: '10px', marginBottom: '2px' }}>{name}</span>
                                <b>{level}</b>
                            </div>
                        ))}
                    </div>

                    {prediction?.phase_tips && (
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '14px', borderRadius: '16px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                <Zap size={14} fill="white" />
                                <span style={{ fontSize: '11px', fontWeight: 800, opacity: 0.9, letterSpacing: '0.5px' }}>DAILY INSIGHT</span>
                            </div>
                            <p style={{ fontSize: '14px', lineHeight: 1.4 }}>{prediction.phase_tips[0]}</p>
                        </div>
                    )}
                </div>

                {/* Visual Circle Progress Background */}
                <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '200px', height: '200px', borderRadius: '100px', border: '20px solid rgba(255,255,255,0.1)', zIndex: 0 }}></div>
            </motion.div>

            {/* FERTILITY & CYCLE JOURNEY */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>Cycle Journey</h4>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: fertilityLevel > 50 ? '#4CAF50' : 'var(--color-primary)' }}>
                        {fertilityLevel > 50 ? 'Fertile Window' : 'Low Fertility'}
                    </span>
                </div>

                {/* Timeline Journey */}
                <div style={{ position: 'relative', height: '24px', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '4px', background: '#F0F0F0', borderRadius: '2px' }}></div>
                    <div style={{
                        position: 'absolute',
                        width: `${(avgCycle / 28) * 100}%`,
                        height: '4px',
                        background: 'linear-gradient(90deg, #FFB7B7 0%, var(--color-primary) 100%)',
                        opacity: 0.3,
                        left: '0',
                        borderRadius: '2px'
                    }}></div>

                    {/* Progress Marker */}
                    <motion.div
                        initial={{ left: 0 }}
                        animate={{ left: `${(cycleDay / avgCycle) * 100}%` }}
                        style={{
                            position: 'absolute',
                            width: '16px',
                            height: '16px',
                            background: 'var(--color-primary)',
                            borderRadius: '50%',
                            border: '3px solid white',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            zIndex: 2,
                            marginLeft: '-8px'
                        }}
                    />

                    {/* Fertile Zone Highlight */}
                    <div style={{
                        position: 'absolute',
                        left: '40%',
                        width: '20%',
                        height: '10px',
                        background: '#4CAF50',
                        opacity: 0.15,
                        borderRadius: '5px',
                        zIndex: 1
                    }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    <span>Period</span>
                    <span style={{ color: '#4CAF50' }}>Fertile</span>
                    <span>Luteal</span>
                </div>
            </div>

            {/* QUICK ACTIONS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {[
                    { icon: <PlusCircle size={26} />, label: 'Period', path: '/log', color: '#FF7D7D', bg: '#FFF1F1' },
                    { icon: <Activity size={26} />, label: 'Symptom', path: '/symptoms', color: '#7D95FF', bg: '#F1F4FF' },
                    { icon: <Droplet size={26} />, label: 'Water', action: () => updateWater(1), color: '#4FACFE', bg: '#F1F9FF' },
                    { icon: <TrendingUp size={26} />, label: 'Trends', path: '/insights', color: '#A97DFF', bg: '#F6F1FF' }
                ].map((item, i) => (
                    item.path ? (
                        <Link key={i} to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <motion.div whileTap={{ scale: 0.9 }} className="text-center">
                                <div style={{ background: item.bg, width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: item.color }}>
                                    {item.icon}
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: 700 }}>{item.label}</span>
                            </motion.div>
                        </Link>
                    ) : (
                        <motion.div key={i} onClick={item.action} whileTap={{ scale: 0.9 }} style={{ cursor: 'pointer' }} className="text-center">
                            <div style={{ background: item.bg, width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: item.color }}>
                                {item.icon}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700 }}>{item.label}</span>
                        </motion.div>
                    )
                ))}
            </div>

            {/* WATER HABIT TRACKER */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #F0F7FF 0%, #E6F2FF 100%)', border: 'none', boxShadow: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2F80ED', boxShadow: '0 4px 10px rgba(47,128,237,0.1)' }}>
                            <Droplet size={22} fill={waterCount > 0 ? "#2F80ED" : "none"} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Water Hydration</h4>
                            <p className="text-muted" style={{ fontSize: '12px', margin: 0 }}>Today: {waterCount} / 8 cups</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button onClick={() => updateWater(-1)} style={{ width: '32px', height: '32px', borderRadius: '16px', border: '1px solid #C4D9FF', background: 'white', color: '#2F80ED', fontSize: '18px', fontWeight: 700 }}>-</button>
                        <button onClick={() => updateWater(1)} style={{ width: '32px', height: '32px', borderRadius: '16px', border: 'none', background: '#2F80ED', color: 'white', fontSize: '18px', fontWeight: 700 }}>+</button>
                    </div>
                </div>
                {/* Water Progress Bar */}
                <div style={{ height: '6px', background: 'rgba(47,128,237,0.1)', borderRadius: '3px', marginTop: '16px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (waterCount / 8) * 100)}%` }}
                        style={{ height: '100%', background: '#2F80ED' }}
                    />
                </div>
            </div>

            {/* SYMPTOM SNAPSHOT */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0 }}>Today's Symptoms</h4>
                    <Link to="/symptoms" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none' }}>Log Daily</Link>
                </div>
                {recent_symptoms && recent_symptoms.length > 0 ? (
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                        {recent_symptoms[0].mood && (
                            <div style={{ background: '#FDF2F2', color: 'var(--color-primary-dark)', padding: '10px 16px', borderRadius: '14px', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: 500 }}>
                                {recent_symptoms[0].mood === 'happy' ? '😊' : recent_symptoms[0].mood === 'sad' ? '😢' : '😐'} {recent_symptoms[0].mood}
                            </div>
                        )}
                        {['cramps', 'bloating', 'headache'].map(s => {
                            const level = recent_symptoms[0][s];
                            if (level > 0) return (
                                <div key={s} style={{ background: '#F8F8F8', padding: '10px 16px', borderRadius: '14px', whiteSpace: 'nowrap', fontSize: '13px', textTransform: 'capitalize', fontWeight: 500 }}>
                                    {s === 'cramps' ? '🩹' : s === 'bloating' ? '🎈' : '🧠'} {s} ({level})
                                </div>
                            );
                            return null;
                        })}
                    </div>
                ) : (
                    <div style={{ background: '#F9F9F9', padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
                        <p className="text-muted" style={{ fontSize: '13px', margin: 0 }}>No logs for today yet. Stay updated!</p>
                    </div>
                )}
            </div>

            {/* HEALTH TIPS HUB */}
            <div className="mb-4">
                <h4 className="mb-3 px-1">Recommended for you</h4>
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
                    {[
                        { title: 'Sleep Quality', text: 'Target 8+ hours', icon: <Moon size={18} />, color: '#7B61FF' },
                        { title: 'Iron Intake', text: 'Spinach & Beets', icon: <Activity size={18} />, color: '#FF4B4B' },
                        { title: 'Hydration', text: '2.5L daily target', icon: <Droplet size={18} />, color: '#00B2FF' },
                        { title: 'Light Yoga', text: '15 min stretches', icon: <Sun size={18} />, color: '#FF9900' }
                    ].map((tip, idx) => (
                        <div key={idx} style={{ minWidth: '140px', background: 'white', padding: '16px', borderRadius: '20px', border: '1px solid #F0F0F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ color: tip.color, marginBottom: '8px' }}>{tip.icon}</div>
                            <h5 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{tip.title}</h5>
                            <p className="text-muted" style={{ fontSize: '11px', margin: 0 }}>{tip.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* STATS PREVIEW */}
            <div className="card" style={{ marginBottom: '100px', background: 'var(--color-text-main)', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ color: 'white', margin: '0 0 4px 0' }}>Cycle Breakdown</h4>
                        <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>Avg Cycle: {stats?.average_cycle_length || 28} Days</p>
                    </div>
                    <Link to="/insights" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                        Full Stats
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
