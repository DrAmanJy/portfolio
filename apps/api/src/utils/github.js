export const fetchRecentCommits = async (repoUrl) => {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);

  if (!match) throw new Error("Invalid GitHub URL");

  const [, owner, repoRaw] = match;
  const repo = repoRaw.replace(/\.git$/, "");

  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GitHub token not configured");
  }
  console.warn("making request at github");

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const data = await res.json();

  return data.map((commit) => ({
    message: commit.commit.message.split("\n")[0],
    commitId: commit.sha,
    createdAt: commit.commit.author.date,
  }));
};
