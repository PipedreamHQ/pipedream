import common from "../common/common.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { ERROR_MESSAGE } from "../common/errorMessage.mjs";

export default {
  ...common,
  key: "facebook_groups-create-post",
  name: "Create Post",
  description: "Create a new post in a group. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/group/feed)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    try {
      if (!this.message && !this.link) {
        throw new ConfigurationError("Either `link` or `message` must be supplied");
      }

      const response = await this.facebookGroups.createPost({
        groupId: this.group,
        data: {
          message: this.message,
          link: this.link,
        },
        $,
      });

      if (!response) {
        throw new ConfigurationError("Post creation was unsuccessful");
      }

      $.export("$summary", `Successfully created new post with ID ${response.id}.`);

      return response;
    } catch (error) {
      console.error(error);
      throw new Error(ERROR_MESSAGE);
    }
  },
};
