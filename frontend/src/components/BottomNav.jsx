import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, PlusCircle, BarChart2, User } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { icon: <Home size={22} />, label: 'Home', path: '/dashboard' },
        { icon: <Calendar size={22} />, label: 'Calendar', path: '/calendar' },
        { icon: <PlusCircle size={32} strokeWidth={2.5} style={{ color: 'var(--color-primary)' }} />, label: '', path: '/log' },
        { icon: <BarChart2 size={22} />, label: 'Insights', path: '/insights' },
        { icon: <User size={22} />, label: 'Profile', path: '/profile' }
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item, index) => (
                <Link
                    key={index}
                    to={item.path}
                    className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                    {item.icon}
                    {item.label && <span>{item.label}</span>}
                </Link>
            ))}
        </nav>
    );
};

export default BottomNav;
