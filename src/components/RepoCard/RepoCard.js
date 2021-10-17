import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getFormattedDate } from '../../utils/helpers';
import deleteIcon from '../../icons/delete.svg';
import downArrow from '../../icons/down-arrow.svg';
import upArrow from '../../icons/up-arrow.svg';
import './styles.scss';

const RepoCard = ({ repo, onDelete, toggleRead }) => {
  const [focused, setFocused] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(repo.id);
  };

  const handleToggleRead = (e, repo) => {
    e.stopPropagation();
    toggleRead(repo);
    if (focused) {
      setFocused(false);
    }
  };

  return (
    <div onClick={() => setFocused(!focused)} className={getContainerClasses(repo)}>
      <Header repo={repo} focused={focused} onDelete={handleDelete} />
      {focused && <ReleaseNotes repo={repo} onToggleRead={handleToggleRead} />}
    </div>
  );
};

export default RepoCard;

const getContainerClasses = ({ lastRelease, read }) => {
  let classes = 'repo-card';
  if (!lastRelease) {
    classes += ' unreleased';
  }
  if (!read) {
    classes += ' unread';
  }
  return classes;
};

const Header = ({ repo, focused, onDelete }) => {
  const { owner, name, lastRelease, isNew, read, error } = repo;
  return (
    <div className="header">
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
              {isNew && !read && <div className="label-new">New! </div>}
            </div>
            <small>
              {getFormattedDate(lastRelease.published_at)}{' '}
              {error && <span className="error">(update failed)</span>}
            </small>
          </>
        ) : (
          <small>No releases yet</small>
        )}
      </div>
      <div role="button" onClick={onDelete} className="delete-btn">
        <img src={deleteIcon} width={20} alt="Delete" />
      </div>
      {lastRelease && (
        <div className="read-indicator">
          <ReadIndicator repo={repo} focused={focused} />
        </div>
      )}
    </div>
  );
};

const ReadIndicator = ({ repo, focused }) => {
  if (focused) {
    return <img src={upArrow} width={20} />;
  }
  if (repo.read) {
    return <small>✓ Read</small>;
  }
  return <img src={downArrow} width={20} />;
};

const ReleaseNotes = ({ repo, onToggleRead }) => {
  if (!repo.lastRelease) {
    return (
      <div className="release-notes">
        <a href={repo.url} onClick={(e) => e.stopPropagation()}>
          Go to repo
        </a>
      </div>
    );
  }
  return (
    <div className="release-notes">
      <div className="read-toggle-container">
        <span
          role="button"
          onClick={(e) => onToggleRead(e, repo)}
          className="read-toggle"
        >
          {repo.read ? 'Mark unread' : 'Mark as read'}
        </span>
      </div>
      {repo.lastRelease?.body ? (
        <ReactMarkdown>{repo.lastRelease.body}</ReactMarkdown>
      ) : (
        'No release notes. '
      )}
      <a href={repo.lastRelease.html_url} onClick={(e) => e.stopPropagation()}>
        View release
      </a>
    </div>
  );
};
