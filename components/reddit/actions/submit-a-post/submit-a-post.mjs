import { axios } from "@pipedream/platform";
import tzs from "../../pytz-timezones.mjs";
import reddit from "../../reddit.app.mjs";

export default {
  type: "action",
  key: "reddit-submit-a-post",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Submit a Post",
  description: "Create a post to a subreddit. [See the docs here](https://www.reddit.com/dev/api/#POST_api_submit)",
  props: {
    reddit,
    subreddit: {
      propDefinition: [
        reddit,
        "subreddit",
      ],
      description: "Type to search for a subreddit or enter a subreddit display name as a custom expression (for example, `happycowgifs`).",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of your post",
    },
    kind: {
      type: "string",
      label: "Kind",
      description: "Post type",
      options: [
        "link",
        "self",
        "image",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The content your post. Applicable if **Kind** is `self`",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL to be shared in your post. Applicable if **Kind** is `image` or `link`",
      optional: true,
    },
    spoiler: {
      type: "boolean",
      label: "Spoiler",
      description: "Default to `false`. Flag it as `true` if your post contains some spoiler.",
      optional: true,
    },
    sendReplies: {
      type: "boolean",
      label: "Send Replies",
      description: "Default to `true`. If `true`, you will receive email notification if your post has some reply.",
      optional: true,
    },
    nsfw: {
      type: "boolean",
      label: "Not Safe For Work",
      description: "Default to `false`. If your post is not safe for work (+18), please, set `true` for this field.",
      optional: true,
    },
    eventStart: {
      type: "string",
      label: "Event Start",
      description: "(beta) a datetime string e.g. `2018-09-11T12:00:00`",
      optional: true,
    },
    eventEnd: {
      type: "string",
      label: "Event End",
      description: "(beta) a datetime string e.g. `2018-09-11T12:00:00`",
      optional: true,
    },
    eventTz: {
      type: "string",
      label: "Event Timezone",
      description: "(beta) a [pytz](https://pypi.org/project/pytz/) timezone e.g. `America/Los_Angeles`",
      optional: true,
      options: tzs,
    },
  },
  async run ({ $ }) {
    const data = {
      api_type: "json",
      sr: this.subreddit.value || this.subreddit,
      kind: this.kind,
      title: this.title,
      spoiler: this.spoiler,
      sendreplies: this.sendReplies,
      nsfw: this.nsfw,
      url: this.url,
      text: this.text,
      event_start: this.eventStart,
      event_end: this.eventEnd,
      event_tz: this.eventTz,
    };

    const res = await axios($, this.reddit._getAxiosParams({
      method: "POST",
      path: "/api/submit",
      data,
    }));

    this.reddit.checkErrors(res);

    $.export("$summary", `The post "${this.title}" has been successfully created into "${this.subreddit?.label || this.subreddit}" subreddit`);
    return res?.json?.data || res;
  },
};
