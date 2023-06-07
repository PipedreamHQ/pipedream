import common from "../common/common.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "facebook_groups-create-post",
  name: "Create Post",
  description: "Create a new post in a group. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/group/feed)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    message: {
      type: "string",
      label: "Message",
      description: "The main body of the post, otherwise called the status message. Either `link` or `message` must be supplied.",
      optional: true,
    },
    link: {
      type: "string",
      label: "Link",
      description: "The URL of a link to attach to the post. Either link or message must be supplied.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.message && !this.link) {
      throw new ConfigurationError("Either `link` or `message` must be supplied");
    }

    const response = await this.facebookGroups.createPost({
      data: {
        message: this.message,
        link: this.link,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created new post with ID ${response.id}.`);
    }

    return response;
  },
};
