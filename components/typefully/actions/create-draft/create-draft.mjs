import typefully from "../../typefully.app.mjs";

export default {
  key: "typefully-create-draft",
  name: "Create Draft",
  description: "Creates a new draft in Typefully. [See the documentation](https://support.typefully.com/en/articles/8718287-typefully-api#h_df59629cbf)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    typefully,
    content: {
      propDefinition: [
        typefully,
        "content",
      ],
    },
    threadify: {
      propDefinition: [
        typefully,
        "threadify",
      ],
      optional: true,
    },
    share: {
      propDefinition: [
        typefully,
        "share",
      ],
      optional: true,
    },
    autoRetweetEnabled: {
      propDefinition: [
        typefully,
        "autoRetweetEnabled",
      ],
      optional: true,
    },
    autoPlugEnabled: {
      propDefinition: [
        typefully,
        "autoPlugEnabled",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.typefully.createDraft({
      $,
      data: {
        content: this.content,
        threadify: this.threadify,
        share: this.share,
        auto_retweet_enabled: this.autoRetweetEnabled,
        auto_plug_enabled: this.autoPlugEnabled,
      },
    });

    $.export("$summary", `Created draft with ID: ${response.id}.`);
    return response;
  },
};
