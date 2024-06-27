import invisionCommunity from "../../invision_community.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "invision_community-create-forum-topic",
  name: "Create Forum Topic",
  description: "Creates a new forum topic. [See the documentation](https://invisioncommunity.com/developers/rest-api?endpoint=forums/topics/postindex)",
  version: "0.0.{{ts}}",
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
        "author",
        {
          optional: true,
        },
      ],
    },
    authorName: {
      propDefinition: [
        invisionCommunity,
        "authorName",
        {
          optional: true,
        },
      ],
    },
    tags: {
      propDefinition: [
        invisionCommunity,
        "tags",
        {
          optional: true,
        },
      ],
    },
    openTime: {
      propDefinition: [
        invisionCommunity,
        "openTime",
        {
          optional: true,
        },
      ],
    },
    closeTime: {
      propDefinition: [
        invisionCommunity,
        "closeTime",
        {
          optional: true,
        },
      ],
    },
    hidden: {
      propDefinition: [
        invisionCommunity,
        "hidden",
        {
          optional: true,
        },
      ],
    },
    pinned: {
      propDefinition: [
        invisionCommunity,
        "pinned",
        {
          optional: true,
        },
      ],
    },
    featured: {
      propDefinition: [
        invisionCommunity,
        "featured",
        {
          optional: true,
        },
      ],
    },
  },
  async run({ $ }) {
    const payload = {
      forum: this.forumId,
      title: this.title,
      post: this.postContent,
      author: this.author,
      author_name: this.authorName,
      tags: this.tags,
      open_time: this.openTime,
      close_time: this.closeTime,
      hidden: this.hidden,
      pinned: this.pinned,
      featured: this.featured,
    };

    const response = await this.invisionCommunity.createForumTopic(payload);
    $.export("$summary", `Successfully created forum topic with title "${this.title}"`);
    return response;
  },
};
