import surveysparrow from "../../surveysparrow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "surveysparrow-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in your active list. [See the documentation](https://developers.surveysparrow.com/rest-apis/contacts)",
  version: "0.0.1",
  type: "action",
  props: {
    surveysparrow,
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "Email address of the contact",
      required: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact",
      optional: true,
    },
    mobileNumber: {
      type: "string",
      label: "Mobile Number",
      description: "Mobile number of the contact",
      optional: true,
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "Full name of the contact",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title of the contact",
      optional: true,
    },
    contactType: {
      type: "string",
      label: "Contact Type",
      description: "The type of contact",
      options: surveysparrow.propDefinitions.contactType.options,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surveysparrow.createContact({
      emailAddress: this.emailAddress,
      phoneNumber: this.phoneNumber,
      mobileNumber: this.mobileNumber,
      fullName: this.fullName,
      jobTitle: this.jobTitle,
      contactType: this.contactType,
    });

    $.export("$summary", `Successfully created contact with email address ${this.emailAddress}`);
    return response;
  },
};
