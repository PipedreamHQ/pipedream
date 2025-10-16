import instapaper from "../../instapaper.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "instapaper-add-url",
  name: "Add URL",
  description: "Adds a URL to an Instapaper account. [See the documentation](https://www.instapaper.com/api/simple)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    instapaper,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to add",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Optional, plain text, no HTML, UTF-8. If omitted or empty, Instapaper will crawl the URL to detect a title.",
      optional: true,
    },
    selection: {
      type: "string",
      label: "Selection",
      description: "Optional, plain text, no HTML, UTF-8. Will show up as the description under an item in the interface. Some clients use this to describe where it came from, such as the text of the source Twitter post when sending a link from a Twitter client.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response =  await axios($, {
      url: "https://www.instapaper.com/api/add",
      auth: {
        username: `${this.instapaper.$auth.username}`,
        password: `${this.instapaper.$auth.password}`,
      },
      params: {
        url: this.url,
        title: this.title,
        selection: this.selection,
      },
    });

    if (response) {
      $.export("$summary", `Successfully added link with URL ${this.url}.`);
    }

    return response;
  },
};
