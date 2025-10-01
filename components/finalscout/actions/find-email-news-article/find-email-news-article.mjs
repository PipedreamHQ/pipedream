import finalscout from "../../finalscout.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "finalscout-find-email-news-article",
  name: "Find Email from News Article",
  description: "Finds an email address from a news article URL. [See the documentation](https://finalscout.com/public/doc/api.html#tag/Single-Find/paths/~1v1~1find~1author~1single/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    finalscout,
    url: {
      type: "string",
      label: "News Article URL",
      description: "The URL of the news article.",
    },
    tags: {
      propDefinition: [
        finalscout,
        "tags",
      ],
    },
    metadata: {
      propDefinition: [
        finalscout,
        "metadata",
      ],
    },
    webhookUrl: {
      propDefinition: [
        finalscout,
        "webhookUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.finalscout.findEmailViaNewsArticle({
      $,
      data: {
        person: {
          article_url: this.url,
        },
        tags: this.tags,
        metadata: parseObject(this.metadata),
        webhook_url: this.webhookUrl,
      },
    });
    $.export("$summary", "Successfully requested email for news article.");
    return response;
  },
};
