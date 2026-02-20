import { axios } from "@pipedream/platform";
import reddit from "../../reddit.app.mjs";

export default {
  type: "action",
  key: "reddit-submit-a-comment",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Submit a Comment",
  description: "Submit a new comment or reply to a message. [See the docs here](https://www.reddit.com/dev/api/#POST_api_comment)",
  props: {
    reddit,
    text: {
      type: "string",
      label: "Text",
      description: "The content of your comment.",
    },
    thingId: {
      propDefinition: [
        reddit,
        "thingId",
      ],
    },
  },
  async run ({ $ }) {
    const data = {
      api_type: "json",
      thing_id: this.thingId,
      text: this.text,
    };

    const res = await axios($, this.reddit._getAxiosParams({
      method: "POST",
      path: "/api/comment",
      data,
    }));

    this.reddit.checkErrors(res);
    $.export("$summary", "Your comment has been successfully submitted");
    return res?.json?.data?.things?.[0] || res;
  },
};
