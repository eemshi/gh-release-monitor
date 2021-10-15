import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import RepoCard from './components/RepoCard/RepoCard';
import RepoSearch from './components/RepoSearch/RepoSearch';
import useLocalStorage from './hooks/useLocalStorage';
import { octokit, getFormattedDate } from './utils';
import syncIcon from './icons/sync.svg';
import './App.scss';

const App = () => {
  const [syncing, setSyncing] = useState(true);
  const [storedRepos, setStoredRepos] = useLocalStorage('repos', []);
  const [repos, setRepos] = useState([]);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    const syncRepos = async () => {
      const updatedRepos = await updateReleases(storedRepos);
      setRepos(updatedRepos);
    };
    if (syncing) {
      setFocused(null);
      syncRepos();
      setSyncing(false);
    }
  }, [storedRepos, syncing]);

  const updateRepo = (updatedRepo) => {
    const deduped = repos.filter((r) => r.id !== updatedRepo.id);
    const newList = [...deduped, updatedRepo];
    setRepos(newList);
    setStoredRepos(newList);
  };

  const handleSaveRepo = async ({ id, owner, name, html_url }) => {
    const releases = await getReleases(owner.login, name);
    const lastRelease = releases?.data?.length ? releases.data[0] : null;
    updateRepo({ id, owner: owner.login, name, lastRelease, url: html_url });
  };

  const handleDeleteRepo = (id) => {
    const newList = repos.filter((r) => r.id !== id);
    setRepos(newList);
    setStoredRepos(newList);
    if (id === focused?.id) {
      setFocused(null);
    }
  };

  const toggleRead = () => {
    const readUpdated = { ...focused, read: !focused.read };
    updateRepo(readUpdated);
    setFocused(readUpdated);
  };

  return (
    <div className="App">
      <header>
        <h1>GH Release Monitor</h1>
        <div
          role="button"
          onClick={() => setSyncing(true)}
          className="sync-icon-container"
        >
          <img src={syncIcon} width={20} alt="Sync" />
        </div>
      </header>
      <main>
        <div className="repos-column">
          <RepoSearch onSelect={handleSaveRepo} />
          <h2>Tracking</h2>
          {repos.map((repo) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              focused={focused?.id === repo.id}
              onSelect={setFocused}
              onDelete={handleDeleteRepo}
            />
          ))}
        </div>
        {focused && (
          <div className="release-notes">
            <div role="button" onClick={toggleRead}>
              {focused.read ? 'Mark unread' : 'Mark read'}
            </div>
            <div>
              <a href={focused.url}>
                {focused.owner}/{focused.name}
              </a>{' '}
              <a href={focused.lastRelease.html_url}>{focused.lastRelease.tag_name}</a>
            </div>
            <div>{getFormattedDate(focused.lastRelease.created_at)}</div>
            <div>
              <ReactMarkdown>{focused.lastRelease.body}</ReactMarkdown>
            </div>
          </div>
        )}
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
  return repos.map((r) => {
    try {
      const res = getReleases(r.owner, r.name);
      if (res?.data?.length) {
        const lastRelease = res.data[0];
        const isNew = lastRelease.created_at !== r.lastRelease.created_at;
        return { ...r, lastRelease, isNew };
      }
      return r;
    } catch (e) {
      return r;
    }
  });
};
