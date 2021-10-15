import { Octokit } from '@octokit/core';

const ACCESS_TOKEN = process.env.REACT_APP_GITHUB_PAT;

export const octokit = new Octokit({
  auth: ACCESS_TOKEN ? `token ${ACCESS_TOKEN}` : '',
});

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export const getFormattedDate = (string) => {
  const date = new Date(string);
  const { month, day, year } = {
    month: monthNames[date.getMonth() - 1],
    day: date.getDate(),
    year: date.getFullYear(),
  };
  return `${month} ${day}, ${year}`;
};
