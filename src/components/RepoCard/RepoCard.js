import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getFormattedDate } from '../../utils/helpers';
import deleteIcon from '../../icons/delete.svg';
import downCaretIcon from '../../icons/down-caret.svg';
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
      <Header
        repo={repo}
        focused={focused}
        onToggleRead={handleToggleRead}
        onDelete={handleDelete}
      />
      {focused && <ReleaseNotes repo={repo} />}
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

const Header = ({ repo, focused, onToggleRead, onDelete }) => {
  const { owner, name, lastRelease, isNew, read, error } = repo;
  return (
    <div className="header">
      <div style={{ flex: 1 }}>
        <span className="name">{name}</span>
        <br />
        <small>{owner}</small>
      </div>
      <div className="release-info">
        {lastRelease && (
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
        )}
        {!lastRelease && <small>No releases yet</small>}
      </div>
      <div role="button" onClick={onDelete} className="delete-btn">
        <img src={deleteIcon} width={20} alt="Delete" />
      </div>
      <small className="read-action">
        <ReadAction repo={repo} focused={focused} onToggleRead={onToggleRead} />
      </small>
    </div>
  );
};

const ReadAction = ({ repo, focused, onToggleRead }) => {
  if (!repo.lastRelease) {
    return null;
  }
  if (focused) {
    return (
      <div className="read-toggle" role="button" onClick={(e) => onToggleRead(e, repo)}>
        {repo.read ? 'Mark unread' : 'Mark read'}
      </div>
    );
  }
  if (repo.read) {
    return '✓ Read';
  }
  return <img src={downCaretIcon} width={20} />;
};

const ReleaseNotes = ({ repo }) => {
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
