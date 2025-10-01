import common from "../common/common.mjs";
import { ERROR_MESSAGE } from "../common/errorMessage.mjs";

export default {
  ...common,
  key: "facebook_groups-get-post",
  name: "Get Post",
  description: "Retrieves post in a group. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/post/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    post: {
      propDefinition: [
        common.props.facebookGroups,
        "post",
        (c) => ({
          groupId: c.group,
        }),
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.facebookGroups.getPost({
        postId: this.post,
        $,
      });

      $.export("$summary", `Successfully retrieved post with ID ${this.post}`);

      return response;
    } catch (error) {
      console.error(error);
      throw new Error(ERROR_MESSAGE);
    }
  },
};
