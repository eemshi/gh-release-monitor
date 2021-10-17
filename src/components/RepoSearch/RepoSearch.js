import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { octokit } from '../../utils/helpers';
import closeIcon from '../../icons/close.svg';
import searchIcon from '../../icons/search.svg';
import './styles.scss';

const RepoSearch = ({ repos, onSelect }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.length) {
      setResults([]);
      setError(null);
    }
  }, [query]);

  useEffect(() => {
    const searchRepos = async (q) => {
      try {
        const res = await octokit.request(`GET /search/repositories?q=${q}&per_page=10`);
        setResults(res.data.items);
        setError(null);
      } catch (e) {
        setResults([]);
        setError('Sorry, something went wrong');
      }
    };
    if (debouncedQuery.trim().length) {
      searchRepos(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleSelect = (repo) => {
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
      <Dropdown results={results} error={error} onSelect={handleSelect} />
    </div>
  );
};

export default RepoSearch;

const Dropdown = ({ results, error, onSelect }) => {
  if (!error && !results.length) {
    return null;
  }

  let content;

  if (error) {
    content = <div className="error">{error}</div>;
  } else if (results.length) {
    content = (
      <>
        {results.map((result) => (
          <div
            key={result.id}
            role="button"
            onClick={() => onSelect(result)}
            className="item"
          >
            {result.owner.login}/{result.name}
          </div>
        ))}
      </>
    );
  }
  return (
    <div className="dropdown-container">
      <div className="dropdown">{content}</div>
    </div>
  );
};
