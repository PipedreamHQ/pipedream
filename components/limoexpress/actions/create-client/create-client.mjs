import { TYPE_OPTIONS } from "../../common/constants.mjs";
import { throwError } from "../../common/utils.mjs";
import limoexpress from "../../limoexpress.app.mjs";

export default {
  key: "limoexpress-create-client",
  name: "Create Client",
  description: "Creates a new client with specified details. [See the documentation](https://api.limoexpress.me/api/docs/v1#/Clients/createAOrganisationClient)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    limoexpress,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the client.",
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the client.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone of the client.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the client.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the client.",
      options: TYPE_OPTIONS,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Active flag is the class active or not.",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.limoexpress.createClient({
        $,
        data: {
          name: this.name,
          address: this.address,
          phone: this.phone,
          email: this.email,
          type: this.type,
          active: this.active,
        },
      });

      $.export("$summary", `Successfully created client with ID ${response.data.id}`);
      return response;
    } catch ({ response }) {
      throwError(response);
    }
  },
};
