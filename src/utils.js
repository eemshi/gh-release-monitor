import { Octokit } from '@octokit/core';

const ACCESS_TOKEN = process.env.REACT_APP_GITHUB_PAT;

export const octokit = new Octokit({
  auth: ACCESS_TOKEN ? `token ${ACCESS_TOKEN}` : '',
});

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

export const getFormattedDate = (string, type = 'date') => {
  const date = new Date(string);
  const { month, day, year } = {
    month: monthNames[date.getMonth() - 1],
    day: date.getDate(),
    year: date.getFullYear(),
  };
  if (type === 'datetime') {
    const { hours, minutes } = {
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${month} ${day}, ${year} ${hours}:${formattedMinutes}`;
  }
  return `${month} ${day}, ${year}`;
};
