import { ConfigurationError } from "@pipedream/platform";
import hyros from "../../hyros.app.mjs";

export default {
  key: "hyros-create-call",
  name: "Create Call",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new call. [See the documentation](https://hyros.docs.apiary.io/#reference/0/calls/create)",
  type: "action",
  props: {
    hyros,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the call.",
    },
    email: {
      propDefinition: [
        hyros,
        "email",
      ],
      description: "Email associated with the lead that made the call.",
      optional: true,
    },
    firstName: {
      propDefinition: [
        hyros,
        "firstName",
      ],
      description: "First name of the lead that made the call.",
      optional: true,
    },
    lastName: {
      propDefinition: [
        hyros,
        "lastName",
      ],
      description: "Last name of the lead that made the call.",
      optional: true,
    },
    leadIps: {
      propDefinition: [
        hyros,
        "leadIps",
      ],
      description: "IPs of the customer that made the call. Will be used on the Ad attributing process.",
      optional: true,
    },
    phoneNumbers: {
      propDefinition: [
        hyros,
        "phoneNumbers",
      ],
      description: "Phone numbers of the lead that made the call. Will be used on the Ad attributing process.",
      optional: true,
    },
    id: {
      type: "string",
      label: "Id",
      description: "Identifier by which the call will be grouped. A default id will be assigned if it is not included.",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date on which the transaction was processed. The date must be written in accordance with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). Format: YYYY-MM-DDThh:mm:ss",
      optional: true,
    },
    qualified: {
      type: "boolean",
      label: "Qualified",
      description: "A flag that indicates if the call should be marked as unqualified. If it's not present the call is created as qualified.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      hyros,
      ...data
    } = this;

    let response;
    try {
      response = await hyros.createCall({
        $,
        data,
      });
    } catch ({ response }) {
      throw new ConfigurationError(response.data.message[0]);
    }

    $.export("$summary", `A new call with Id: ${response.request_id} was successfully created!`);
    return response;
  },
};
