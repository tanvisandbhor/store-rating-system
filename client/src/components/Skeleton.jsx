// File: client/src/components/Skeleton.jsx
import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-panel" style={{ padding: '28px', height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div className="skeleton-box" style={{ width: '44px', height: '44px', borderRadius: '10px' }}></div>
        <div className="skeleton-box" style={{ width: '60px', height: '28px', borderRadius: '8px' }}></div>
      </div>
      <div className="skeleton-box" style={{ width: '70%', height: '22px', marginBottom: '12px', borderRadius: '4px' }}></div>
      <div className="skeleton-box" style={{ width: '90%', height: '14px', marginBottom: '6px', borderRadius: '4px' }}></div>
      <div className="skeleton-box" style={{ width: '45%', height: '14px', borderRadius: '4px' }}></div>
    </div>
    <div className="skeleton-box" style={{ width: '100%', height: '36px', borderRadius: '10px', marginTop: '16px' }}></div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px', padding: '8px' }}>
    {Array.from({ length: rows }).map((_, rIdx) => (
      <div key={rIdx} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(180,83,9,0.05)', paddingBottom: '18px' }}>
        {Array.from({ length: cols }).map((_, cIdx) => (
          <div key={cIdx} className="skeleton-box" style={{ flex: 1, height: '20px', borderRadius: '6px' }}></div>
        ))}
      </div>
    ))}
  </div>
);
