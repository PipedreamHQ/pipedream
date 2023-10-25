import github from "../../github.app.mjs";

export default {
  key: "github-list-gists-for-a-user",
  name: "List Gists for a User",
  description: "Lists public gists for the specified user. [See docs here](https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#list-gists-for-a-user)",
  version: "0.0.6",
  type: "action",
  props: {
    github,
    username: {
      label: "Username",
      description: "The username of the user whose gists you want to list",
      type: "string",
    },
    since: {
      label: "Since",
      description: "Only show notifications updated after the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const PER_PAGE = 100;
    const MAX_PAGES = 50;
    let page = 1;
    const data = [];

    while (true) {
      const res = await this.github.listGistsFromUser(this.username, {
        since: this.since,
        per_page: PER_PAGE,
        page,
      });

      if (!res || res.length === 0) {
        break;
      }
      data.push(...res);

      page++;
      if (page > MAX_PAGES) {
        break;
      }
    }

    if (data.length === 0) {
      $.export("$summary", `No gists found for user "${this.username}".`);
      return;
    }

    $.export("$summary", `Successfully fetched ${data.length} gist(s).`);
    return data;
  },
};
