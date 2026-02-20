import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ChevronLeft, Save } from 'lucide-react';

const SymptomLog = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [symptoms, setSymptoms] = useState({
        cramps: 0,
        bloating: 0,
        headache: 0,
        mood: '',
        energy: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const moods = ['happy', 'sad', 'anxious', 'irritable', 'calm'];
    const energyLevels = ['high', 'medium', 'low', 'exhausted'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/symptoms', {
                date,
                ...symptoms
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to log symptoms', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none' }}><ChevronLeft size={24} /></button>
                <h2 style={{ fontSize: '24px' }}>Daily Symptoms</h2>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="card">
                    <label className="mb-2" style={{ display: 'block', fontWeight: 600 }}>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid #EEE5E7' }}
                    />
                </div>

                <div className="card">
                    <h4 className="mb-4">Physical Symptoms</h4>
                    {['cramps', 'bloating', 'headache'].map(s => (
                        <div key={s} className="mb-4">
                            <label style={{ display: 'block', fontSize: '14px', textTransform: 'capitalize' }}>{s}</label>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                {[0, 1, 2, 3].map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setSymptoms({ ...symptoms, [s]: level })}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            borderRadius: '8px',
                                            border: '1.5px solid',
                                            borderColor: symptoms[s] === level ? 'var(--color-primary)' : '#EEE5E7',
                                            background: symptoms[s] === level ? 'var(--color-secondary)' : 'white'
                                        }}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <h4 className="mb-4">Mood & Energy</h4>
                    <div className="mb-4">
                        <label style={{ fontSize: '14px' }}>Mood</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                            {moods.map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setSymptoms({ ...symptoms, mood: m })}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1.5px solid',
                                        borderColor: symptoms.mood === m ? 'var(--color-primary)' : '#EEE5E7',
                                        background: symptoms.mood === m ? 'var(--color-secondary)' : 'white',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Saving...' : 'Save Symptoms'}
                </button>
            </form>
        </div>
    );
};

export default SymptomLog;
