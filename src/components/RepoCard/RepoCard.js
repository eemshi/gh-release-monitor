import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getFormattedDate } from '../../utils';
import closeIcon from '../../icons/close.svg';
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

  let cardClasses = 'repo-card';
  if (!repo.lastRelease) {
    cardClasses += ' unreleased';
  }

  return (
    <div role="button" onClick={() => setFocused(!focused)} className={cardClasses}>
      {focused ? (
        <Expanded repo={repo} onToggleRead={handleToggleRead} />
      ) : (
        <Collapsed repo={repo} handleDelete={handleDelete} />
      )}
    </div>
  );
};

export default RepoCard;

const Collapsed = ({ repo, handleDelete }) => {
  const { owner, name, lastRelease, isNew, read } = repo;
  return (
    <>
      <div className="thumbnail">
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
    </>
  );
};

const Expanded = ({ repo, onToggleRead }) => {
  let content;
  if (!repo.lastRelease) {
    content = 'No releases';
  } else {
    content = (
      <>
        <a href={repo.lastRelease.html_url} onClick={(e) => e.stopPropagation()}>
          {repo.lastRelease.tag_name}
        </a>
        <div>{getFormattedDate(repo.lastRelease.created_at)}</div>
        <div>
          <ReactMarkdown>{repo.lastRelease.body}</ReactMarkdown>
        </div>
      </>
    );
  }

  return (
    <div className="release-notes">
      <div className="toggle-read" role="button" onClick={(e) => onToggleRead(e, repo)}>
        {repo.read ? 'Mark unread' : 'Mark read'}
      </div>
      <div>
        <a href={repo.url} onClick={(e) => e.stopPropagation()}>
          {repo.owner}/{repo.name}
        </a>
      </div>
      {content}
    </div>
  );
};
