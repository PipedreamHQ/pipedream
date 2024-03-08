import supercast from "../../supercast.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "supercast-create-episode",
  name: "Create an Episode",
  description: "Creates a new episode on Supercast. [See the documentation](https://supercast.readme.io/reference/postepisodes)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    supercast,
    channelSubdomain: {
      propDefinition: [
        supercast,
        "channelSubdomain",
      ],
    },
    title: {
      propDefinition: [
        supercast,
        "title",
      ],
    },
    body: {
      propDefinition: [
        supercast,
        "body",
      ],
    },
    summary: {
      propDefinition: [
        supercast,
        "summary",
      ],
    },
    explicit: {
      propDefinition: [
        supercast,
        "explicit",
      ],
    },
    language: {
      propDefinition: [
        supercast,
        "language",
      ],
    },
    publishedAt: {
      propDefinition: [
        supercast,
        "publishedAt",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.supercast.createEpisode({
      channelSubdomain: this.channelSubdomain,
      title: this.title,
      body: this.body,
      summary: this.summary,
      explicit: this.explicit,
      language: this.language,
      publishedAt: this.publishedAt,
    });

    $.export("$summary", `Successfully created episode titled "${this.title}"`);
    return response;
  },
};
