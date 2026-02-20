import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, Lock, Eye, Download, Trash2, FileText } from 'lucide-react';

const PrivacySettings = () => {
    const navigate = useNavigate();

    const policies = [
        {
            icon: <Lock size={20} color="#4CAF50" />,
            title: 'End-to-End Encryption',
            desc: 'Your health data is encrypted before being stored. Only you have access to your intimate logs.'
        },
        {
            icon: <Eye size={20} color="#2196F3" />,
            title: 'No Data Selling',
            desc: 'We never sell your personal or health information to third-party advertisers or insurance companies.'
        },
        {
            icon: <Shield size={20} color="#FF9800" />,
            title: 'Anonymized Analytics',
            desc: 'Research data is fully de-identified and used only to improve our cycle prediction algorithms.'
        }
    ];

    return (
        <div className="dashboard-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: '#F5F5F5', border: 'none', color: '#555', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <ChevronLeft size={24} />
                </button>
                <h2 style={{ fontSize: '24px', margin: 0 }}>Privacy & Security</h2>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #F1F8E9 0%, #FFFFFF 100%)', border: '1px solid #C8E6C9', padding: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <Shield size={32} color="#2E7D32" />
                    <div>
                        <h4 style={{ margin: '0 0 8px 0', color: '#1B5E20' }}>Your privacy is our priority</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#388E3C', opacity: 0.9 }}>
                            MyCare is designed with high-grade security to ensure your most personal information stays private.
                        </p>
                    </div>
                </div>
            </div>

            <div className="card">
                <h4 className="mb-4">Data Policies</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {policies.map((p, i) => (
                        <div key={i} style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ marginTop: '2px' }}>{p.icon}</div>
                            <div>
                                <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700 }}>{p.title}</h5>
                                <p style={{ margin: 0, fontSize: '12px', color: '#777', lineHeight: 1.4 }}>{p.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card" style={{ padding: '8px 0' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', padding: '16px 20px', border: 'none', background: 'none', borderBottom: '1px solid #F8F8F8', cursor: 'pointer' }}>
                    <FileText size={18} color="#666" />
                    <span style={{ flex: 1, textAlign: 'left', fontSize: '14px', fontWeight: 500 }}>Full Privacy Policy</span>
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', padding: '16px 20px', border: 'none', background: 'none', borderBottom: '1px solid #F8F8F8', cursor: 'pointer' }}>
                    <Download size={18} color="#666" />
                    <span style={{ flex: 1, textAlign: 'left', fontSize: '14px', fontWeight: 500 }}>Export My Health Data</span>
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', padding: '16px 20px', border: 'none', background: 'none', cursor: 'pointer', color: '#D64545' }}>
                    <Trash2 size={18} />
                    <span style={{ flex: 1, textAlign: 'left', fontSize: '14px', fontWeight: 500 }}>Delete Account & Data</span>
                </button>
            </div>
        </div>
    );
};

export default PrivacySettings;
