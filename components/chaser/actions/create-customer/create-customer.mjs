import chaser from "../../chaser.app.mjs";

export default {
  key: "chaser-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Chaser. [See the documentation](https://openapi.chaserhq.com/docs/static/index.html)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chaser,
    externalId: {
      type: "string",
      label: "External ID",
      description: "External ID of the customer",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Company name of the customer",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the customer",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the customer",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "Email address of the customer",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the customer",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description:
        "Additional parameters to send in the request. [See the documentation](https://openapi.chaserhq.com/docs/static/index.html) for available parameters. Values will be parsed as JSON where applicable.",
      optional: true,
    },
  },
  async run({ $ }) {
    let additionalOptions = Object.fromEntries(
      Object.entries(this.additionalOptions ?? {}).map(([
        key,
        value,
      ]) => {
        // optional JSON parsing
        try {
          return [
            key,
            JSON.parse(value),
          ];
        } catch (e) {
          return [
            key,
            value,
          ];
        }
      }),
    );

    const response = await this.chaser.createCustomer({
      $,
      data: {
        external_id: this.externalId,
        company_name: this.companyName,
        contact_first_name: this.firstName,
        contact_last_name: this.lastName,
        contact_email_address: this.emailAddress,
        phone_number: this.phoneNumber,
        ...additionalOptions,
      },
    });
    $.export("$summary", `Successfully created customer (ID: ${response.data.id})`);
    return response;
  },
};
