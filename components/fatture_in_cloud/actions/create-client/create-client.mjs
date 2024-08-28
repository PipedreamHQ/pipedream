import fattureInCloud from "../../fatture_in_cloud.app.mjs";

export default {
  key: "fatture_in_cloud-create-client",
  name: "Create Client",
  description: "Creates a new client. [See the documentation](https://developers.fattureincloud.it/api-reference)",
  version: "0.0.1",
  type: "action",
  props: {
    fattureInCloud,
    companyId: {
      propDefinition: [
        fattureInCloud,
        "companyId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the client",
    },
    code: {
      type: "string",
      label: "Code",
      description: "The code of the client",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the client",
      options: [
        "company",
        "person",
        "pa",
        "condo",
      ],
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the client",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the client",
      optional: true,
    },
    vatNumber: {
      type: "string",
      label: "VAT Number",
      description: "The VAT number of the client",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the client",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the client",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.fattureInCloud.createClient({
      $,
      companyId: this.companyId,
      data: {
        data: {
          name: this.name,
          code: this.code,
          type: this.type,
          first_name: this.firstName,
          last_name: this.lastName,
          vat_number: this.vatNumber,
          email: this.email,
          phone: this.phone,
        },
      },
    });

    $.export("$summary", `Successfully created client with Id: ${response.data.id}`);
    return response;
  },
};
