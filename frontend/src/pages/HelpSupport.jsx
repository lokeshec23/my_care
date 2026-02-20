import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle, Mail, MessageSquare, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const HelpSupport = () => {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            q: 'How accurate are the period predictions?',
            a: 'MyCare uses advanced algorithms based on your last 6 cycles. Accuracy improves with every consistent log you provide.'
        },
        {
            q: 'What should I track for better insights?',
            a: 'Logging symptoms like cramps, mood, and flow level helps the app identify patterns unique to your body.'
        },
        {
            q: 'Can I track pregnancy or medical conditions?',
            a: 'MyCare is a lifestyle tracker. While helpful for identifying trends, it is not a medical device. Always consult a professional for health concerns.'
        },
        {
            q: 'Is my data stored on my phone or in the cloud?',
            a: 'Your data is securely stored in our encrypted database so you can access it across devices by logging in.'
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
                <h2 style={{ fontSize: '24px', margin: 0 }}>Help & Support</h2>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <h4 className="mb-4">Common Questions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {faqs.map((f, i) => (
                        <div key={i} style={{ borderBottom: i === faqs.length - 1 ? 'none' : '1px solid #F8F8F8', paddingBottom: '12px' }}>
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none', background: 'none', textAlign: 'left', padding: '12px 0', cursor: 'pointer' }}
                            >
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>{f.q}</span>
                                {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {openFaq === i && (
                                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, margin: '4px 0 8px 0', padding: '0 4px' }}>
                                    {f.a}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <h4 className="mb-4">Contact Us</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#FCE4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                            <Mail size={18} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Email Support</p>
                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-primary)' }}>support@mycare.app</p>
                        </div>
                        <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.2 }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2196F3' }}>
                            <MessageSquare size={18} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Community Forum</p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#2196F3' }}>Join the conversation</p>
                        </div>
                        <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.2 }} />
                    </div>
                </div>
            </div>

            <div className="card text-center" style={{ padding: '24px', opacity: 0.8 }}>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px 0' }}>Experiencing a technical issue?</p>
                <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', display: 'inline-flex' }}>
                    Submit Bug Report <ExternalLink size={14} style={{ marginLeft: '6px' }} />
                </button>
            </div>
        </div>
    );
};

export default HelpSupport;
