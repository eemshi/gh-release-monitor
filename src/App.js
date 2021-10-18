import React, { useState, useEffect } from 'react';
import RepoCard from './components/RepoCard/RepoCard';
import RepoSearch from './components/RepoSearch/RepoSearch';
import SyncButton from './components/SyncButton/SyncButton';
import useLocalStorage from './hooks/useLocalStorage';
import { octokit, sortRepos, getFormattedDate } from './utils/helpers';
import './App.scss';

const App = () => {
  const [syncing, setSyncing] = useState(true);
  const [repos, setRepos] = useLocalStorage('repos', []);
  const [lastSynced, setLastSynced] = useState('');

  useEffect(() => {
    const syncRepos = async () => {
      const updatedRepos = await updateReleases(repos);
      const timestamp = getFormattedDate(Date.now(), 'datetime');
      setRepos(sortRepos(updatedRepos));
      setLastSynced(timestamp);
    };
    if (repos && syncing) {
      syncRepos();
    }
    setSyncing(false);
  }, [repos, setRepos, syncing]);

  const addEditRepo = (updatedRepo) => {
    const deduped = repos.filter((r) => r.id !== updatedRepo.id);
    setRepos(sortRepos([...deduped, updatedRepo]));
  };

  const handleSaveRepo = async ({ id, owner, name, html_url }) => {
    const releases = await getReleases(owner.login, name);
    // TODO: if no official release, use last commit
    const lastRelease = releases?.data?.length ? releases.data[0] : null;
    addEditRepo({
      id,
      owner: owner.login,
      name,
      lastRelease,
      read: !lastRelease,
      url: html_url,
    });
  };

  const handleDeleteRepo = (id) => {
    const updatedList = repos.filter((r) => r.id !== id);
    setRepos(updatedList);
  };

  const handleToggleRead = (repo) => {
    const updatedRepo = { ...repo, read: !repo.read };
    addEditRepo(updatedRepo);
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
              <h2>Latest Releases</h2>
              <SyncButton syncing={syncing} onSync={() => setSyncing(true)} />
            </div>
            <small>Updated {lastSynced}</small>
          </div>
        )}
        {repos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            onDelete={handleDeleteRepo}
            onToggleRead={handleToggleRead}
          />
        ))}
      </main>
    </div>
  );
};

export default App;

const getReleases = async (owner, repo) => {
  return await octokit.request(`GET /repos/${owner}/${repo}/releases?per_page=1`);
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
          const isNew = lastRelease.published_at !== repo.lastRelease?.published_at;
          return { ...repo, lastRelease, isNew };
        }
        return { ...repo, lastRelease: null, isNew: false };
      } catch (e) {
        console.log(`Failed to update ${repo.name}; using cached version instead`);
        return { ...repo, error: true };
        // maybe better to use a cancellable promise for this,
        // but need a library since js can't do this yet
      }
    })
  );
};
