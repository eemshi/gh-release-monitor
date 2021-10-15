import { Octokit } from '@octokit/core';
import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import AddRepos from './components/AddRepos';
import './App.css';

const octokit = new Octokit();
const ACCESS_TOKEN = process.env.REACT_APP_GITHUB_PAT;
const headers = ACCESS_TOKEN && { authorization: `token ${ACCESS_TOKEN}` };

const App = () => {
  const [syncing, setSyncing] = useState(true);
  const [storedRepos, setStoredRepos] = useLocalStorage('repos', []);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const syncRepos = async () => {
      const updatedRepos = await getNewReleases(storedRepos);
      setRepos(updatedRepos);
    };
    if (syncing && storedRepos?.length) {
      syncRepos();
    }
    setSyncing(false);
  }, [storedRepos, syncing]);

  const handleAddRepo = async ({ id, owner, name }) => {
    const deduped = repos.filter((r) => r.id !== id);
    const releases = await getReleases(owner.login, name);
    const lastRelease = releases?.data?.length ? releases.data[0] : null;
    const newList = [...deduped, { id, owner: owner.login, name, lastRelease }];
    setRepos(newList);
    setStoredRepos(newList);
  };

  const handleDeleteRepo = (id) => {
    const newList = repos.filter((r) => r.id !== id);
    setRepos(newList);
    setStoredRepos(newList);
  };

  return (
    <div className="App">
      <AddRepos searchRepos={searchRepos} handleAddRepo={handleAddRepo} />
      <div>---</div>
      <div>
        {!!repos.length &&
          repos.map((r) => (
            <div key={r.id}>
              <div>
                {r.owner}/{r.name}
              </div>
              <div onClick={() => handleDeleteRepo(r.id)}>X</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;

const getReleases = async (owner, repo) => {
  try {
    return await octokit.request(`GET /repos/${owner}/${repo}/releases?per_page=1`, {
      headers,
    });
  } catch (e) {
    console.log(e);
  }
};

const getNewReleases = (repos) => {
  return repos.map((r) => {
    try {
      const res = getReleases(r.owner, r.name);
      if (res?.data?.length) {
        return { ...r, lastRelease: res.data[0] };
      }
      return r;
    } catch (e) {
      return r;
    }
  });
};

const searchRepos = async (query, handleResults) => {
  try {
    const res = await octokit.request(`GET /search/repositories?q=${query}&per_page=5`, {
      headers,
    });
    handleResults(res.data.items);
  } catch (e) {
    console.log(e);
  }
};
