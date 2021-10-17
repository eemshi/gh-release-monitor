import React, { useState, useEffect } from 'react';
import RepoCard from './components/RepoCard/RepoCard';
import RepoSearch from './components/RepoSearch/RepoSearch';
import SyncButton from './components/SyncButton/SyncButton';
import useLocalStorage from './hooks/useLocalStorage';
import { octokit, getFormattedDate } from './utils/helpers';
import './App.scss';

const App = () => {
  const [syncing, setSyncing] = useState(true);
  const [storedRepos, setStoredRepos] = useLocalStorage('repos', []);
  const [repos, setRepos] = useState([]);
  const [lastSynced, setLastSynced] = useState('');

  useEffect(() => {
    const syncRepos = async () => {
      const updatedRepos = await updateReleases(storedRepos);
      setRepos(updatedRepos);
      setLastSynced(getFormattedDate(Date.now(), 'datetime'));
    };
    if (syncing) {
      syncRepos();
    }
    setSyncing(false);
  }, [storedRepos, syncing]);

  const updateRepo = (updatedRepo) => {
    const deduped = repos.filter((r) => r.id !== updatedRepo.id);
    const updatedRepos = [...deduped, updatedRepo];
    setRepos(updatedRepos);
    setStoredRepos(updatedRepos);
  };

  const handleSaveRepo = async ({ id, owner, name, html_url }) => {
    const releases = await getReleases(owner.login, name);
    const lastRelease = releases?.data?.length ? releases.data[0] : null;
    updateRepo({
      id,
      owner: owner.login,
      name,
      lastRelease,
      read: !lastRelease,
      url: html_url,
    });
  };

  const handleDeleteRepo = (id) => {
    const updatedRepos = repos.filter((r) => r.id !== id);
    setRepos(updatedRepos);
    setStoredRepos(updatedRepos);
  };

  const toggleRead = (repo) => {
    const updatedRepos = { ...repo, read: !repo.read };
    updateRepo(updatedRepos);
  };

  return (
    <div className="App">
      <header>
        <h1>GH Release Monitor</h1>
        <RepoSearch repos={repos} onSelect={handleSaveRepo} />
      </header>
      <main>
        {!!repos.length && (
          <div className="repos-header">
            <div className="title">
              <h2>Tracking</h2>
              <SyncButton syncing={syncing} onSync={() => setSyncing(true)} />
            </div>
            <small>Last synced {lastSynced}</small>
          </div>
        )}
        {repos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            onDelete={handleDeleteRepo}
            toggleRead={toggleRead}
          />
        ))}
      </main>
    </div>
  );
};

export default App;

const getReleases = async (owner, repo) => {
  try {
    return await octokit.request(`GET /repos/${owner}/${repo}/releases?per_page=1`);
  } catch (e) {
    console.log(e);
  }
};

const updateReleases = (repos) => {
  if (!repos?.length) {
    return [];
  }
  return Promise.all(
    repos.map(async (repo) => {
      try {
        const res = await getReleases(repo.owner, repo.name);
        if (res?.data?.length) {
          const lastRelease = res.data[0];
          const isNew = lastRelease.published_at !== repo.lastRelease.published_at;
          return { ...repo, lastRelease, isNew };
        }
        return repo;
      } catch (e) {
        // could handle with a cancellable promise,
        // but not yet possible w/o a library
        console.log(`Failed to update ${repo.name}; skipping`);
        return { ...repo, error: true };
      }
    })
  );
};
