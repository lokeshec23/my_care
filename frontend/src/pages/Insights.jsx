import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Calendar, Activity, Info, ChevronRight, Zap, Heart, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const Insights = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await api.get('/dashboard');
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch insights', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    if (loading) return (
        <div className="text-center" style={{ padding: '80px 20px' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{ color: 'var(--color-primary)', marginBottom: '16px', display: 'inline-block' }}
            >
                <Activity size={40} />
            </motion.div>
            <p className="text-muted">Generating your health report...</p>
        </div>
    );

    const { stats, prediction } = data || {};
    const history = stats?.history || [];

    // Format data for charts
    const cycleTrendData = history.filter(h => h.length !== null).map((h, i) => ({
        name: `C${i + 1}`,
        length: h.length,
        date: h.date
    }));

    const durationData = history.filter(h => h.duration !== null).map((h, i) => ({
        name: `P${i + 1}`,
        duration: h.duration
    }));

    // Fallback if no history
    const showMock = history.length < 2;
    const mockCycleData = [
        { name: 'C1', length: 28 },
        { name: 'C2', length: 30 },
        { name: 'C3', length: 27 },
        { name: 'C4', length: 29 },
    ];
    const mockDurationData = [
        { name: 'P1', duration: 5 },
        { name: 'P2', duration: 6 },
        { name: 'P3', duration: 4 },
        { name: 'P4', duration: 5 },
    ];

    const finalCycleData = showMock ? mockCycleData : cycleTrendData;
    const finalDurationData = showMock ? mockDurationData : durationData;

    return (
        <div className="dashboard-content" style={{ paddingBottom: '120px' }}>
            <header className="mb-4">
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Analytics</h2>
                <p className="text-muted" style={{ fontSize: '13px' }}>Your cycle trends and patterns</p>
            </header>

            {/* KEY METRICS SUMMARY */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="card" style={{ marginBottom: 0, background: 'linear-gradient(135deg, white 0%, #FFF5F7 100%)', border: '1px solid #FFF' }}
                >
                    <div style={{ color: 'var(--color-primary)', marginBottom: '12px', background: 'var(--color-secondary)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={18} />
                    </div>
                    <p className="text-muted" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Cycle</p>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
                        {stats?.average_cycle_length || 28} <span style={{ fontSize: '12px', fontWeight: 400, color: '#AAA' }}>days</span>
                    </h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="card" style={{ marginBottom: 0, background: 'linear-gradient(135deg, white 0%, #F1F4FF 100%)', border: '1px solid #FFF' }}
                >
                    <div style={{ color: '#7D95FF', marginBottom: '12px', background: '#E0E8FF', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={18} fill="#7D95FF" />
                    </div>
                    <p className="text-muted" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Period</p>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
                        {stats?.average_period_length || 5} <span style={{ fontSize: '12px', fontWeight: 400, color: '#AAA' }}>days</span>
                    </h3>
                </motion.div>
            </div>

            {/* CYCLE LENGTH TREND CHART */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '24px', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>Cycle Length Trends</h4>
                    {showMock && <span style={{ fontSize: '10px', background: '#EEE', padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>PREVIEW</span>}
                </div>

                <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={finalCycleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorLength" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} fontWeight={600} tick={{ fill: '#AAA' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} fontSize={11} fontWeight={600} tick={{ fill: '#AAA' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px' }}
                                itemStyle={{ fontWeight: 700, color: 'var(--color-primary)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="length"
                                stroke="var(--color-primary)"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorLength)"
                                dot={{ fill: 'white', stroke: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, fill: 'var(--color-primary)', stroke: 'white', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* PERIOD DURATION CHART */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '24px', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>Period Duration</h4>
                </div>

                <div style={{ width: '100%', height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={finalDurationData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} fontWeight={600} tick={{ fill: '#AAA' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} fontSize={11} fontWeight={600} tick={{ fill: '#AAA' }} />
                            <Tooltip
                                cursor={{ fill: '#FFF5F7' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="duration" fill="#FFB7B7" radius={[6, 6, 0, 0]} barSize={30}>
                                {finalDurationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === finalDurationData.length - 1 ? 'var(--color-primary)' : '#FFB7B7'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* SYMPTOM HIGHLIGHTS */}
            <div className="card" style={{ padding: '24px', borderRadius: '24px' }}>
                <h4 className="mb-4">Common Correlations</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                        { icon: <Heart size={18} />, label: 'Luteal Phase', value: 'High Progesterone', sub: 'Correlates with better sleep' },
                        { icon: <Moon size={18} />, label: 'Menstruation', value: 'Low Estrogen', sub: 'Correlates with lower energy' },
                        { icon: <Activity size={18} />, label: 'Ovulation', value: 'Estrogen Peak', sub: 'Correlates with peak sociability' }
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F8F8F8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 0 ? '#FF6B8A' : i === 1 ? '#7B61FF' : '#00B2FF' }}>
                                {item.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{item.label}: <span style={{ color: 'var(--color-primary)' }}>{item.value}</span></p>
                                <p className="text-muted" style={{ margin: 0, fontSize: '11px' }}>{item.sub}</p>
                            </div>
                            <ChevronRight size={16} color="#DDD" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="card" style={{ background: 'var(--color-text-main)', color: 'white', padding: '24px', borderRadius: '24px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={24} color="white" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ color: 'white', margin: '0 0 4px 0' }}>Data Accuracy</h4>
                        <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>You've logged {stats?.cycle_count || 0} cycles. Log 2 more to unlock personalized endocrine insights.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Insights;
