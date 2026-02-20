import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, User } from 'lucide-react';

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        age: '',
        height: '',
        weight: '',
        average_cycle_length: 28,
        average_period_length: 5
    });
    const [loading, setLoading] = useState(false);
    const { updateProfile } = useAuth();
    const navigate = useNavigate();

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setLoading(true);
        const result = await updateProfile({
            age: parseInt(formData.age),
            height: parseFloat(formData.height),
            weight: parseFloat(formData.weight),
            average_cycle_length: parseInt(formData.average_cycle_length),
            average_period_length: parseInt(formData.average_period_length)
        });

        if (result.success) {
            navigate('/dashboard');
        } else {
            alert(result.message);
        }
        setLoading(false);
    };

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="auth-page" style={{ justifyContent: 'center', minHeight: '100vh' }}>
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="auth-form"
                    >
                        <div className="auth-header">
                            <User className="auth-logo" size={40} />
                            <h2>Tell us about yourself</h2>
                            <p className="text-muted">This helps us personalize your health insights.</p>
                        </div>

                        <div className="input-group">
                            <label>How old are you?</label>
                            <input
                                type="number"
                                placeholder="Age"
                                value={formData.age}
                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Height (cm)</label>
                            <input
                                type="number"
                                placeholder="e.g. 165"
                                value={formData.height}
                                onChange={e => setFormData({ ...formData, height: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Weight (kg)</label>
                            <input
                                type="number"
                                placeholder="e.g. 55"
                                value={formData.weight}
                                onChange={e => setFormData({ ...formData, weight: e.target.value })}
                            />
                        </div>

                        <button className="btn btn-primary" onClick={handleNext} disabled={!formData.age || !formData.height || !formData.weight}>
                            Next <ArrowRight size={18} />
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="auth-form"
                    >
                        <div className="auth-header">
                            <Heart className="auth-logo" size={40} />
                            <h2>Your Cycle</h2>
                            <p className="text-muted">Typical duration of your period and cycle.</p>
                        </div>

                        <div className="input-group">
                            <label>Average Cycle Length (days)</label>
                            <input
                                type="number"
                                value={formData.average_cycle_length}
                                onChange={e => setFormData({ ...formData, average_cycle_length: e.target.value })}
                            />
                            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Gap between the start of one period and the next.</p>
                        </div>

                        <div className="input-group">
                            <label>Typical Period Duration (days)</label>
                            <input
                                type="number"
                                value={formData.average_period_length}
                                onChange={e => setFormData({ ...formData, average_period_length: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleBack}>Back</button>
                            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Saving...' : 'Finish Setup'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Onboarding;
