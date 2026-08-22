import katto from "../../katto.app.mjs";

export default {
  key: "katto-create-clip-job",
  name: "Create Clip Job",
  description:
    "Turn a long video, podcast or Twitch VOD into scored, captioned 9:16 clips. [See the documentation](https://katto.tech/docs/api)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    katto,
    url: {
      type: "string",
      label: "Video URL",
      description:
        "A YouTube, Twitch, Vimeo, Rumble, Zoom or Dailymotion URL to clip.",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description:
        "Optional. A signed (HMAC-SHA256) completion callback is delivered here instead of polling.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!/^https?:\/\//i.test(this.url)) {
      throw new Error("Invalid Video URL. It must start with http:// or https://.");
    }
    const data = { url: this.url };
    if (this.webhookUrl) {
      data.webhook_url = this.webhookUrl;
    }
    const response = await this.katto.createJob({
      $,
      data,
    });
    $.export("$summary", `Created clip job \`${response.id ?? ""}\``);
    return response;
  },
};
