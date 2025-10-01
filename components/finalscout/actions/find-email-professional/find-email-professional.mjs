import finalscout from "../../finalscout.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "finalscout-find-email-professional",
  name: "Find Email from Professional",
  description: "Finds an email address from a person's name and company/domain. [See the documentation](https://finalscout.com/public/doc/api.html#tag/Single-Find/operation/email_finder_v1_person_email_finder_post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    finalscout,
    fullName: {
      type: "string",
      label: "Full Name",
      description: "The full name of the contact",
    },
    domain: {
      type: "string",
      label: "Company Domain",
      description: "The company domain for the contact",
    },
    deepVerify: {
      type: "boolean",
      label: "Deep Verify",
      description: "Whether to perform a deep verification of the email address",
      optional: true,
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
    const response = await this.finalscout.findEmailProfessional({
      $,
      data: {
        person: {
          full_name: this.fullName,
          domain: this.domain,
          deep_verify: this.deepVerify,
        },
        tags: this.tags,
        metadata: parseObject(this.metadata),
        webhook_url: this.webhookUrl,
      },
    });
    $.export("$summary", "Successfully requested email for professional.");
    return response;
  },
};
