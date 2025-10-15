import { defineAction } from "@pipedream/types";
import app from "../../app/persistiq.app";

export default defineAction({
  key: "persistiq-create-or-update-prospect",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Or Update Prospect",
  description: "Creates a prospect. Updates if there is already a prospect with the given `email`. [See docs here](https://apidocs.persistiq.com/#create-leads)",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Email",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Company name",
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "Industry",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createLead({
      $,
      data: {
        dup: "update",
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        address: this.address,
        city: this.city,
        state: this.state,
        company_name: this.companyName,
        industry: this.industry,
        title: this.title,
        phone: this.phone,
      },
    });
    $.export("$summary", `Successfully created a prospect (ID: ${response?.lead?.id})`);
    return response;
  },
});
