import { SAMPLE_GITHUB_HEADERS } from "../common/constants.mjs";

export function getSampleWebhookEvent() {
  return {
    ...SAMPLE_GITHUB_HEADERS,
    id: 1296269,
    node_id: "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
    name: "Hello-World",
    full_name: "octocat/Hello-World",
    private: false,
    owner: {
      login: "octocat",
      id: 1,
      node_id: "MDQ6VXNlcjE=",
      avatar_url: "https://github.com/images/error/octocat_happy.gif",
      gravatar_id: "",
      url: "https://api.github.com/users/octocat",
      html_url: "https://github.com/octocat",
      followers_url: "https://api.github.com/users/octocat/followers",
      following_url:
        "https://api.github.com/users/octocat/following{/other_user}",
      gists_url: "https://api.github.com/users/octocat/gists{/gist_id}",
      starred_url:
        "https://api.github.com/users/octocat/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/octocat/subscriptions",
      organizations_url: "https://api.github.com/users/octocat/orgs",
      repos_url: "https://api.github.com/users/octocat/repos",
      events_url: "https://api.github.com/users/octocat/events{/privacy}",
      received_events_url:
        "https://api.github.com/users/octocat/received_events",
      type: "User",
      site_admin: false,
    },
    html_url: "https://github.com/octocat/Hello-World",
    description: "This your first repo!",
    fork: true,
    url: "https://api.github.com/repos/octocat/Hello-World",
    forks_url: "https://api.github.com/repos/octocat/Hello-World/forks",
    keys_url: "https://api.github.com/repos/octocat/Hello-World/keys{/key_id}",
    collaborators_url:
      "https://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}",
    teams_url: "https://api.github.com/repos/octocat/Hello-World/teams",
    hooks_url: "https://api.github.com/repos/octocat/Hello-World/hooks",
    issue_events_url:
      "https://api.github.com/repos/octocat/Hello-World/issues/events{/number}",
    events_url: "https://api.github.com/repos/octocat/Hello-World/events",
    assignees_url:
      "https://api.github.com/repos/octocat/Hello-World/assignees{/user}",
    branches_url:
      "https://api.github.com/repos/octocat/Hello-World/branches{/branch}",
    tags_url: "https://api.github.com/repos/octocat/Hello-World/tags",
    blobs_url:
      "https://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}",
    git_tags_url:
      "https://api.github.com/repos/octocat/Hello-World/git/tags{/sha}",
    git_refs_url:
      "https://api.github.com/repos/octocat/Hello-World/git/refs{/sha}",
    trees_url:
      "https://api.github.com/repos/octocat/Hello-World/git/trees{/sha}",
    statuses_url:
      "https://api.github.com/repos/octocat/Hello-World/statuses/{sha}",
    languages_url: "https://api.github.com/repos/octocat/Hello-World/languages",
    stargazers_url:
      "https://api.github.com/repos/octocat/Hello-World/stargazers",
    contributors_url:
      "https://api.github.com/repos/octocat/Hello-World/contributors",
    subscribers_url:
      "https://api.github.com/repos/octocat/Hello-World/subscribers",
    subscription_url:
      "https://api.github.com/repos/octocat/Hello-World/subscription",
    commits_url:
      "https://api.github.com/repos/octocat/Hello-World/commits{/sha}",
    git_commits_url:
      "https://api.github.com/repos/octocat/Hello-World/git/commits{/sha}",
    comments_url:
      "https://api.github.com/repos/octocat/Hello-World/comments{/number}",
    issue_comment_url:
      "https://api.github.com/repos/octocat/Hello-World/issues/comments{/number}",
    contents_url:
      "https://api.github.com/repos/octocat/Hello-World/contents/{+path}",
    compare_url:
      "https://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}",
    merges_url: "https://api.github.com/repos/octocat/Hello-World/merges",
    archive_url:
      "https://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}",
    downloads_url: "https://api.github.com/repos/octocat/Hello-World/downloads",
    issues_url:
      "https://api.github.com/repos/octocat/Hello-World/issues{/number}",
    pulls_url:
      "https://api.github.com/repos/octocat/Hello-World/pulls{/number}",
    milestones_url:
      "https://api.github.com/repos/octocat/Hello-World/milestones{/number}",
    notifications_url:
      "https://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}",
    labels_url:
      "https://api.github.com/repos/octocat/Hello-World/labels{/name}",
    releases_url:
      "https://api.github.com/repos/octocat/Hello-World/releases{/id}",
    deployments_url:
      "https://api.github.com/repos/octocat/Hello-World/deployments",
    created_at: "2011-01-26T19:01:12Z",
    updated_at: "2011-01-26T19:14:43Z",
    pushed_at: "2011-01-26T19:06:43Z",
    git_url: "git:github.com/octocat/Hello-World.git",
    ssh_url: "git@github.com:octocat/Hello-World.git",
    clone_url: "https://github.com/octocat/Hello-World.git",
    svn_url: "https://svn.github.com/octocat/Hello-World",
    homepage: "https://github.com",
    size: 108,
    stargazers_count: 80,
    watchers_count: 80,
    language: null,
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    has_discussions: false,
    forks_count: 9,
    mirror_url: "git:git.example.com/octocat/Hello-World",
    archived: false,
    disabled: false,
    open_issues_count: 0,
    license: {
      key: "mit",
      name: "MIT License",
      spdx_id: "MIT",
      url: "https://api.github.com/licenses/mit",
      node_id: "MDc6TGljZW5zZW1pdA==",
    },
    allow_forking: true,
    is_template: true,
    web_commit_signoff_required: false,
    topics: [
      "octocat",
      "atom",
      "electron",
      "api",
    ],
    visibility: "public",
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: "master",
    public: true,
  };
}

