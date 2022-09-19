// legacy_hash_id: a_oVi3lO
import { axios } from "@pipedream/platform";

export default {
  key: "instapaper-add-url",
  name: "Add URL",
  description: "Adding URLs to an Instapaper account",
  version: "0.1.1",
  type: "action",
  props: {
    instapaper: {
      type: "app",
      app: "instapaper",
    },
    url: {
      type: "string",
    },
    sitle: {
      type: "string",
      description: "Optional, plain text, no HTML, UTF-8. If omitted or empty, Instapaper will crawl the URL to detect a title.",
      optional: true,
    },
    selection: {
      type: "string",
      description: "Optional, plain text, no HTML, UTF-8. Will show up as the description under an item in the interface. Some clients use this to describe where it came from, such as the text of the source Twitter post when sending a link from a Twitter client.",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://www.instapaper.com/api/authenticate",
      auth: {
        username: `${this.instapaper.$auth.username}`,
        password: `${this.instapaper.$auth.password}`,
        params: {
          url: this.url,
          title: this.sitle,
          selection: this.selection,
        },
      },
    });
  },
};
