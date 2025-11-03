import app from "../../app/pikaso.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Screenshot Tweet",
  description: "With the Pikaso API you can automate creating screenshots from tweets. [See the docs](https://pikaso.me/api) for more information",
  key: "pikaso-screenshot-tweet",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    tweetId: {
      propDefinition: [
        app,
        "tweetId",
      ],
    },
    layout: {
      propDefinition: [
        app,
        "layout",
      ],
    },
    theme: {
      propDefinition: [
        app,
        "theme",
      ],
    },
    size: {
      propDefinition: [
        app,
        "size",
      ],
    },
  },
  async run({ $ }) {
    const tweetId = this.tweetId?.split("/").pop();
    const params = {
      tweet_id: tweetId,
      layout: this.layout,
      theme: this.theme,
      size: this.size,
    };
    const response = await this.app.screenshotTweet($, params);
    $.export("$summary", `Successfully took a screenshot from tweet with id: ${tweetId}`);
    const encodedResponse = Buffer.from(response, "binary").toString("base64");
    return `data:image/png;base64,${encodedResponse}`;
  },
});
