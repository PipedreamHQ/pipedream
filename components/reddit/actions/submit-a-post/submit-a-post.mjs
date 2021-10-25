import reddit from "../../reddit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  type: "action",
  key: "reddit-action-submit-a-post",
  version: "0.1.3",
  name: "Submit a Post",
  description: "Create a post to a subreddit. [See the docs here](https://www.reddit.com/dev/api/#POST_api_submit)",
  props: {
    reddit,
    subRedditName: {
      propDefinition: [
        reddit,
        "subreddit",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Post title",
    },
    kind: {
      type: "string",
      label: "Kind",
      description: "Post type",
      options: [
        "link",
        "self",
        "image",
        "video",
        "videogif",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text of your post",
    },
    flair: {
      propDefinition: [
        reddit,
        "flair",
        (c) => ({
          subRedditName: c.subRedditName,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const data = {
      sr: this.subRedditName,
      kind: this.kind,
      title: this.title,
      text: this.text,
    };
    return axios($, this.reddit._getAxiosParams({
      method: "POST",
      path: "/api/submit",
      data,
    }));
  },
};

