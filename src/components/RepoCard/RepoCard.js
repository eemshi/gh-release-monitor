import React from 'react';
import './styles.scss';

const RepoCard = ({ repo, onSelect, onDelete }) => {
  const { id, owner, name, lastRelease } = repo;

  const handleSelect = () => {
    if (lastRelease) {
      onSelect(repo);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div onClick={handleSelect} className="repo-card">
      <div style={{ flex: 1 }}>
        <span className="name">{name}</span>
        <br />
        <small>{owner}</small>
      </div>
      <div className="release">
        {lastRelease ? (
          <div>
            <span className="tag">{lastRelease.tag_name}</span>
            <br />
            <small>{lastRelease.created_at}</small>
          </div>
        ) : (
          <small>No releases</small>
        )}
      </div>
      <div onClick={handleDelete} className="delete-btn">
        X
      </div>
    </div>
  );
};

export default RepoCard;
