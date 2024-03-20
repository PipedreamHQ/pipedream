import slack from "../../slack.app.mjs";

export default {
  key: "slack-get-direct-file-link",
  name: "Get Direct File Link",
  description: "Return a direct file link to a publicly shared file in Slack.",
  version: "0.0.2",
  type: "action",
  props: {
    slack,
    file: {
      propDefinition: [
        slack,
        "file",
      ],
    },
  },
  async run({ $ }) {
    const { file } = await this.slack.sdk().files.info({
      file: this.file,
    });

    const permalinkPublic = file.permalink_public;
    const permalink = file.permalink;

    const link = `${permalink}?pub_secret=${(permalinkPublic).split("-").pop()}`;
    $.export("$summary", `Successfully retrieved direct file link: ${link}`);
    return link;
  },
};
