import { Octokit } from '@octokit/core';

const ACCESS_TOKEN = process.env.REACT_APP_GITHUB_PAT;

export const octokit = new Octokit({
  auth: ACCESS_TOKEN ? `token ${ACCESS_TOKEN}` : '',
});
