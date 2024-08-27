import { SAMPLE_GITHUB_HEADERS } from "../common/constants.mjs";

export function getSampleWebhookEvent() {
  return {
    ...SAMPLE_GITHUB_HEADERS,
    ref: "branch_name",
    ref_type: "branch",
    master_branch: "main",
    description: "Repository description",
    pusher_type: "user",
    sender: {
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
  };
}

export function getSampleTimerEvent() {
  return {
    name: "master",
    commit: {
      sha: "c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc",
      url: "https://api.github.com/repos/octocat/Hello-World/commits/c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc",
    },
    protected: true,
    protection: {
      required_status_checks: {
        enforcement_level: "non_admins",
        contexts: [
          "ci-test",
          "linter",
        ],
      },
    },
    protection_url:
      "https://api.github.com/repos/octocat/hello-world/branches/master/protection",
  };
}
