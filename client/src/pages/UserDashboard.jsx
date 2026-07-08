// File: client/src/pages/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Rating input state mapped by storeId: { [storeId]: ratingValue }
  const [userInputs, setUserInputs] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchStores();
  }, [searchName, searchAddress, sortBy, sortOrder]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        name: searchName,
        address: searchAddress,
        sortBy,
        sortOrder,
      }).toString();

      const res = await api.get(`/stores?${queryParams}`);
      const storesList = res.data.data;
      setStores(storesList);

      // Pre-populate userInputs state with already submitted ratings
      const inputs = {};
      storesList.forEach((store) => {
        if (store.userRating !== null) {
          inputs[store.id] = store.userRating;
        }
      });
      setUserInputs(inputs);
    } catch (err) {
      setError(err.message || 'Failed to load stores.');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (storeId, ratingValue) => {
    setUserInputs((prev) => ({
      ...prev,
      [storeId]: ratingValue,
    }));
  };

  const handleSubmitRating = async (storeId) => {
    const rating = userInputs[storeId];
    if (!rating) {
      setError('Please select a rating value first.');
      return;
    }

    setError('');
    setSuccessMsg('');
    try {
      await api.post('/ratings', { storeId, rating });
      setSuccessMsg('Rating submitted successfully!');
      fetchStores(); // Refresh to update average ratings
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit rating.');
    }
  };

  // Interactive 1-5 Star Component
  const StarRatingSelector = ({ storeId, currentRating }) => {
    const selectedRating = userInputs[storeId] || 0;
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleStarClick(storeId, star)}
            style={{
              fontSize: '24px',
              cursor: 'pointer',
              color: star <= selectedRating ? '#fbbf24' : '#374151',
              transition: 'transform 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.2)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            Explore Registered Stores
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Rate your favorite places and share your feedback</p>
        </div>

        {/* Feedback Banners */}
        {error && <div className="error-banner" style={{ marginBottom: '24px' }}>{error}</div>}
        {successMsg && (
          <div className="badge badge-user" style={{ width: '100%', padding: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', marginBottom: '24px', display: 'block', textAlign: 'center' }}>
            {successMsg}
          </div>
        )}

        {/* Toolbar: Filters, Search & Sort */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search by Store Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Central Store"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search by Address</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Silicon Valley"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Sort Column</label>
            <select className="form-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Store Name</option>
              <option value="address">Address</option>
              <option value="rating">Overall Rating</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Sort Order</label>
            <select className="form-input" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Ascending (A-Z / 1-5)</option>
              <option value="desc">Descending (Z-A / 5-1)</option>
            </select>
          </div>
        </div>

        {/* Store Catalog Cards Grid */}
        {loading ? (
          <div className="spinner" style={{ marginTop: '48px' }}></div>
        ) : stores.length === 0 ? (
          <div className="glass-panel empty-state">
            <div className="empty-state-icon">🏪</div>
            <h3>No Stores Found</h3>
            <p style={{ marginTop: '8px' }}>We couldn't find any registered stores matching your search parameters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {stores.map((store) => {
              const hasRated = store.userRating !== null;
              return (
                <div key={store.id} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <div>
                    {/* Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '24px' }}>🏪</span>
                      </div>

                      {/* Overall Average Rating Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(8, 12, 28, 0.5)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                        <span style={{ color: '#fbbf24', fontSize: '15px' }}>★</span>
                        <span style={{ fontSize: '14px', fontWeight: '700' }}>
                          {store.overallRating > 0 ? store.overallRating.toFixed(1) : 'New'}
                        </span>
                      </div>
                    </div>

                    {/* Store Info */}
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>{store.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', minHeight: '42px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {store.address}
                    </p>
                  </div>

                  {/* Rating Section */}
                  <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {hasRated ? 'Your submitted rating' : 'Leave your rating'}
                      </span>
                      {hasRated && (
                        <span className="badge badge-user" style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
                          Rated: {store.userRating} ★
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                      <StarRatingSelector storeId={store.id} />
                      <button
                        onClick={() => handleSubmitRating(store.id)}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
                      >
                        {hasRated ? 'Update' : 'Submit'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
