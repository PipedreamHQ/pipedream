import gloriaAi from "../../gloria_ai.app.mjs";

export default {
  key: "gloria_ai-create-lead",
  name: "Create Lead",
  description: "Creates a new lead/contact in Gloria.ai. [See the documentation](https://api.iamgloria.com/api).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gloriaAi,
    leadName: {
      propDefinition: [
        gloriaAi,
        "leadName",
      ],
    },
    phone: {
      propDefinition: [
        gloriaAi,
        "phone",
      ],
    },
    email: {
      propDefinition: [
        gloriaAi,
        "email",
      ],
    },
    initiation: {
      propDefinition: [
        gloriaAi,
        "initiation",
      ],
    },
    tags: {
      propDefinition: [
        gloriaAi,
        "tags",
      ],
    },
    status: {
      propDefinition: [
        gloriaAi,
        "status",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gloriaAi.createContact({
      $,
      data: {
        tenantId: this.gloriaAi.$auth.tenant_id,
        createdAt: Date.now(),
        name: [
          this.leadName,
        ],
        phone: this.phone && [
          this.phone,
        ],
        email: this.email && [
          this.email,
        ],
        origin: "api",
        initiation: this.initiation,
        tags: this.tags,
        status: this.status,
      },
    });
    $.export("$summary", `Successfully created lead with ID: ${response.id}`);
    return response;
  },
};
