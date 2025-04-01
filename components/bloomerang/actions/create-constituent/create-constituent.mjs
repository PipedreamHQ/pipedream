import bloomerang from "../../bloomerang.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bloomerang-create-constituent",
  name: "Create Constituent",
  description: "Creates a new constituent in Bloomerang. [See the documentation](https://bloomerang.co/product/integrations-data-management/api/rest-api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bloomerang,
    constituentType: {
      propDefinition: [
        bloomerang,
        "constituentType",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the constituent",
    },
    contactDetails: {
      type: "string",
      label: "Contact Details",
      description: "Contact details of the constituent in JSON format",
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the constituent",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for the constituent",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Custom fields for the constituent in JSON format",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      constituentType: this.constituentType,
      name: this.name,
      contactDetails: JSON.parse(this.contactDetails),
      address: this.address
        ? JSON.parse(this.address)
        : undefined,
      tags: this.tags,
      customFields: this.customFields
        ? this.customFields.map(JSON.parse)
        : undefined,
    };

    const response = await axios($, {
      method: "POST",
      url: `${this.bloomerang._baseUrl()}/constituents`,
      headers: {
        Authorization: `Bearer ${this.bloomerang.$auth.api_key}`,
      },
      data,
    });

    $.export("$summary", `Successfully created constituent with ID ${response.id}`);
    return response;
  },
};
