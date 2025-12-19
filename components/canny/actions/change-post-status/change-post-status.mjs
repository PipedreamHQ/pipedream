import canny from "../../canny.app.mjs";
import { POST_STATUSES } from "../../common/constants.mjs";

export default {
  key: "canny-change-post-status",
  name: "Change Post Status",
  description: "Change the status of a post. [See the documentation](https://developers.canny.io/api-reference#change_post_status)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    canny,
    boardId: {
      propDefinition: [
        canny,
        "boardId",
      ],
      optional: true,
    },
    postId: {
      propDefinition: [
        canny,
        "postId",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
    },
    changerId: {
      propDefinition: [
        canny,
        "userId",
      ],
      label: "Changer ID",
      description: "The identifier of the admin to record as having changed the post's status",
    },
    shouldNotifyVoters: {
      type: "boolean",
      label: "Should Notify Voters",
      description: "Whether or not to notify non-admin voters of the status change",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The new status of the post",
      options: POST_STATUSES,
    },
  },
  async run({ $ }) {
    const response = await this.canny.updatePostStatus({
      $,
      data: {
        postID: this.postId,
        changerID: this.changerId,
        shouldNotifyVoters: this.shouldNotifyVoters,
        status: this.status,
      },
    });
    $.export("$summary", `Successfully changed the status of post ${this.postId} to ${this.status}`);
    return response;
  },
};
