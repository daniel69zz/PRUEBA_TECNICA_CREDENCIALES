import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const renderCardSkeleton = () => (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-text skeleton-title"></div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-text"></div>
        <div className="skeleton-text skeleton-short"></div>
      </div>
      <div className="skeleton-actions">
        <div className="skeleton-button"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );

  const renderFormSkeleton = () => (
    <div className="skeleton-form">
      <div className="skeleton-form-group">
        <div className="skeleton-label"></div>
        <div className="skeleton-input"></div>
      </div>
      <div className="skeleton-form-group">
        <div className="skeleton-label"></div>
        <div className="skeleton-input"></div>
      </div>
      <div className="skeleton-form-group">
        <div className="skeleton-label"></div>
        <div className="skeleton-input"></div>
      </div>
      <div className="skeleton-button-group">
        <div className="skeleton-button skeleton-large"></div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-item">
          <div className="skeleton-icon"></div>
          <div className="skeleton-text skeleton-title"></div>
          <div className="skeleton-text skeleton-short"></div>
        </div>
      ))}
    </div>
  );

  const skeletons = [];
  for (let i = 0; i < count; i++) {
    if (type === 'card') {
      skeletons.push(renderCardSkeleton());
    } else if (type === 'form') {
      skeletons.push(renderFormSkeleton());
    } else if (type === 'list') {
      return renderListSkeleton();
    }
  }

  return (
    <div className="skeleton-container">
      {skeletons.map((skeleton, index) => (
        <div key={index}>{skeleton}</div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
