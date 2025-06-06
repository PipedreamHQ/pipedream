import dolibarr from "../../dolibarr.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "dolibarr-create-thirdparty",
  name: "Create Third Party",
  description: "Create a new third party in Dolibarr.",
  version: "0.0.1",
  type: "action",
  props: {
    dolibarr,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the third party",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the third party",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the third party",
      optional: true,
    },
    steetAddress: {
      type: "string",
      label: "Street Address",
      description: "The street address of the user",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The zip code of the user",
      optional: true,
    },
    town: {
      type: "string",
      label: "Town",
      description: "The city or town of the user",
      optional: true,
    },
    additionalProperties: {
      propDefinition: [
        dolibarr,
        "additionalProperties",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dolibarr.createThirdParty({
      $,
      data: {
        name: this.name,
        email: this.email,
        phone: this.phone,
        address: this.steetAddress,
        zip: this.zip,
        town: this.town,
        ...parseObject(this.additionalProperties),
      },
    });
    $.export("$summary", `Successfully created third party ${response}`);
    return response;
  },
};
