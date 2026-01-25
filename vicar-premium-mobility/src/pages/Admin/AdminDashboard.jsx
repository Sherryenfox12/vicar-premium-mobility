import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import AD_Discover from './AD_Discover';
import AD_BannerMedia from './AD_BannerMedia';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('discover');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  
  useEffect(() => {
    // Check if user is authenticated
    const authData = localStorage.getItem('authTokenData');
    if (!authData) {
      navigate('/admin/login');
      return;
    }

    try {
      const { token, user } = JSON.parse(authData);
      if (!token || !user) {
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem('authTokenData');
    navigate('/admin/login');
  };

  const dashboardStats = [
    { title: 'Total Users', value: '1,234', icon: '👥', color: '#d41111' },
    { title: 'Total Cars', value: '567', icon: '🚗', color: '#1a1a1a' },
    { title: 'Active Orders', value: '89', icon: '📋', color: '#d41111' },
    { title: 'Revenue', value: '$45,678', icon: '💰', color: '#1a1a1a' }
  ];

  const quickActions = [
    { title: 'Add New Car', action: () => console.log('Add car'), icon: '➕' },
    { title: 'Manage Users', action: () => console.log('Manage users'), icon: '👥' },
    { title: 'View Orders', action: () => console.log('View orders'), icon: '📋' },
    { title: 'Analytics', action: () => console.log('Analytics'), icon: '📊' }
  ];

  const sidebarItems = [
    // { id: 'home', title: 'Home', icon: '🏠' },
    { id: 'discover', title: 'Discover', icon: '🔍' },
    { id: 'bannerMedia', title: 'Banner Media', icon: '📷' },
    // { id: 'media', title: 'Media', icon: '📷' },
    // { id: 'cars', title: 'Cars', icon: '🚗' },
    // { id: 'setting', title: 'Setting', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      // case 'home':
      //   return (
      //     <>
      //       <section className="stats-section">
      //         <h2>Dashboard Overview</h2>
      //         <div className="stats-grid">
      //           {dashboardStats.map((stat, index) => (
      //             <div key={index} className="stat-card">
      //               <div className="stat-icon" style={{ backgroundColor: stat.color }}>
      //                 {stat.icon}
      //               </div>
      //               <div className="stat-content">
      //                 <h3>{stat.title}</h3>
      //                 <p className="stat-value">{stat.value}</p>
      //               </div>
      //             </div>
      //           ))}
      //         </div>
      //       </section>

      //       <section className="actions-section">
      //         <h2>Quick Actions</h2>
      //         <div className="actions-grid">
      //           {quickActions.map((action, index) => (
      //             <button
      //               key={index}
      //               onClick={action.action}
      //               className="action-btn"
      //             >
      //               <span className="action-icon">{action.icon}</span>
      //               {action.title}
      //             </button>
      //           ))}
      //         </div>
      //       </section>

      //       <section className="recent-section">
      //         <h2>Recent Activity</h2>
      //         <div className="activity-list">
      //           <div className="activity-item">
      //             <span className="activity-time">2 hours ago</span>
      //             <span className="activity-text">New car added: Toyota Alphard 2024</span>
      //           </div>
      //           <div className="activity-item">
      //             <span className="activity-time">4 hours ago</span>
      //             <span className="activity-text">User registration: john.doe@email.com</span>
      //           </div>
      //           <div className="activity-item">
      //             <span className="activity-time">6 hours ago</span>
      //             <span className="activity-text">Order completed: #ORD-2024-001</span>
      //           </div>
      //         </div>
      //       </section>
      //     </>
      //   );
      case 'discover':
        return <AD_Discover />;
      case 'bannerMedia':
        return <AD_BannerMedia />;
      // case 'media':
      //   return (
      //     <section className="content-section">
      //       <h2>Media Management</h2>
      //       <p>Upload, organize, and manage media files including images and videos.</p>
      //     </section>
      //   );
      // case 'cars':
      //   return (
      //     <section className="content-section">
      //       <h2>Car Management</h2>
      //       <p>Add, edit, and manage car listings and inventory.</p>
      //     </section>
      //   );
      // case 'setting':
      //   return (
      //     <section className="content-section">
      //       <h2>Settings</h2>
      //       <p>Configure system settings, user preferences, and admin options.</p>
      //     </section>
      //   );
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>KW99 Admin</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {sidebarOpen && <span className="sidebar-text">{item.title}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? 'with-sidebar' : 'without-sidebar'}`}>
        <header className="content-header">
          <h1>{sidebarItems.find(item => item.id === activeSection)?.title || 'Dashboard'}</h1>
        </header>

        <div className="content-body">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
