import React from 'react';
import { getFormattedDate } from '../../utils';
import closeIcon from '../../icons/close.svg';
import './styles.scss';

const RepoCard = ({ repo, focused, onSelect, onDelete }) => {
  const { id, owner, name, lastRelease, isNew, read } = repo;

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
  } else if (focused) {
    cardClasses += ' focused';
  }

  return (
    <div role="button" onClick={handleSelect} className={cardClasses}>
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
              {isNew && !read && <div className="label">New!</div>}
            </div>
            <div>
              <small>{getFormattedDate(lastRelease.created_at)}</small>
            </div>
          </>
        ) : (
          <small>No releases yet</small>
        )}
      </div>
      <div role="button" onClick={handleDelete} className="delete-btn">
        <img src={closeIcon} width={20} alt="Close" />
      </div>
      {lastRelease && read && <small className="unread">Read ✓</small>}
    </div>
  );
};

export default RepoCard;
