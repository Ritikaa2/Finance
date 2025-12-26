import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BarChart2,
    Wallet,
    MessageSquare,
    User,
    CreditCard,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: BarChart2, label: 'Analytics', path: '/analytics' },
        { icon: Wallet, label: 'Investments', path: '/investments' },
        { icon: MessageSquare, label: 'Messages', path: '/messages' },
        { icon: CreditCard, label: 'Membership', path: '/membership' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col hidden md:flex">
            <div className="p-4 items-center flex justify-center border-b border-gray-800">
                <Link to="/" className="transform hover:scale-105 transition-transform duration-200">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer">
                        SeedX
                    </h1>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
