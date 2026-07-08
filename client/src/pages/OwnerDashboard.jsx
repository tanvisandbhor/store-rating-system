// File: client/src/pages/OwnerDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import CountUp from '../components/CountUp';
import { TableSkeleton } from '../components/Skeleton';
import { Store, Star, FileText, ArrowUpDown, ShieldAlert, Sparkles } from 'lucide-react';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, [sortBy, sortOrder]);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams({
        sortBy,
        sortOrder,
      }).toString();
      
      const res = await api.get(`/owner/dashboard?${queryParams}`);
      setDashboardData(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load owner dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder((prev) => (sortBy === field && prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Error State if owner has no store */}
        {error && (
          <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <ShieldAlert size={48} style={{ color: 'var(--danger)' }} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Access Restricted</h2>
            <div className="error-banner" style={{ display: 'inline-flex', width: 'auto', justifyContent: 'center', alignItems: 'center' }}>
              <ShieldAlert size={16} />
              {error}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '16px' }}>
              Please contact the System Administrator to register and assign a store to your account.
            </p>
          </div>
        )}

        {loading && !dashboardData && (
          <TableSkeleton rows={5} cols={4} />
        )}

        {dashboardData && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <span className="badge badge-owner" style={{ marginBottom: '8px' }}>Store Owner Console</span>
              <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em' }}>{dashboardData.storeName}</h1>
              <p style={{ color: 'var(--text-muted)' }}>Store ID: #{dashboardData.storeId} • Real-time customer feedback</p>
            </div>

            {/* Metrics cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              <div className="glass-panel accented" style={{ padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Overall Store Rating</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ color: '#fbbf24', fontSize: '28px' }}>★</span>
                    <h3 style={{ fontSize: '42px', fontWeight: '800', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
                      {dashboardData.averageRating > 0 ? dashboardData.averageRating.toFixed(1) : 'New'}
                    </h3>
                  </div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(217, 119, 6, 0.08)', borderRadius: '14px', color: '#d97706' }}>
                  <Star size={24} />
                </div>
              </div>

              <div className="glass-panel accented" style={{ padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Total Reviews Submitted</span>
                  <h3 style={{ fontSize: '42px', fontWeight: '800', margin: '4px 0 0', background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
                    <CountUp to={dashboardData.totalReviews} />
                  </h3>
                </div>
                <div style={{ padding: '12px', background: 'rgba(249, 115, 22, 0.08)', borderRadius: '14px', color: '#ea580c' }}>
                  <FileText size={24} />
                </div>
              </div>
            </div>

            {/* Customer Ratings Table */}
            <div className="glass-panel" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>Customer Feedback & Reviews</h2>
              
              {dashboardData.reviews.length === 0 ? (
                <div className="empty-state">
                  <FileText className="empty-state-icon" style={{ strokeWidth: 1.2, color: 'var(--text-dim)', marginBottom: '16px' }} />
                  <h3>No Reviews Yet</h3>
                  <p style={{ marginTop: '8px' }}>Customers haven't submitted any ratings for your store yet.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('name')}>Customer Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                        <th onClick={() => handleSort('email')}>Customer Email {sortBy === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                        <th>Address</th>
                        <th onClick={() => handleSort('rating')}>Rating Score {sortBy === 'rating' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.reviews.map((review) => (
                        <tr key={review.userId}>
                          <td style={{ fontWeight: '600' }}>{review.name}</td>
                          <td>{review.email}</td>
                          <td style={{ color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {review.address}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ color: '#fbbf24', fontSize: '16px' }}>★</span>
                              <span style={{ fontWeight: '700' }}>{review.rating}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
