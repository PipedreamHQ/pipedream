import proabono from "../../proabono.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "proabono-create-customer",
  name: "Create or Update a Customer",
  description: "Creates a new customer or updates an existing one in the ProAbono system. [See the documentation](https://docs.proabono.com/api/#create-a-customer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    proabono,
    customerId: {
      propDefinition: [
        proabono,
        "customerId",
      ],
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of your customer",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Full name of your customer",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language of your customer (By Default, ProAbono will set the language of the segment)",
      options: constants.LANGUAGES,
      optional: true,
    },
    metadata: {
      propDefinition: [
        proabono,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.proabono.createOrUpdateCustomer({
      $,
      data: {
        ReferenceCustomer: this.customerId,
        Email: this.email,
        Name: this.name,
        Language: this.language,
        Metadata: this.metadata,
      },
    });
    $.export("$summary", `Successfully ${this.customerId
      ? "updated"
      : "created"} customer with ID: ${response.Id}`);
    return response;
  },
};
