import gloria_ai from "../../gloria_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gloria_ai-create-lead",
  name: "Create Lead",
  description: "Creates a new lead/contact in Gloria.ai. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gloria_ai: {
      type: "app",
      app: "gloria_ai",
    },
    leadName: {
      propDefinition: [
        "gloria_ai",
        "leadName",
      ],
    },
    phone: {
      propDefinition: [
        "gloria_ai",
        "phone",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        "gloria_ai",
        "email",
      ],
      optional: true,
    },
    initiation: {
      propDefinition: [
        "gloria_ai",
        "initiation",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        "gloria_ai",
        "tags",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        "gloria_ai",
        "status",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.gloria_ai.createContact();
    $.export("$summary", `Created lead ${this.leadName}`);
    return response;
  },
};
