import copper from "../../copper.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "copper-create-update-person",
  name: "Create or Update Person",
  description: "Creates a new person or updates an existing one based on email address. [See the documentation](https://developer.copper.com/people/create-a-new-person.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    copper,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the person. If email already exists, the person will be updated",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the contact. Required if creating a new person.",
      optional: true,
    },
    streetAddress: {
      type: "string",
      label: "Street Address",
      description: "Street address of the person",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City address of the person",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State address of the person",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal code of the person",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country of the person",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the person",
      optional: true,
    },
  },
  async run({ $ }) {
    let response;
    const hasAddress = this.streetAddress
      || this.city
      || this.state
      || this.postalCode
      || this.country;
    const data = {
      emails: [
        {
          email: this.email,
          category: "work",
        },
      ],
      name: this.name,
      address: hasAddress && {
        street: this.streetAddress,
        city: this.city,
        state: this.state,
        postal_code: this.postalCode,
        country: this.country,
      },
      phone_numbers: this.phone && [
        {
          number: this.phone,
          category: "work",
        },
      ],
    };

    // search for the person
    const person = await this.copper.listObjects({
      $,
      objectType: "people",
      data: {
        emails: [
          this.email,
        ],
      },
    });

    if (!person?.length && !this.name) {
      throw new ConfigurationError(`Person with email ${this.email} not found. Name is required for creating a new person.`);
    }

    // create person if not found
    if (!person?.length) {
      response = await this.copper.createPerson({
        $,
        data,
      });
    }
    // update person if found
    else {
      response = await this.copper.updatePerson({
        $,
        personId: person[0].id,
        data,
      });
    }

    $.export("$summary", `Successfully ${person?.length
      ? "updated"
      : "created"} person with ID: ${response.id}`);
    return response;
  },
};
