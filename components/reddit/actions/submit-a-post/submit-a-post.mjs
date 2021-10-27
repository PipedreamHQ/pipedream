import reddit from "../../reddit.app.mjs";
import axios from "axios";
import get from "lodash/get.js";

export default {
  type: "action",
  key: "reddit-action-submit-a-post",
  version: "0.2.4",
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
      description: "The content your post. Applicable for `self`",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL to be shared in your post. Applicable for `image`, `video`",
      optional: true,
    },
    videoPosterUrl: {
      type: "string",
      label: "Video Poster URL",
      description: "The URL to be shared in your post. Applicable for `image`, `video`",
      optional: true,
    },
    spoiler: {
      type: "boolean",
      label: "Spoiler",
      description: "Default to `false`. Flag it as `true` if your post contains some spoiler",
      optional: true,
    },
    sendReplies: {
      type: "boolean",
      label: "Send Replies",
      description: "Default to `true`. If `true`, you will receive email notification if your post has some reply",
      optional: true,
    },
    nsfw: {
      type: "boolean",
      label: "Not Safe For Work",
      description: "Default to `false`. If your post is not safe for work (+18), please, set `true` for this field.",
      optional: true,
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
      spoiler: this.spoiler,
      sendreplies: this.sendReplies,
      nsfw: this.nsfw,
      url: this.url,
      text: this.text,
      video_poster_url: this.videoPosterUrl,
    };

    //console.log(data);

    try {
      const res = await axios(this.reddit._getAxiosParams({
        method: "POST",
        path: "/api/submit",
        data,
      }));

      // Find rate limit error
      const rateLimitMessage = get(
        JSON.stringify(res.data).match(/(\S*\d+\S* minutes before trying agai)\w/),
        "[0]",
      );

      if (rateLimitMessage) {
        return rateLimitMessage;
        // throw new Error(`Reddit rate-limit: Please wait ${rateLimitMessage}.`);
      }

      // console.log(JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
};

