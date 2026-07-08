// File: client/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'stores'
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  
  // Lists & Filters
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [userSort, setUserSort] = useState({ sortBy: 'name', sortOrder: 'asc' });
  
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [storeSort, setStoreSort] = useState({ sortBy: 'name', sortOrder: 'asc' });

  // Creation States
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '' });
  
  // Feedback States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Modals & Details
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'stores') {
      fetchStores();
    }
  }, [activeTab, userFilters, userSort, storeFilters, storeSort]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard/stats');
      setStats(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch statistics.');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...userFilters,
        sortBy: userSort.sortBy,
        sortOrder: userSort.sortOrder,
      }).toString();
      
      const res = await api.get(`/admin/users?${queryParams}`);
      setUsers(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load users list.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...storeFilters,
        sortBy: storeSort.sortBy,
        sortOrder: storeSort.sortOrder,
      }).toString();
      
      const res = await api.get(`/admin/stores?${queryParams}`);
      setStores(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load stores list.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSort = (field) => {
    setUserSort((prev) => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleStoreSort = (field) => {
    setStoreSort((prev) => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!newUser.name || newUser.name.length < 20 || newUser.name.length > 60) {
      setError('Name must be between 20 and 60 characters.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newUser.email || !emailRegex.test(newUser.email)) {
      setError('A valid email address is required.');
      return;
    }
    if (!newUser.address || newUser.address.length > 400) {
      setError('Address is required and must not exceed 400 characters.');
      return;
    }
    if (!newUser.password || newUser.password.length < 8 || newUser.password.length > 16) {
      setError('Password must be 8-16 characters.');
      return;
    }
    const hasUppercase = /[A-Z]/.test(newUser.password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newUser.password);
    if (!hasUppercase || !hasSpecial) {
      setError('Password must contain at least one uppercase letter and one special character.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/admin/users', newUser);
      setSuccess('User created successfully!');
      setNewUser({ name: '', email: '', password: '', address: '', role: 'USER' });
      fetchStats();
    } catch (err) {
      setError(err.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newStore.name || !newStore.email || !newStore.address) {
      setError('All store fields are required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: newStore.name,
        email: newStore.email,
        address: newStore.address,
      };
      if (newStore.ownerId) {
        payload.ownerId = parseInt(newStore.ownerId, 10);
      }

      await api.post('/admin/stores', payload);
      setSuccess('Store registered successfully!');
      setNewStore({ name: '', email: '', address: '', ownerId: '' });
      fetchStats();
    } catch (err) {
      setError(err.message || 'Failed to create store.');
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetails = async (userId) => {
    setUserDetailLoading(true);
    setSelectedUser(null);
    try {
      const res = await api.get(`/admin/users/${userId}`);
      setSelectedUser(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch user details.');
    } finally {
      setUserDetailLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em' }}>Admin Console</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage platform users, stores, and ratings</p>
          </div>

          {/* Tabs Navigation */}
          <div className="glass-panel" style={{ display: 'flex', padding: '6px', gap: '4px', borderRadius: '12px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              className="btn"
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: activeTab === 'overview' ? 'var(--primary-gradient)' : 'transparent',
                color: activeTab === 'overview' ? 'white' : 'var(--text-muted)',
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className="btn"
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: activeTab === 'users' ? 'var(--primary-gradient)' : 'transparent',
                color: activeTab === 'users' ? 'white' : 'var(--text-muted)',
              }}
            >
              Users List
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className="btn"
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: activeTab === 'stores' ? 'var(--primary-gradient)' : 'transparent',
                color: activeTab === 'stores' ? 'white' : 'var(--text-muted)',
              }}
            >
              Stores List
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {error && <div className="error-banner" style={{ marginBottom: '24px' }}>{error}</div>}
        {success && (
          <div className="badge" style={{ width: '100%', padding: '12px', background: 'rgba(5, 150, 105, 0.08)', color: '#047857', border: '1px solid rgba(5, 150, 105, 0.15)', marginBottom: '24px', display: 'block', textAlign: 'center' }}>
            {success}
          </div>
        )}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              <div className="glass-panel float-card-1" style={{ padding: '24px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Total Registered Users</span>
                <h3 style={{ fontSize: '48px', fontWeight: '800', margin: '8px 0 0', background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.users}</h3>
              </div>
              <div className="glass-panel float-card-2" style={{ padding: '24px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Total Registered Stores</span>
                <h3 style={{ fontSize: '48px', fontWeight: '800', margin: '8px 0 0', background: 'linear-gradient(135deg, #d97706 0%, #eab308 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.stores}</h3>
              </div>
              <div className="glass-panel float-card-3" style={{ padding: '24px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Total Ratings Submitted</span>
                <h3 style={{ fontSize: '48px', fontWeight: '800', margin: '8px 0 0', background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.ratings}</h3>
              </div>
            </div>

            {/* Split forms panels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '32px' }}>
              {/* Add User form */}
              <div className="glass-panel" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Register New User</h3>
                <form onSubmit={handleCreateUser}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Min 20 - Max 60 characters"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="email@example.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <select
                        className="form-input"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      >
                        <option value="USER">Normal User</option>
                        <option value="ADMIN">System Administrator</option>
                        <option value="OWNER">Store Owner</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="8-16 chars, 1 uppercase, 1 special"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Max 400 characters"
                      value={newUser.address}
                      onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create User Account</button>
                </form>
              </div>

              {/* Add Store form */}
              <div className="glass-panel" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Register New Store</h3>
                <form onSubmit={handleCreateStore}>
                  <div className="form-group">
                    <label className="form-label">Store Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Store brand name"
                      value={newStore.name}
                      onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="store@example.com"
                      value={newStore.email}
                      onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Store Owner ID (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter integer user ID of Store Owner"
                      value={newStore.ownerId}
                      onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">Physical Address</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Store address (Max 400 characters)"
                      value={newStore.address}
                      onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register Store</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users List */}
        {activeTab === 'users' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            {/* Filters panel */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Filter by Name"
                value={userFilters.name}
                onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Filter by Email"
                value={userFilters.email}
                onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Filter by Address"
                value={userFilters.address}
                onChange={(e) => setUserFilters({ ...userFilters, address: e.target.value })}
              />
              <select
                className="form-input"
                value={userFilters.role}
                onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
              >
                <option value="">All Roles</option>
                <option value="ADMIN">System Administrator</option>
                <option value="USER">Normal User</option>
                <option value="OWNER">Store Owner</option>
              </select>
            </div>

            {loading ? (
              <div className="spinner"></div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <p>No registered users found matching the filter criteria.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleUserSort('name')}>Name {userSort.sortBy === 'name' && (userSort.sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th onClick={() => handleUserSort('email')}>Email {userSort.sortBy === 'email' && (userSort.sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th onClick={() => handleUserSort('address')}>Address {userSort.sortBy === 'address' && (userSort.sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th onClick={() => handleUserSort('role')}>Role {userSort.sortBy === 'role' && (userSort.sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address}</td>
                        <td>
                          <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : u.role === 'OWNER' ? 'badge-owner' : 'badge-user'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => viewUserDetails(u.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Stores List */}
        {activeTab === 'stores' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            {/* Filters panel */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Filter by Store Name"
                value={storeFilters.name}
                onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Filter by Contact Email"
                value={storeFilters.email}
                onChange={(e) => setStoreFilters({ ...storeFilters, email: e.target.value })}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Filter by Address"
                value={storeFilters.address}
                onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })}
              />
            </div>

            {loading ? (
              <div className="spinner"></div>
            ) : stores.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏪</div>
                <p>No registered stores found matching the filter criteria.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleStoreSort('name')}>Store Name {storeSort.sortBy === 'name' && (storeSort.sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th onClick={() => handleStoreSort('email')}>Contact Email {storeSort.sortBy === 'email' && (storeSort.sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th onClick={() => handleStoreSort('address')}>Address {storeSort.sortBy === 'address' && (storeSort.sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th onClick={() => handleStoreSort('rating')}>Average Rating {storeSort.sortBy === 'rating' && (storeSort.sortOrder === 'asc' ? '▲' : '▼')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map((s) => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: '600' }}>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{s.address}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
                            <span style={{ fontWeight: '600' }}>{s.rating > 0 ? s.rating.toFixed(1) : 'New'}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {(selectedUser || userDetailLoading) && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(43, 37, 32, 0.25)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-main)' }}>User Details Profile</h3>
            
            {userDetailLoading ? (
              <div className="spinner"></div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Database User ID</span>
                    <p style={{ fontSize: '16px', fontWeight: '600', marginTop: '2px' }}>{selectedUser.id}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Name</span>
                    <p style={{ fontSize: '16px', fontWeight: '600', marginTop: '2px' }}>{selectedUser.name}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</span>
                    <p style={{ fontSize: '16px', fontWeight: '600', marginTop: '2px' }}>{selectedUser.email}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Physical Address</span>
                    <p style={{ fontSize: '15px', marginTop: '2px', color: 'var(--text-main)' }}>{selectedUser.address}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role Privilege</span>
                    <div style={{ marginTop: '4px' }}>
                      <span className={`badge ${selectedUser.role === 'ADMIN' ? 'badge-admin' : selectedUser.role === 'OWNER' ? 'badge-owner' : 'badge-user'}`}>
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>

                  {/* Store Owner specific rating link */}
                  {selectedUser.role === 'OWNER' && (
                    <div style={{ padding: '16px', background: 'rgba(254, 243, 199, 0.25)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#f59e0b', textTransform: 'uppercase' }}>Owned Store Rating Linkage</span>
                      {selectedUser.storeId ? (
                        <div style={{ marginTop: '8px' }}>
                          <p style={{ fontSize: '15px', fontWeight: '600' }}>{selectedUser.storeName}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <span style={{ color: '#fbbf24', fontSize: '16px' }}>★</span>
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.rating > 0 ? selectedUser.rating.toFixed(1) : 'New'} (Average Rating)</span>
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px', italic: 'true' }}>No store assigned to this owner yet.</p>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setSelectedUser(null)} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                    Close Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
