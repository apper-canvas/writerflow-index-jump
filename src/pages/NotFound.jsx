import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-8 shadow-sm"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-6"
          >
            <ApperIcon name="FileQuestion" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          
          <h1 className="text-4xl font-display font-bold text-primary mb-2">404</h1>
          <h2 className="text-xl font-medium text-surface-900 mb-4">Page Not Found</h2>
          <p className="text-surface-600 mb-6">
            The writing task you're looking for seems to have disappeared. Let's get you back on track.
          </p>
          
          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
            >
              <ApperIcon name="Home" size={16} className="inline mr-2" />
              Back to Tasks
            </Link>
            
            <Link
              to="/projects"
              className="block w-full px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
            >
              <ApperIcon name="Folder" size={16} className="inline mr-2" />
              View Projects
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;