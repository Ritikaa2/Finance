import Sidebar from './Sidebar';
import Navbar from './Navbar'; // Reusing existing Navbar for top mobile header if needed, or we can make a new Header

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header could go here */}
                <header className="bg-white shadow-sm z-10 p-4 md:hidden flex justify-between items-center">
                    <span className="font-bold text-lg">SeedX</span>
                    {/* Mobile menu trigger would go here */}
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
