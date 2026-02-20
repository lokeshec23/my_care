import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ChevronLeft, Save, User, Scale, Ruler, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const PersonalSettings = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        date_of_birth: user?.date_of_birth || '',
        weight: user?.weight || '',
        height: user?.height || '',
        average_cycle_length: user?.average_cycle_length || 28,
        average_period_length: user?.average_period_length || 5
    });

    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const bmi = formData.weight && formData.height
        ? (formData.weight / ((formData.height / 100) ** 2)).toFixed(1)
        : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.put('/auth/onboard', formData);
            // Update local auth context with new user data
            login({ ...response.data, token: localStorage.getItem('token') });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-content" style={{ paddingBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: '#F5F5F5', border: 'none', color: '#555', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <ChevronLeft size={24} />
                </button>
                <h2 style={{ fontSize: '24px', margin: 0 }}>Personal Info</h2>
            </div>

            <form onSubmit={handleSubmit}>
                {/* BASIC INFO */}
                <div className="card">
                    <h4 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={18} color="var(--color-primary)" /> Basic Profile
                    </h4>
                    <div className="input-group mb-4">
                        <label>Display Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            value={formData.date_of_birth}
                            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        />
                    </div>
                </div>

                {/* HEALTH METRICS */}
                <div className="card">
                    <h4 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Scale size={18} color="var(--color-primary)" /> Health Metrics
                    </h4>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Weight (kg)</label>
                            <input
                                type="number"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                                step="0.1"
                            />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Height (cm)</label>
                            <input
                                type="number"
                                value={formData.height}
                                onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>
                    {bmi && (
                        <div style={{ background: '#F8F8F8', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', color: '#666' }}>Calculated BMI</span>
                            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)' }}>{bmi}</span>
                        </div>
                    )}
                </div>

                {/* CYCLE SETTINGS */}
                <div className="card">
                    <h4 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={18} color="var(--color-primary)" /> Cycle Settings
                    </h4>
                    <div className="input-group mb-4">
                        <label>Average Cycle Length (Days)</label>
                        <input
                            type="number"
                            value={formData.average_cycle_length}
                            onChange={(e) => setFormData({ ...formData, average_cycle_length: parseInt(e.target.value) })}
                            min="20"
                            max="45"
                        />
                    </div>
                    <div className="input-group">
                        <label>Average Period Duration (Days)</label>
                        <input
                            type="number"
                            value={formData.average_period_length}
                            onChange={(e) => setFormData({ ...formData, average_period_length: parseInt(e.target.value) })}
                            min="1"
                            max="14"
                        />
                    </div>
                </div>

                <div style={{ position: 'fixed', bottom: '100px', left: '25px', right: '25px', zIndex: 10 }}>
                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', borderRadius: '16px', height: '56px', boxShadow: '0 10px 25px rgba(255,107,138,0.3)' }}
                    >
                        {loading ? 'Saving...' : saved ? '✨ All Changes Saved' : <><Save size={20} /> Update Profile</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PersonalSettings;
