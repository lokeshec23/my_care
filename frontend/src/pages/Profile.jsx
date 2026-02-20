import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Settings as SettingsIcon, Shield, Bell, HelpCircle, ChevronRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user, logout } = useAuth();

    const sections = [
        { icon: <User size={20} />, label: 'Personal Information', path: '/profile/personal', color: '#FF6B8A' },
        { icon: <Bell size={20} />, label: 'Notifications & Reminders', path: '/reminders', color: '#7D95FF' },
        { icon: <Shield size={20} />, label: 'Privacy & Security', path: '/profile/privacy', color: '#4CAF50' },
        { icon: <HelpCircle size={20} />, label: 'Help & Support', path: '/profile/help', color: '#FF9800' },
    ];

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

    return (
        <div className="dashboard-content" style={{ padding: '24px 20px 120px', background: 'linear-gradient(180deg, #FBF8F9 0%, #FFFFFF 100%)', minHeight: '100vh' }}>
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '32px' }}
            >
                <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>Settings</h2>
                <p className="text-muted" style={{ fontSize: '14px' }}>Manage your account and preferences</p>
            </motion.header>

            {/* USER PROFILE CARD */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card"
                style={{
                    padding: '32px 20px',
                    borderRadius: '28px',
                    textAlign: 'center',
                    border: '1px solid #FFF',
                    boxShadow: '0 20px 40px rgba(255,107,138,0.1)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    marginBottom: '32px'
                }}
            >
                <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px' }}>
                    <div
                        style={{
                            width: '100%', height: '100%', borderRadius: '40px',
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, #FF85A2 100%)',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '40px', fontWeight: 800, boxShadow: '0 10px 25px rgba(255,107,138,0.3)'
                        }}
                    >
                        {user?.name?.[0].toUpperCase()}
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'white', padding: '6px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        <Heart size={16} fill="var(--color-primary)" color="var(--color-primary)" />
                    </div>
                </div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: 800 }}>{user?.name}</h3>
                <p className="text-muted" style={{ fontSize: '14px', margin: 0, fontWeight: 500 }}>{user?.email}</p>
            </motion.div>

            {/* NAVIGATION SECTIONS */}
            <motion.div
                variants={containerVariants} initial="hidden" animate="show"
                className="card"
                style={{ padding: '8px', borderRadius: '24px', border: '1px solid #FFF', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(5px)', marginBottom: '32px' }}
            >
                {sections.map((item, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <Link
                            to={item.path}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px',
                                borderBottom: i === sections.length - 1 ? 'none' : '1px solid #F8F8F8',
                                cursor: 'pointer', textDecoration: 'none', color: 'inherit',
                                transition: 'background 0.2s ease', borderRadius: '16px'
                            }}
                            className="profile-link"
                        >
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px', background: `${item.color}11`,
                                color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {item.icon}
                            </div>
                            <span style={{ fontWeight: 700, flex: 1, fontSize: '15px' }}>{item.label}</span>
                            <ChevronRight size={18} color="#DDD" />
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={logout}
                style={{
                    width: '100%', padding: '16px', borderRadius: '20px', border: '1px solid #FFEBEB',
                    background: '#FFF5F5', color: '#D64545', fontWeight: 700, fontSize: '15px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    cursor: 'pointer', marginBottom: '32px'
                }}
            >
                <LogOut size={20} /> Sign Out of MyCare
            </motion.button>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="text-center"
                style={{ fontSize: '12px', fontWeight: 600, color: '#999' }}
            >
                <p style={{ margin: 0 }}>Designed with 💖 for your wellness</p>
                <p style={{ margin: '4px 0 0 0' }}>v1.2.0 • Build 2026.02</p>
            </motion.div>
        </div>
    );
};

export default Profile;
