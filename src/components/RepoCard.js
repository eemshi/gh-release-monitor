import React from 'react';
import '../App.css';

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
    <div onClick={handleSelect}>
      <div>
        {owner}/{name}
      </div>
      {lastRelease ? (
        <div>
          {lastRelease.tag_name} {lastRelease.created_at}
        </div>
      ) : (
        'No releases yet'
      )}
      <div onClick={handleDelete}>X</div>
    </div>
  );
};

export default RepoCard;
