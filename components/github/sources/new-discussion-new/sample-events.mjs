export function getSampleWebhookEvent() {
  return {};
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
