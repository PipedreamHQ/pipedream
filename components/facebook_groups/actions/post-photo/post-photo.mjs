import common from "../common/common.mjs";
import { ERROR_MESSAGE } from "../common/errorMessage.mjs";

export default {
  ...common,
  key: "facebook_groups-post-photo",
  name: "Post Photo",
  description: "Post a photo in a group. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/group/photos)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of a photo to post",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.facebookGroups.postPhoto({
        groupId: this.group,
        data: {
          url: this.url,
        },
        $,
      });

      if (response) {
        $.export("$summary", `Successfully posted photo with ID ${response.id}.`);
      }

      return response;
    } catch (error) {
      console.error(error);
      throw new Error(ERROR_MESSAGE);
    }
  },
};
