// File: client/src/pages/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { CardSkeleton } from '../components/Skeleton';
import { Search, MapPin, Star, Store, AlertCircle, ThumbsUp } from 'lucide-react';

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
            className="star-rating-star"
            style={{
              fontSize: '24px',
              cursor: 'pointer',
              color: star <= selectedRating ? '#fbbf24' : '#e2dcd5',
            }}
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
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>
            Explore Registered Stores
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Rate your favorite places and share your feedback</p>
        </div>

        {/* Feedback Banners */}
        {error && <div className="error-banner" style={{ marginBottom: '20px' }}>{error}</div>}
        {successMsg && (
          <div className="badge" style={{ width: '100%', padding: '12px', background: 'rgba(5, 150, 105, 0.08)', color: '#047857', border: '1px solid rgba(5, 150, 105, 0.15)', marginBottom: '20px', display: 'block', textAlign: 'center' }}>
            {successMsg}
          </div>
        )}

        {/* Toolbar: Filters, Search & Sort */}
        <div className="glass-panel" style={{ padding: '12px 24px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '2 1 200px' }}>
            <input
              type="text"
              className="form-input"
              style={{ padding: '10px 16px', height: '42px' }}
              placeholder="🔍 Search Store Name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          <div style={{ flex: '2 1 200px' }}>
            <input
              type="text"
              className="form-input"
              style={{ padding: '10px 16px', height: '42px' }}
              placeholder="📍 Search Address..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
            />
          </div>

          <div style={{ flex: '1 1 140px' }}>
            <select
              className="form-input"
              style={{ padding: '10px 36px 10px 16px', height: '42px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort: Name</option>
              <option value="address">Sort: Address</option>
              <option value="rating">Sort: Rating</option>
            </select>
          </div>

          <div style={{ flex: '1 1 140px' }}>
            <select
              className="form-input"
              style={{ padding: '10px 36px 10px 16px', height: '42px' }}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Order: Asc</option>
              <option value="desc">Order: Desc</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchName('');
              setSearchAddress('');
              setSortBy('name');
              setSortOrder('asc');
            }}
            className="btn btn-secondary"
            style={{ padding: '10px 18px', height: '42px', fontSize: '14px', borderRadius: '12px', fontWeight: '700' }}
          >
            Reset
          </button>
        </div>

        {/* Store Catalog Cards Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="glass-panel empty-state">
            <Store className="empty-state-icon" style={{ strokeWidth: 1.2, color: 'var(--text-dim)', marginBottom: '16px' }} />
            <h3>No Stores Found</h3>
            <p style={{ marginTop: '8px' }}>We couldn't find any registered stores matching your search parameters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {stores.map((store) => {
              const hasRated = store.userRating !== null;
              return (
                <div key={store.id} className="glass-panel accented" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <div>
                    {/* Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ padding: '10px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Store size={22} style={{ color: 'var(--accent-pink)' }} />
                      </div>

                      {/* Overall Average Rating Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(254, 243, 199, 0.5)', border: '1px solid rgba(180, 83, 9, 0.15)', color: '#9a3412', padding: '6px 12px', borderRadius: '8px' }}>
                        <span style={{ color: '#fbbf24', fontSize: '15px' }}>★</span>
                        <span style={{ fontSize: '14px', fontWeight: '700' }}>
                          {store.overallRating > 0 ? store.overallRating.toFixed(1) : 'New'}
                        </span>
                      </div>
                    </div>

                    {/* Store Info */}
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-main)' }}>{store.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-start', color: 'var(--text-muted)', fontSize: '14px', minHeight: '42px', marginTop: '8px' }}>
                      <MapPin size={14} style={{ marginRight: '6px', marginTop: '3px', flexShrink: 0, color: 'var(--text-dim)' }} />
                      <p style={{ margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {store.address}
                      </p>
                    </div>
                  </div>

                  {/* Rating Section */}
                  <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(180, 83, 9, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {hasRated ? 'Your submitted rating' : 'Leave your rating'}
                      </span>
                      {hasRated && (
                        <span className="badge" style={{ fontSize: '11px', background: 'rgba(5, 150, 105, 0.08)', color: '#059669', border: '1px solid rgba(5, 150, 105, 0.15)' }}>
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
