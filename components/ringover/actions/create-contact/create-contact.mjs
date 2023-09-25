import { axios } from "@pipedream/platform";
import ringover from "../../ringover.app.mjs";

export default {
  key: "ringover-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Ringover. [See the documentation](https://developer.ringover.com/?_ga=2.63646317.316145444.1695076986-652152469.1694643800#tag/contacts/paths/~1contacts/post)",
  version: "0.0.1695076986",
  type: "action",
  props: {
    ringover,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "Mobile number of the contact",
      optional: true,
    },
    position: {
      type: "string",
      label: "Position",
      description: "Position of the contact",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company of the contact",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Any notes for the contact",
      optional: true,
    },
  },
  methods: {
    async createContact({
      $, ...params
    }) {
      return axios($, {
        method: "POST",
        url: `https://${this.ringover.$auth.server}.ringover.com/v2/contacts`,
        headers: {
          Authorization: `${this.ringover.$auth.api_key}`,
          accept: "application/json",
        },
        data: params,
      });
    },
  },
  async run({ $ }) {
    const response = await this.createContact({
      $,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone,
      mobile: this.mobile,
      position: this.position,
      company: this.company,
      notes: this.notes,
    });
    $.export("$summary", "Successfully created contact");
    return response;
  },
};
