import { ConfigurationError } from "@pipedream/platform";
import hyros from "../../hyros.app.mjs";

export default {
  key: "hyros-create-lead",
  name: "Create Lead",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new lead. [See the documentation](https://hyros.docs.apiary.io/#reference/0/leads/create-lead)",
  type: "action",
  props: {
    hyros,
    email: {
      propDefinition: [
        hyros,
        "email",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        hyros,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        hyros,
        "lastName",
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tags that will be applied to the lead.",
      optional: true,
    },
    leadIps: {
      propDefinition: [
        hyros,
        "leadIps",
      ],
      optional: true,
    },
    phoneNumbers: {
      propDefinition: [
        hyros,
        "phoneNumbers",
      ],
      optional: true,
    },
    stage: {
      propDefinition: [
        hyros,
        "leadStage",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      hyros,
      email,
      phoneNumbers,
      ...data
    } = this;

    let response;
    try {
      response = await hyros.createLead({
        $,
        data: {
          email,
          phoneNumbers,
          ...data,
        },
      });
    } catch ({ response }) {
      throw new ConfigurationError(response.data.message[0]);
    }

    $.export("$summary", `A new lead with Id: ${response.request_id} was successfully created!`);
    return response;
  },
};
