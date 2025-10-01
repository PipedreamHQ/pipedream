import { parseObject } from "../../common/utils.mjs";
import invisionCommunity from "../../invision_community.app.mjs";

export default {
  key: "invision_community-create-forum-topic",
  name: "Create Forum Topic",
  description: "Creates a new forum topic. [See the documentation](https://invisioncommunity.com/developers/rest-api?endpoint=forums/topics/postindex)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    invisionCommunity,
    forumId: {
      propDefinition: [
        invisionCommunity,
        "forumId",
      ],
    },
    title: {
      propDefinition: [
        invisionCommunity,
        "title",
      ],
    },
    postContent: {
      propDefinition: [
        invisionCommunity,
        "postContent",
      ],
    },
    author: {
      propDefinition: [
        invisionCommunity,
        "authorId",
      ],
    },
    tags: {
      propDefinition: [
        invisionCommunity,
        "tags",
      ],
      optional: true,
    },
    openTime: {
      propDefinition: [
        invisionCommunity,
        "openTime",
      ],
      optional: true,
    },
    closeTime: {
      propDefinition: [
        invisionCommunity,
        "closeTime",
      ],
      optional: true,
    },
    hidden: {
      propDefinition: [
        invisionCommunity,
        "hidden",
      ],
    },
    pinned: {
      propDefinition: [
        invisionCommunity,
        "pinned",
      ],
    },
    featured: {
      propDefinition: [
        invisionCommunity,
        "featured",
      ],
    },
  },
  async run({ $ }) {

    const response = await this.invisionCommunity.createForumTopic({
      $,
      params: {
        forum: this.forumId,
        title: this.title,
        post: this.postContent,
        author: this.author,
        tags: parseObject(this.tags)?.join(","),
        open_time: this.openTime,
        close_time: this.closeTime,
        hidden: +this.hidden,
        pinned: +this.pinned,
        featured: +this.featured,
      },
    });
    $.export("$summary", `Successfully created forum topic with title "${this.title}"`);
    return response;
  },
};
