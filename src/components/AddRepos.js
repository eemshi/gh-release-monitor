import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';
import '../App.css';

function AddRepos({ searchRepos, handleAddRepo }) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    if (debouncedQuery.length) {
      searchRepos(debouncedQuery, setSearchResults);
    }
  }, [debouncedQuery, searchRepos]);

  return (
    <div>
      <input
        type="text"
        name="repo"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div>
        {searchResults?.map((r) => (
          <div key={r.id} role="button" onClick={() => handleAddRepo(r)}>
            {r.owner.login}/{r.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddRepos;
