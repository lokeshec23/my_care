import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, X, Activity, Droplet, Zap, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [cycles, setCycles] = useState([]);
    const [predictions, setPredictions] = useState(null);
    const [symptoms, setSymptoms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cyclesRes, predRes, symptomsRes] = await Promise.all([
                    api.get('/cycles'),
                    api.get('/predictions'),
                    api.get('/symptoms') // Assuming an endpoint that returns all or recent symptoms
                ]);
                setCycles(cyclesRes.data);
                setPredictions(predRes.data);
                setSymptoms(symptomsRes.data);
            } catch (error) {
                console.error('Failed to fetch calendar data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const getDayStatus = (day) => {
        const dateStr = format(day, 'yyyy-MM-dd');

        // Logged Period
        const isLogged = cycles.some(c => {
            const start = c.start_date;
            const end = c.end_date || start;
            return dateStr >= start && dateStr <= end;
        });
        if (isLogged) return 'logged-period';

        // Predicted Period
        const isPredicted = predictions?.future_predictions?.some(p => {
            return dateStr >= p.start_date && dateStr <= p.end_date;
        }) || (dateStr >= predictions?.next_period_date && dateStr <= format(addMonths(parseISO(predictions?.next_period_date), 0), 'yyyy-MM-dd')); // Basic fallthrough for next period

        if (isPredicted) return 'predicted-period';

        // Ovulation
        const isOvulation = predictions?.future_predictions?.some(p => dateStr === p.ovulation_date) ||
            dateStr === predictions?.ovulation_date;
        if (isOvulation) return 'ovulation';

        return 'normal';
    };

    const hasSymptoms = (day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        return symptoms.some(s => s.date === dateStr);
    };

    const getDayLogs = (day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const daySymptoms = symptoms.find(s => s.date === dateStr);
        const dayCycle = cycles.find(c => dateStr >= c.start_date && dateStr <= (c.end_date || c.start_date));
        return { symptoms: daySymptoms, cycle: dayCycle };
    };

    return (
        <div className="dashboard-content" style={{ paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', margin: 0 }}>Health Calendar</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="btn-secondary" style={{ padding: '8px', borderRadius: '12px' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="btn-secondary" style={{ padding: '8px', borderRadius: '12px' }}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
                <h3 className="text-center mb-4" style={{ fontSize: '18px', fontWeight: 700 }}>{format(currentMonth, 'MMMM yyyy')}</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} style={{ fontSize: '11px', fontWeight: 700, color: '#BBB', marginBottom: '12px' }}>{d}</div>
                    ))}

                    {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                        <div key={`pad-${i}`} />
                    ))}

                    {days.map(day => {
                        const status = getDayStatus(day);
                        const isToday = isSameDay(day, new Date());
                        const symp = hasSymptoms(day);

                        let bgColor = 'transparent';
                        let textColor = 'var(--color-text-main)';
                        let border = 'none';

                        if (status === 'logged-period') {
                            bgColor = 'var(--color-primary)';
                            textColor = 'white';
                        } else if (status === 'predicted-period') {
                            border = '1.5px dashed var(--color-primary)';
                            textColor = 'var(--color-primary)';
                        } else if (status === 'ovulation') {
                            bgColor = '#E0F2F1';
                            textColor = '#00897B';
                            border = '1px solid #00897B';
                        }

                        if (isToday && status === 'normal') {
                            border = '1.5px solid var(--color-primary)';
                            textColor = 'var(--color-primary)';
                        }

                        return (
                            <motion.div
                                key={day.toString()}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedDay(day)}
                                style={{
                                    height: '42px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: isToday || status !== 'normal' ? 700 : 400,
                                    background: bgColor,
                                    color: textColor,
                                    border: border,
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}
                            >
                                {format(day, 'd')}
                                {symp && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '4px',
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        background: status === 'logged-period' ? 'white' : 'var(--color-primary)'
                                    }} />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* LEGEND */}
            <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--color-primary)' }}></div>
                    <span>Logged Period</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', border: '1.5px dashed var(--color-primary)' }}></div>
                    <span>Predicted</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#E0F2F1', border: '1px solid #00897B' }}></div>
                    <span>Ovulation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-primary)' }}></div>
                    <span>Symptoms</span>
                </div>
            </div>

            {/* ACTIVITY SHEET (MODAL/DRAWER) */}
            <AnimatePresence>
                {selectedDay && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'white',
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                            padding: '24px',
                            boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
                            zIndex: 1000,
                            maxHeight: '70vh',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>{format(selectedDay, 'EEEE, MMM d')}</h3>
                                <p className="text-muted" style={{ fontSize: '14px', margin: 0 }}>Day Activity</p>
                            </div>
                            <button onClick={() => setSelectedDay(null)} style={{ border: 'none', background: '#F5F5F5', width: '32px', height: '32px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={18} />
                            </button>
                        </div>

                        {(() => {
                            const { symptoms: daySymp, cycle: dayCycle } = getDayLogs(selectedDay);
                            if (!daySymp && !dayCycle) {
                                return (
                                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                        <p className="text-muted mb-4">No health data logged for this day.</p>
                                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                            <Link to="/log" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>Log Period</Link>
                                            <Link to="/symptoms" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>Log Symptoms</Link>
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div>
                                    {dayCycle && (
                                        <div className="card" style={{ background: 'var(--color-secondary)', border: 'none' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Droplet size={20} color="var(--color-primary)" />
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--color-primary-dark)' }}>Period Logged</h4>
                                                    <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Flow: {dayCycle.flow_level}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {daySymp && (
                                        <div className="card">
                                            <h4 className="mb-3" style={{ fontSize: '14px' }}>Logged Symptoms</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                {['cramps', 'bloating', 'headache'].map(s => daySymp[s] > 0 && (
                                                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                                                        <Activity size={14} color="var(--color-primary)" />
                                                        <span style={{ textTransform: 'capitalize' }}>{s} (Lvl {daySymp[s]})</span>
                                                    </div>
                                                ))}
                                                {daySymp.mood && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                                                        <Zap size={14} color="#A97DFF" />
                                                        <span style={{ textTransform: 'capitalize' }}>Mood: {daySymp.mood}</span>
                                                    </div>
                                                )}
                                                {daySymp.energy && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                                                        <Zap size={14} color="#FF9900" />
                                                        <span style={{ textTransform: 'capitalize' }}>Energy: {daySymp.energy}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {daySymp.notes && (
                                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #EEE' }}>
                                                    <p style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 4px 0' }}>NOTES</p>
                                                    <p style={{ fontSize: '13px', fontStyle: 'italic', margin: 0 }}>"{daySymp.notes}"</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </motion.div>
                )}
            </AnimatePresence>

            {selectedDay && (
                <div
                    onClick={() => setSelectedDay(null)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999 }}
                />
            )}
        </div>
    );
};

export default Calendar;
