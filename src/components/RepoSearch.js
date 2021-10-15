import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';
import { octokit } from '../utils';
import '../App.css';

function SearchRepos({ onSelect }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const searchRepos = async (q) => {
      try {
        const res = await octokit.request(`GET /search/repositories?q=${q}&per_page=5`);
        setResults(res.data.items);
      } catch (e) {
        console.log(e);
      }
    };
    if (debouncedQuery.length) {
      searchRepos(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleSelect = (repo) => {
    onSelect(repo);
    setResults([]);
    setQuery('');
  };

  return (
    <div>
      <input type="text" name="repo" value={query} onChange={(e) => setQuery(e.target.value)} />
      {results?.map((r) => (
        <div key={r.id} role="button" onClick={() => handleSelect(r)}>
          {r.owner.login}/{r.name}
        </div>
      ))}
    </div>
  );
}

export default SearchRepos;
