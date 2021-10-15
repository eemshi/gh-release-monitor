import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { octokit } from '../../utils';
import './styles.scss';

function RepoSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!query.length) {
      setResults([]);
    }
  }, [query]);

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
    setQuery('');
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input type="text" name="repo" value={query} onChange={(e) => setQuery(e.target.value)} />
        {!!query.length && (
          <div role="button" onClick={() => setQuery('')} className="reset-btn">
            X
          </div>
        )}
      </div>

      {!!results?.length && (
        <div className="dropdown-container">
          <div className="dropdown">
            {results.map((r) => (
              <div key={r.id} role="button" onClick={() => handleSelect(r)} className="item">
                {r.owner.login}/{r.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RepoSearch;
