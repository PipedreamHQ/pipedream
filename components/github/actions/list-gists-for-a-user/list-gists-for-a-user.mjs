import { ConfigurationError } from "@pipedream/platform";
import github from "../../github.app.mjs";

export default {
  key: "github-list-gists-for-a-user",
  name: "List Gists for a User",
  description: "Lists public gists for the specified user. [See the documentation](https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#list-gists-for-a-user)",
  version: "0.1.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github: {
      ...github,
      reloadProps: true,
    },
    since: {
      label: "Filter by Timestamp",
      description: "Only show notifications updated since the given time. This should be a timestamp in ISO 8601 format, e.g. `2018-05-16T09:30:10Z` or [another standard date/time format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format).",
      type: "string",
      optional: true,
    },
  },
  async additionalProps() {
    const { login } = await this.github.getAuthenticatedUser();
    return {
      username: {
        label: "Username",
        description: "The username of the user whose gists you want to list",
        type: "string",
        default: login,
      },
    };
  },
  async run({ $ }) {
    const PER_PAGE = 100;
    const MAX_PAGES = 50;
    let page = 1;
    const data = [];

    const date = this.since && new Date(this.since);
    if (date && isNaN(date.valueOf())) {
      throw new ConfigurationError("Invalid date string provided");
    }

    const since = date?.toISOString();

    while (true) {
      const res = await this.github.listGistsFromUser(this.username, {
        since,
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
      $.export("$summary", `No gists found for user "${this.username}"`);
      return;
    }

    $.export("$summary", `Successfully fetched ${data.length} gist(s)`);
    return data;
  },
};
