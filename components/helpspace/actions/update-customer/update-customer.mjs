import helpspace from "../../helpspace.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "helpspace-update-customer",
  name: "Update Customer",
  description: "Updates a customer's details in Helpspace. [See the documentation](https://documentation.helpspace.com/api-customers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helpspace,
    customerId: {
      propDefinition: [
        helpspace,
        "customerId",
      ],
    },
    name: {
      propDefinition: [
        helpspace,
        "name",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        helpspace,
        "email",
      ],
      optional: true,
    },
    jobTitle: {
      propDefinition: [
        helpspace,
        "jobTitle",
      ],
    },
    address: {
      propDefinition: [
        helpspace,
        "address",
      ],
    },
    city: {
      propDefinition: [
        helpspace,
        "city",
      ],
    },
    state: {
      propDefinition: [
        helpspace,
        "state",
      ],
    },
    postalCode: {
      propDefinition: [
        helpspace,
        "postalCode",
      ],
    },
    country: {
      propDefinition: [
        helpspace,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.helpspace.updateCustomer({
      $,
      customerId: this.customerId,
      data: utils.cleanObject({
        name: this.name,
        email: this.email,
        job_title: this.jobTitle,
        address: this.address,
        city: this.city,
        state: this.state,
        postal_code: this.postalCode,
        country: this.country,
      }),
    });
    $.export("$summary", `Updated customer ${data.id}`);
    return data;
  },
};
