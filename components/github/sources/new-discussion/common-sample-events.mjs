import { SAMPLE_GITHUB_HEADERS } from "../common/constants.mjs";

export function getSampleWebhookEvent() {
  return {
    ...SAMPLE_GITHUB_HEADERS,
    repository_url: "https://api.github.com/repos/octocat/Hello-World",
    category: {
      id: 40911353,
      node_id: "DIC_kwDOJrE_Mc4CcEH5",
      repository_id: 649150257,
      emoji: ":speech_balloon:",
      name: "General",
      description: "Chat about anything and everything here",
      created_at: "2023-12-28T18:54:04.000-03:00",
      updated_at: "2023-12-28T18:54:04.000-03:00",
      slug: "general",
      is_answerable: false,
    },
    answer_html_url: null,
    answer_chosen_at: null,
    answer_chosen_by: null,
    html_url: "https://github.com/octocat/Hello-World/discussions/9",
    id: 6029799,
    node_id: "D_kwDOJrE_Mc4AXAHn",
    number: 1,
    title: "test disc 3",
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
    state: "open",
    state_reason: null,
    locked: false,
    comments: 0,
    created_at: "2024-01-04T22:05:00Z",
    updated_at: "2024-01-04T22:05:00Z",
    author_association: "COLLABORATOR",
    active_lock_reason: null,
    body: "Discussion body",
    reactions: {
      "url": "https://api.github.com/repos/octocat/Hello-World/discussions/1/reactions",
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
    timeline_url:
      "https://api.github.com/repos/octocat/Hello-World/discussions/1/timeline",
  };
}

export function getSampleTimerEvent() {
  return {
    author: {
      login: "octocat",
      url: "https://github.com/octocat",
    },
    body: "Discussion body",
    bodyHTML: "<p dir=\"auto\">Discussion body</p>",
    bodyText: "Discussion body",
    createdAt: "2023-12-28T22:01:49Z",
    id: "D_kwDOJrE_Mc4AW7Ah",
    title: "Discussion title",
    url: "https://github.com/octocat/Hello-World/discussions/1",
  };
}
