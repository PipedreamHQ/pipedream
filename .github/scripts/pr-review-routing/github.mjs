const API_URL = "https://api.github.com";

export function createGitHub(token) {
  if (!token) {
    throw new Error("GH_TOKEN is not set. It needs a token with the repo and project scopes.");
  }

  async function rest(method, path, body) {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: body && JSON.stringify(body),
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(`GitHub ${method} ${path} → ${res.status}: ${text}`);
    }

    return text ? JSON.parse(text) : null;
  }

  async function graphql(query, variables) {
    const { data, errors } = await rest("POST", "/graphql", {
      query,
      variables,
    });

    if (errors?.length) {
      throw new Error(`GitHub GraphQL: ${JSON.stringify(errors)}`);
    }

    return data;
  }

  const pullPath = ({ owner, repo, number }) => `/repos/${owner}/${repo}/pulls/${number}`;

  return {
    graphql,

    getPull: (pr) => rest("GET", pullPath(pr)),

    listReviews: (pr) => rest("GET", `${pullPath(pr)}/reviews?per_page=100`),

    requestReviewer: (pr, login) => rest("POST", `${pullPath(pr)}/requested_reviewers`, {
      reviewers: [login],
    }),
  };
}
