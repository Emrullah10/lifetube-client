import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiTrendingUp, FiVideo, FiFolder } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { icon: FiHome, label: 'Home', path: '/' },
    { icon: FiTrendingUp, label: 'Trending', path: '/trending' },
    { icon: FiVideo, label: 'Subscriptions', path: '/subscriptions' },
    { icon: FiFolder, label: 'Library', path: '/library' }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
