import parma from "../../parma.app.mjs";

export default {
  key: "parma-find-relationship",
  name: "Find Relationship",
  description: "Searches for an existing relationship in Parma. [See the documentation](https://developers.parma.ai/api-docs/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    parma,
    name: {
      propDefinition: [
        parma,
        "name",
      ],
      optional: true,
    },
    type: {
      propDefinition: [
        parma,
        "relationshipType",
      ],
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the relationship.",
      optional: true,
    },
    whatsapp: {
      type: "string",
      label: "Whatsapp",
      description: "The whatsapp of the relationship.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone of the relationship.",
      optional: true,
    },
    sms: {
      type: "string",
      label: "SMS",
      description: "The SMS of the relationship.",
      optional: true,
    },
    telegram: {
      type: "string",
      label: "Telegram",
      description: "The telegram of the relationship.",
      optional: true,
    },
    twitter: {
      type: "string",
      label: "Twitter",
      description: "The twitter of the relationship.",
      optional: true,
    },
    instagram: {
      type: "string",
      label: "Instagram",
      description: "The instagram of the relationship.",
      optional: true,
    },
    linkedin: {
      type: "string",
      label: "LinkedIn",
      description: "The linkedin of the relationship.",
      optional: true,
    },
    schedulinglink: {
      type: "string",
      label: "Scheduling Link",
      description: "The scheduling link of the relationship.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.parma.listRelationships({
      $,
      data: {
        name: this.name,
        type: this.type,
        email: this.email,
        whatsapp: this.whatsapp,
        phone: this.phone,
        sms: this.sms,
        telegram: this.telegram,
        twitter: this.twitter,
        instagram: this.instagram,
        linkedin: this.linkedin,
        schedulinglink: this.schedulinglink,
      },
    });
    $.export("$summary", `Successfully fetched ${response.data.length} relationship${response.data.length > 1
      ? "s"
      : ""}`);
    return response;
  },
};