export function getSampleTimerEvent() {
  return {
    id: 1296269,
    node_id: "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
    name: "Hello-World",
    full_name: "octocat/Hello-World",
    owner: {
      login: "octocat",
      id: 1,
      node_id: "MDQ6VXNlcjE=",
      avatar_url: "https://github.com/images/error/octocat_happy.gif",
      gravatar_id: "",
      url: "https://api.github.com/users/octocat",
      html_url: "https://github.com/octocat",
      followers_url: "https://api.github.com/users/octocat/followers",
      following_url:
        "https://api.github.com/users/octocat/following{/other_user}",
      gists_url: "https://api.github.com/users/octocat/gists{/gist_id}",
      starred_url:
        "https://api.github.com/users/octocat/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/octocat/subscriptions",
      organizations_url: "https://api.github.com/users/octocat/orgs",
      repos_url: "https://api.github.com/users/octocat/repos",
      events_url: "https://api.github.com/users/octocat/events{/privacy}",
      received_events_url:
        "https://api.github.com/users/octocat/received_events",
      type: "User",
      site_admin: false,
    },
    private: false,
    html_url: "https://github.com/octocat/Hello-World",
    description: "This your first repo!",
    fork: true,
    url: "https://api.github.com/repos/octocat/Hello-World",
    archive_url:
      "https://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}",
    assignees_url:
      "https://api.github.com/repos/octocat/Hello-World/assignees{/user}",
    blobs_url:
      "https://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}",
    branches_url:
      "https://api.github.com/repos/octocat/Hello-World/branches{/branch}",
    collaborators_url:
      "https://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}",
    comments_url:
      "https://api.github.com/repos/octocat/Hello-World/comments{/number}",
    commits_url:
      "https://api.github.com/repos/octocat/Hello-World/commits{/sha}",
    compare_url:
      "https://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}",
    contents_url:
      "https://api.github.com/repos/octocat/Hello-World/contents/{+path}",
    contributors_url:
      "https://api.github.com/repos/octocat/Hello-World/contributors",
    deployments_url:
      "https://api.github.com/repos/octocat/Hello-World/deployments",
    downloads_url: "https://api.github.com/repos/octocat/Hello-World/downloads",
    events_url: "https://api.github.com/repos/octocat/Hello-World/events",
    forks_url: "https://api.github.com/repos/octocat/Hello-World/forks",
    git_commits_url:
      "https://api.github.com/repos/octocat/Hello-World/git/commits{/sha}",
    git_refs_url:
      "https://api.github.com/repos/octocat/Hello-World/git/refs{/sha}",
    git_tags_url:
      "https://api.github.com/repos/octocat/Hello-World/git/tags{/sha}",
    git_url: "git:github.com/octocat/Hello-World.git",
    issue_comment_url:
      "https://api.github.com/repos/octocat/Hello-World/issues/comments{/number}",
    issue_events_url:
      "https://api.github.com/repos/octocat/Hello-World/issues/events{/number}",
    issues_url:
      "https://api.github.com/repos/octocat/Hello-World/issues{/number}",
    keys_url: "https://api.github.com/repos/octocat/Hello-World/keys{/key_id}",
    labels_url:
      "https://api.github.com/repos/octocat/Hello-World/labels{/name}",
    languages_url: "https://api.github.com/repos/octocat/Hello-World/languages",
    merges_url: "https://api.github.com/repos/octocat/Hello-World/merges",
    milestones_url:
      "https://api.github.com/repos/octocat/Hello-World/milestones{/number}",
    notifications_url:
      "https://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}",
    pulls_url:
      "https://api.github.com/repos/octocat/Hello-World/pulls{/number}",
    releases_url:
      "https://api.github.com/repos/octocat/Hello-World/releases{/id}",
    ssh_url: "git@github.com:octocat/Hello-World.git",
    stargazers_url:
      "https://api.github.com/repos/octocat/Hello-World/stargazers",
    statuses_url:
      "https://api.github.com/repos/octocat/Hello-World/statuses/{sha}",
    subscribers_url:
      "https://api.github.com/repos/octocat/Hello-World/subscribers",
    subscription_url:
      "https://api.github.com/repos/octocat/Hello-World/subscription",
    tags_url: "https://api.github.com/repos/octocat/Hello-World/tags",
    teams_url: "https://api.github.com/repos/octocat/Hello-World/teams",
    trees_url:
      "https://api.github.com/repos/octocat/Hello-World/git/trees{/sha}",
    clone_url: "https://github.com/octocat/Hello-World.git",
    mirror_url: "git:git.example.com/octocat/Hello-World",
    hooks_url: "https://api.github.com/repos/octocat/Hello-World/hooks",
    svn_url: "https://svn.github.com/octocat/Hello-World",
    homepage: "https://github.com",
    language: null,
    forks_count: 9,
    stargazers_count: 80,
    watchers_count: 80,
    size: 108,
    default_branch: "master",
    open_issues_count: 0,
    is_template: true,
    topics: [
      "octocat",
      "atom",
      "electron",
      "api",
    ],
    has_issues: true,
    has_projects: true,
    has_wiki: true,
    has_pages: false,
    has_downloads: true,
    archived: false,
    disabled: false,
    visibility: "public",
    pushed_at: "2011-01-26T19:06:43Z",
    created_at: "2011-01-26T19:01:12Z",
    updated_at: "2011-01-26T19:14:43Z",
    permissions: {
      admin: false,
      push: false,
      pull: true,
    },
    temp_clone_token: "ABTLWHOULUVAXGTRYU7OC2876QJ2O",
    delete_branch_on_merge: true,
    subscribers_count: 42,
    network_count: 0,
    license: {
      "key": "mit",
      "name": "MIT License",
      "spdx_id": "MIT",
      "url": "https://api.github.com/licenses/mit",
      "node_id": "MDc6TGljZW5zZW1pdA==",
    },
  };
}
