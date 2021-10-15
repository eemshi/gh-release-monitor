import React from 'react';
import '../App.css';

const RepoCard = ({ repo, onSelect, onDelete }) => {
  const { id, owner, name, lastRelease } = repo;
  return (
    <div onClick={() => onSelect(repo)}>
      <div>
        {owner}/{name}
      </div>
      <div>
        {lastRelease.tag_name} {lastRelease.created_at}
      </div>
      <div onClick={() => onDelete(id)}>X</div>
    </div>
  );
};

export default RepoCard;
