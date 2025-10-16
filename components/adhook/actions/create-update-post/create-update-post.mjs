import adhook from "../../adhook.app.mjs";
import constants from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "adhook-create-update-post",
  name: "Create or Update Post",
  description: "Adds a new post or modifies an existing post in Adhook. [See the documentation](https://app.adhook.io/api-doc/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    adhook,
    postId: {
      propDefinition: [
        adhook,
        "postId",
      ],
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the post",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the post",
      optional: true,
      options: constants.TYPE_OPTIONS,
    },
    subtenantId: {
      propDefinition: [
        adhook,
        "subtenantId",
      ],
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the post",
      optional: true,
      options: constants.STATUS_OPTIONS,
    },
    tags: {
      propDefinition: [
        adhook,
        "tags",
      ],
      optional: true,
    },
    topics: {
      propDefinition: [
        adhook,
        "topics",
      ],
      optional: true,
    },
    schedule: {
      type: "string",
      label: "Schedule",
      description: "Whether you want to schedule or publish the post",
      optional: true,
      options: constants.SCHEDULE_OPTIONS,
    },
    message: {
      type: "string",
      label: "Message",
      description: "A message to send with the post",
      optional: true,
    },
    promotionType: {
      type: "string",
      label: "Promotion Type",
      description: "The type of the promotion in the post",
      optional: true,
      options: constants.PROMOTION_TYPE_OPTIONS,
    },
    campaignName: {
      type: "string",
      label: "Campaign Name",
      description: "The name of the campaign",
      optional: true,
    },
    externalId: {
      propDefinition: [
        adhook,
        "externalId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      adhook,
      postId,
      tags,
      topics,
      ...data
    } = this;

    let postData = {};

    if (postId) {
      const post = await adhook.getPost({
        postId,
      });
      postData = post;
    }

    postData = {
      ...postData,
      ...data,
      tags: parseObject(tags) || postData.tags,
      topics: parseObject(topics)?.map((topic) => ({
        name: topic,
      })) || postData.topics,
    };

    const fn = postId
      ? adhook.updatePost
      : adhook.createPost;

    const response = await fn({
      $,
      postId,
      data: postData,
    });

    $.export("$summary", `Successfully ${postId
      ? "updated"
      : "created"} post`);

    return response;
  },
};
