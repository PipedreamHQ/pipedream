import { SAMPLE_GITHUB_HEADERS } from "../common/constants.mjs";

export function getSampleWebhookEvent() {
  return {
    ...SAMPLE_GITHUB_HEADERS,
    html_url:
      "https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e#commitcomment-1",
    url: "https://api.github.com/repos/octocat/Hello-World/comments/1",
    id: 1,
    node_id: "MDEzOkNvbW1pdENvbW1lbnQx",
    user: {
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
    path: "file1.txt",
    position: 4,
    line: 14,
    commit_id: "6dcb09b5b57875f334f61aebed695e2e4193db5e",
    created_at: "2011-04-14T16:00:49Z",
    updated_at: "2011-04-14T16:00:49Z",
    author_association: "COLLABORATOR",
    body: "Great stuff",
    reactions: {
      "url": "https://api.github.com/repos/octocat/Hello-World/comments/1/reactions",
      "total_count": 0,
      "+1": 0,
      "-1": 0,
      "laugh": 0,
      "hooray": 0,
      "confused": 0,
      "heart": 0,
      "rocket": 0,
      "eyes": 0,
    },
  };
}

export function getSampleTimerEvent() {
  return {
    html_url:
      "https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e#commitcomment-1",
    url: "https://api.github.com/repos/octocat/Hello-World/comments/1",
    id: 1,
    node_id: "MDEzOkNvbW1pdENvbW1lbnQx",
    body: "Great stuff",
    path: "file1.txt",
    position: 4,
    line: 14,
    commit_id: "6dcb09b5b57875f334f61aebed695e2e4193db5e",
    user: {
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
    created_at: "2011-04-14T16:00:49Z",
    updated_at: "2011-04-14T16:00:49Z",
    author_association: "COLLABORATOR",
  };
}
