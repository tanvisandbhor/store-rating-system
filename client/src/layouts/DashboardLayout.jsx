// File: client/src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user, logout, changePassword } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setModalError('All password fields are required.');
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 16) {
      setModalError('New password must be between 8 and 16 characters.');
      return;
    }
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    if (!hasUppercase || !hasSpecial) {
      setModalError('New password must include at least one uppercase letter and one special character.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setModalError('New passwords do not match.');
      return;
    }

    setModalLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setModalSuccess('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setModalSuccess('');
      }, 1500);
    } catch (err) {
      setModalError(err.message || 'Failed to update password.');
    } finally {
      setModalLoading(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    if (role === 'ADMIN') return 'badge-admin';
    if (role === 'OWNER') return 'badge-owner';
    return 'badge-user';
  };

  const getRoleLabel = (role) => {
    if (role === 'ADMIN') return 'System Administrator';
    if (role === 'OWNER') return 'Store Owner';
    return 'User';
  };

  return (
    <div>
      {/* Top Navbar */}
      <nav style={{ background: 'rgba(10, 15, 30, 0.8)', borderBottom: '1px solid var(--border-glass)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-gradient)' }}></div>
            <span style={{ fontSize: '20px', fontWeight: '800', trackingTight: '-0.02em' }}>
              Rate<span style={{ color: '#6366f1' }}>Sphere</span>
            </span>
          </div>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.name}</span>
                <span className={`badge ${getRoleBadgeClass(user.role)}`} style={{ marginTop: '4px' }}>
                  {getRoleLabel(user.role)}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {user.role !== 'ADMIN' && (
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="btn btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                  >
                    Change Password
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="btn btn-danger"
                  style={{ padding: '8px 14px', fontSize: '13px' }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container animate-fade-in" style={{ padding: '32px 24px' }}>
        {children}
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '32px', position: 'relative' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Change Password</h3>
            
            {modalError && <div className="error-banner">{modalError}</div>}
            {modalSuccess && <div className="badge badge-user" style={{ width: '100%', padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#a7f3d0', marginBottom: '16px', display: 'block', textAlign: 'center' }}>{modalSuccess}</div>}

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  disabled={modalLoading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="8-16 chars, 1 uppercase, 1 special"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={modalLoading}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '28px' }}>
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={modalLoading}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn btn-secondary"
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={modalLoading}>
                  {modalLoading ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
