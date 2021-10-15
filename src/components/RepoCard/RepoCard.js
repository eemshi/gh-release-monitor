import React from 'react';
import { getFormattedDate } from '../../utils';
import './styles.scss';

const RepoCard = ({ repo, onSelect, onDelete }) => {
  const { id, owner, name, lastRelease, isNew } = repo;

  const handleSelect = () => {
    if (lastRelease) {
      onSelect(repo);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(id);
  };

  let cardClasses = 'repo-card';
  if (!repo.lastRelease) {
    cardClasses += ' disabled';
  } else if (!repo.read) {
    cardClasses += ' unread';
  }

  return (
    <div onClick={handleSelect} className={cardClasses}>
      <div style={{ flex: 1 }}>
        <span className="name">{name}</span>
        <br />
        <small>{owner}</small>
      </div>
      <div className="release-info">
        {lastRelease ? (
          <>
            <div className="tag-container">
              <div className="tag">{lastRelease.tag_name}</div>
              {isNew && <div className="label">New!</div>}
            </div>
            <div>
              <small>{getFormattedDate(lastRelease.created_at)}</small>
            </div>
          </>
        ) : (
          <small>No releases yet</small>
        )}
      </div>
      <div onClick={handleDelete} className="delete-btn">
        X
      </div>
    </div>
  );
};

export default RepoCard;
