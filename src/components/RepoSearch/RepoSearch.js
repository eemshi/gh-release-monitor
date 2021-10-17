import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { octokit } from '../../utils';
import closeIcon from '../../icons/close.svg';
import searchIcon from '../../icons/search.svg';
import './styles.scss';

const RepoSearch = ({ repos, onSelect }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.length) {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const searchRepos = async (q) => {
      try {
        const res = await octokit.request(`GET /search/repositories?q=${q}&per_page=10`);
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
    console.log(repo);
    onSelect(repo);
    setQuery('');
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <img src={searchIcon} width={18} alt="Search" />
        <input
          type="text"
          name="repo"
          placeholder={!repos.length ? 'Add a repo to get started' : 'Add another repo'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {!!query.length && (
          <div role="button" onClick={() => setQuery('')} className="reset-btn">
            <img src={closeIcon} width={20} alt="Close" />
          </div>
        )}
      </div>

      {!!results.length && (
        <div className="dropdown-container">
          <div className="dropdown">
            {results.map((result) => (
              <div
                key={result.id}
                role="button"
                onClick={() => handleSelect(result)}
                className="item"
              >
                {result.owner.login}/{result.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoSearch;
