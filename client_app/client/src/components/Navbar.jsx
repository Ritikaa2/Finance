import { Link, useNavigate } from 'react-router-dom';
import { Rocket, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    // Placeholder auth check
    const isAuthenticated = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // 'startup' or 'investor'

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <Rocket className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">SeedX</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                    Dashboard
                                </Link>
                                {userRole === 'investor' && (
                                    <Link to="/browse" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                        Browse Startups
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="ml-4 flex items-center text-gray-500 hover:text-red-500">
                                    <LogOut className="h-5 w-5" />
                                    <span className="ml-1 text-sm">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
