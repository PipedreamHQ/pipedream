import printful from "../../printful.app.mjs";

export default {
  name: "Create Order",
  version: "0.0.5",
  key: "printful-create-order",
  description: "Creates an order. [See docs here](https://developers.printful.com/docs/#operation/createOrder)",
  type: "action",
  props: {
    printful,
    recipientName: {
      label: "Recipient Name",
      description: "The name of the recipient",
      type: "string",
    },
    recipientEmail: {
      label: "Recipient Email",
      description: "The email of the recipient",
      type: "string",
    },
    recipientCompany: {
      label: "Recipient Company",
      description: "The company of the recipient",
      type: "string",
    },
    recipientAddress: {
      label: "Recipient Address",
      description: "The address of the recipient",
      type: "string",
    },
    recipientCity: {
      label: "Recipient City",
      description: "The city of the recipient",
      type: "string",
    },
    recipientStateCode: {
      label: "Recipient State Code",
      description: "The state code of the recipient",
      type: "string",
    },
    recipientStateName: {
      label: "Recipient State Name",
      description: "The state name of the recipient",
      type: "string",
    },
    recipientCountryCode: {
      label: "Recipient Country Code",
      description: "The country code of the recipient",
      type: "string",
    },
    recipientCountryName: {
      label: "Recipient Country Name",
      description: "The country name of the recipient",
      type: "string",
    },
    recipientZIP: {
      label: "Recipient ZIP",
      description: "The ZIP of the recipient",
      type: "string",
    },
    recipientPhone: {
      label: "Recipient Phone",
      description: "The phone of the recipient",
      type: "string",
    },
    recipientTaxNumber: {
      label: "Recipient TAX number",
      description: "The TAX number of the recipient. This is `optional`, but in case of Brazil country this field becomes `required` and will be used as CPF/CNPJ number",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.printful.createOrder({
      $,
      data: {
        recipient: {
          name: this.recipientName,
          company: this.recipientCompany,
          address1: this.recipientAddress,
          city: this.recipientCity,
          state_code: this.recipientStateCode,
          state_name: this.recipientStateName,
          country_code: this.recipientCountryCode,
          country_name: this.recipientCountryName,
          zip: this.recipientZIP,
          phone: this.recipientPhone,
          email: this.recipientEmail,
          tex_number: this.recipientTaxNumber,
        },
        items: [
          {
            id: 286595942,
          },
        ],
      },
    });

    if (response) {
      $.export("$summary", `Successfully created company with id ${response.id}`);
    }

    return response;
  },
};
