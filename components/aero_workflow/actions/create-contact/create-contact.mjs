import app from "../../aero_workflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "aero_workflow-create-contact",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Contact",
  description: "Creates a contact [See the docs here](https://api.aeroworkflow.com/swagger/index.html)",
  props: {
    app,
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
    defaultEmailAddress: {
      type: "string",
      label: "Default Email Address",
      description: "Default email address",
      optional: true,
    },
    officePhone: {
      type: "string",
      label: "Office Phone",
      description: "Office phone",
      optional: true,
    },
    homePhone: {
      type: "string",
      label: "Home Phone",
      description: "Home phone",
      optional: true,
    },
    mobilePhone: {
      type: "string",
      label: "Mobile Phone",
      description: "Mobile phone",
      optional: true,
    },
    facebookUrl: {
      type: "string",
      label: "Facebook Url",
      description: "Facebook url",
      optional: true,
    },
    linkedInUrl: {
      type: "string",
      label: "LinkedIn Url",
      description: "LinkedIn url",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title",
      optional: true,
    },
    twitterHandle: {
      type: "string",
      label: "Twitter Handle",
      description: "Twitter handle",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes",
      optional: true,
    },
  },
  async run ({ $ }) {
    const data = utils.extractProps(this);
    const resp = await this.app.createContact({
      $,
      data,
    });
    $.export("$summary", `The contact(ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};
