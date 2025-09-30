import workamajig from "../../workamajig.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workamajig-update-contact",
  name: "Update Contact",
  description: "This component updates a specific contact in Workamajig. [See the documentation](https://app6.workamajig.com/platinum/?aid=common.apidocs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workamajig,
    companyKey: {
      propDefinition: [
        workamajig,
        "companyKey",
      ],
      description: "Company the contact belongs to",
    },
    contactKey: {
      propDefinition: [
        workamajig,
        "contactKey",
        ({ companyKey }) => ({
          companyKey,
        }),
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact",
      optional: true,
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "Comments for the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data: { contact } } = await this.workamajig.getContact({
      params: {
        contactKey: this.contactKey,
      },
      $,
    });

    if (!this.firstName && !contact.firstName) {
      throw new ConfigurationError("Must enter First Name");
    }
    if (!this.lastName && !contact.lastName) {
      throw new ConfigurationError("Must enter Last Name");
    }

    const response = await this.workamajig.updateContact({
      data: utils.cleanObject({
        contactKey: this.contactKey,
        firstName: this.firstName || contact.firstName,
        lastName: this.lastName || contact.lastName,
        title: this.title,
        email: this.email,
        phone1: this.phone,
        comments: this.comments,
      }),
      $,
    });
    $.export("$summary", `Successfully updated contact with key: ${this.contactKey}`);
    return response;
  },
};
