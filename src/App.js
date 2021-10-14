import { Octokit } from '@octokit/core';
import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import useDebounce from './hooks/useDebounce';
import './App.css';

const octokit = new Octokit();

async function getReleases(owner, repo) {
  try {
    return await octokit.request(`GET /repos/${owner}/${repo}/releases`);
  } catch (e) {
    console.log(e);
  }
}

function updateReleases(repos, handleUpdate) {
  const updatedList = [];
  repos.forEach(async (r) => {
    try {
      const res = await getReleases(r.owner, r.name);
      if (res?.data?.length) {
        updatedList.push({ ...r, lastRelease: res.data[0] });
      }
    } catch (e) {
      console.log(e);
    }
  });
  handleUpdate(updatedList);
}

async function searchRepos(query, handleResults) {
  try {
    const res = await octokit.request(`GET /search/repositories?q=${query}&per_page=10`);
    handleResults(res.data.items);
  } catch (e) {
    console.log(e);
  }
}

function App() {
  const [syncReleases, setSyncRelease] = useState(true);
  const [storedRepos, setStoredRepos] = useLocalStorage('repos', []);
  const [repos, setRepos] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    if (syncReleases && storedRepos?.length) {
      updateReleases(storedRepos, setRepos);
    }
    setSyncRelease(false);
  }, [syncReleases, storedRepos]);

  useEffect(() => {
    if (debouncedQuery.length) {
      searchRepos(debouncedQuery, setSearchResults);
    }
  }, [debouncedQuery]);

  const handleAddRepo = ({ owner, name }) => {
    const updatedList = [...repos, { owner: owner.login, name }];
    setRepos(updatedList);
    setStoredRepos(updatedList);
  };

  return (
    <div className="App">
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

export default App;
