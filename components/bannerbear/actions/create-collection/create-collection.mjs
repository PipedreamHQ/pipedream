import bannerbear from "../../bannerbear.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "bannerbear-create-collection",
  name: "Create Collection",
  description: "Generates multiple Images based on a Template Set. [See the docs here](https://developers.bannerbear.com/#post-v2-collections).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bannerbear,
    templateSet: {
      propDefinition: [
        bannerbear,
        "templateSetUid",
      ],
    },
    modifications: {
      propDefinition: [
        bannerbear,
        "modifications",
      ],
    },
    webhookUrl: {
      propDefinition: [
        bannerbear,
        "webhookUrl",
      ],
    },
    metadata: {
      propDefinition: [
        bannerbear,
        "metadata",
      ],
    },
    transparent: {
      type: "boolean",
      label: "Transparent",
      description: "Render the collection with a transparent background. Default is `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      templateSet,
      webhookUrl,
      metadata,
      transparent,
    } = this;

    const modifications = utils.parse(this.modifications);

    const response = await this.bannerbear.createCollection({
      $,
      data: {
        template_set: templateSet,
        modifications,
        webhook_url: webhookUrl,
        metadata,
        transparent,
      },
    });

    $.export("$summary", `Successfully created collection with UID ${response.uid}`);

    return response;
  },
};
