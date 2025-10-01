import finalscout from "../../finalscout.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "finalscout-find-email-linkedin",
  name: "Find Email from LinkedIn",
  description: "Finds an email address from a LinkedIn profile URL. [See the documentation](https://finalscout.com/public/doc/api.html#tag/Single-Find/paths/~1v1~1find~1linkedin~1single/post)",
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
      label: "LinkedIn Profile URL",
      description: "The URL of the LinkedIn profile.",
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
    enablePersonalEmail: {
      type: "boolean",
      label: "Enable Personal Email",
      description: "Whether to find personal emails (e.g. john@gmail.com) when a professional email address is not found",
      optional: true,
    },
    enableGenericEmail: {
      type: "boolean",
      label: "Enable Generic Email",
      description: "Whether to find generic emails (e.g. support@company.com) when a professional email address is not found",
      optional: true,
    },
    webhookUrl: {
      propDefinition: [
        finalscout,
        "webhookUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.finalscout.findEmailViaLinkedIn({
      $,
      data: {
        person: {
          linkedin_url: this.url,
        },
        tags: this.tags,
        metadata: parseObject(this.metadata),
        enable_personal_email: this.enablePersonalEmail,
        enable_generic_email: this.enableGenericEmail,
        webhook_url: this.webhookUrl,
      },
    });
    $.export("$summary", "Successfully requested email for LinkedIn profile.");
    return response;
  },
};
