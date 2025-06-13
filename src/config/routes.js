import Home from '../pages/Home';
import Projects from '../pages/Projects';
import Calendar from '../pages/Calendar';
import Archive from '../pages/Archive';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'All Tasks',
    path: '/',
    icon: 'FileText',
    component: Home
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'Folder',
    component: Projects
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  }
};

export const routeArray = Object.values(routes);