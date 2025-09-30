import raisely from "../../raisely.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "raisely-create-or-update-user",
  name: "Create or Update User",
  description: "Create or update a user in Raisely. [See the documentation](https://developers.raisely.com/reference/postusers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    raisely,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the user",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the user",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the user",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address Line 1",
      description: "Line 1 of the address of the user",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address Line 2",
      description: "Line 2 of the address of the user",
      optional: true,
    },
    suburb: {
      type: "string",
      label: "Suburb",
      description: "The suburb/city of the user",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state/province of the user",
      optional: true,
    },
    postcode: {
      type: "string",
      label: "Postcode",
      description: "Postal Code of the user",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the user. Examples: `AU`, `GB`, `US`",
      optional: true,
    },
    merge: {
      type: "boolean",
      label: "Merge",
      description: "When set to `true`, instead of creating a new user, this request will update a user with a matching email identity with the data provided.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = pickBy({
      data: pickBy({
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        address1: this.address1,
        address2: this.address2,
        suburb: this.suburb,
        state: this.state,
        postcode: this.postcode,
        country: this.country,
      }),
      merge: this.merge,
    });

    const response = await this.raisely.createOrUpdateUser({
      data,
      $,
    });

    if (response?.data?.uuid) {
      $.export("$summary", `Successfully upserted user with ID ${response.data.uuid}`);
    }

    return response;
  },
};
