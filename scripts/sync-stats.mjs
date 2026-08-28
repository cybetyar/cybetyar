// Fetches real numbers from the GitHub GraphQL API and rewrites assets/stats-*.svg.
// Run by .github/workflows/profile.yml. Node 20+, no dependencies.
import { writeFile } from 'node:fs/promises';
import { renderStats } from './render-stats.mjs';

const login = process.env.GH_LOGIN;
const token = process.env.GH_TOKEN;
if (!login || !token) throw new Error('GH_LOGIN and GH_TOKEN are required');

async function gql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': `${login}-profile`
    },
    body: JSON.stringify({ query, variables })
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const PROFILE = `
  query($login: String!) {
    user(login: $login) {
      createdAt
      pullRequests { totalCount }
      repositoriesContributedTo(contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) { totalCount }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }`;

const COMMITS = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) { totalCommitContributions }
    }
  }`;

function currentStreak(weeks) {
  const days = weeks.flatMap(w => w.contributionDays).sort((a, b) => a.date < b.date ? 1 : -1);
  let streak = 0;
  for (let i = 0; i < days.length; i++) {
    if (days[i].contributionCount > 0) streak++;
    else if (i > 0) break; // today may simply not be over yet
  }
  return streak;
}

const profile = await gql(PROFILE, { login });
const user = profile.user;

// contributionsCollection covers at most one year, so walk from the account's creation
let commits = 0;
const now = new Date();
for (let from = new Date(user.createdAt); from < now; ) {
  const to = new Date(Math.min(from.getTime() + 365 * 24 * 3600 * 1000, now.getTime()));
  const page = await gql(COMMITS, { login, from: from.toISOString(), to: to.toISOString() });
  commits += page.user.contributionsCollection.totalCommitContributions;
  from = to;
}

const cal = user.contributionsCollection.contributionCalendar;
const data = {
  contributions: cal.totalContributions.toLocaleString('en-US'),
  streak: `${currentStreak(cal.weeks)} d`,
  commits: commits.toLocaleString('en-US'),
  prs: user.pullRequests.totalCount,
  contributedTo: user.repositoriesContributedTo.totalCount,
  synced: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC'
};

for (const theme of ['dark', 'light']) {
  await writeFile(`assets/stats-${theme}.svg`, renderStats(theme, data));
}
console.log('board rebuilt:', data);
