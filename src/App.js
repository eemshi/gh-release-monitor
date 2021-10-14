import { Octokit } from '@octokit/core';
import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import logo from './logo.svg';
import './App.css';

const octokit = new Octokit();

async function getReleases(owner, repo) {
  try {
    return await octokit.request(`GET /repos/${owner}/${repo}/releases`);
  } catch (e) {
    console.log(e);
  }
}

async function updateRepos(repos, handleUpdate) {
  const data = await repos.reduce(async (ret, item) => {
    try {
      const res = await getReleases(item.owner, item.repo);
      return [...ret, { ...item, lastRelease: res.data[0] }];
    } catch (e) {
      console.log(e);
      return ret;
    }
  }, []);
  handleUpdate(data);
}

function App() {
  const [savedRepos, setSavedRepos] = useLocalStorage('repos', null);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if (savedRepos?.length) {
      updateRepos(savedRepos, setRepos);
    }
  }, [savedRepos]);

  console.log(repos);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
