import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from './config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors mr-2"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            
            <div className="flex items-center">
              <ApperIcon name="PenTool" className="text-primary mr-2" size={24} />
              <h1 className="font-display font-bold text-xl text-primary">WriterFlow</h1>
            </div>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <ApperIcon 
                name="Search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" 
                size={16} 
              />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
              <ApperIcon name="Bell" size={20} className="text-surface-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
              <ApperIcon name="Settings" size={20} className="text-surface-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-surface-200 z-40">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg transition-all group ${
                      isActive
                        ? 'bg-accent/10 text-accent border-l-4 border-accent ml-0 pl-2'
                        : 'text-surface-700 hover:bg-surface-100 hover:text-primary'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={18} className="mr-3" />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="p-4 border-t border-surface-200">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                New Task
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-50"
                onClick={closeMobileMenu}
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-xl"
              >
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-surface-200">
                    <div className="flex items-center">
                      <ApperIcon name="PenTool" className="text-primary mr-2" size={24} />
                      <h1 className="font-display font-bold text-xl text-primary">WriterFlow</h1>
                    </div>
                  </div>
                  
                  <nav className="flex-1 px-4 py-6 space-y-2">
                    {routeArray.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 rounded-lg transition-all ${
                            isActive
                              ? 'bg-accent/10 text-accent border-l-4 border-accent ml-0 pl-2'
                              : 'text-surface-700 hover:bg-surface-100 hover:text-primary'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={18} className="mr-3" />
                        <span className="font-medium">{route.label}</span>
                      </NavLink>
                    ))}
                  </nav>

                  <div className="p-4 border-t border-surface-200">
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      New Task
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;