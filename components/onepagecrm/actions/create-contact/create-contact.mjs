import { ConfigurationError } from "@pipedream/platform";
import { parseString } from "../../common/utils.mjs";
import onepagecrm from "../../onepagecrm.app.mjs";

export default {
  key: "onepagecrm-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in OnePageCRM. [See the documentation](https://developer.onepagecrm.com/api/#/Contacts/post_contacts)",
  version: "0.0.1",
  type: "action",
  props: {
    onepagecrm,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the contact.",
      options: [
        "Mr",
        "Mrs",
        "Ms",
      ],
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title of the contact.",
      optional: true,
    },
    starred: {
      type: "boolean",
      label: "Starred",
      description: "Is the contact starred?",
      optional: true,
    },
    companyId: {
      propDefinition: [
        onepagecrm,
        "companyId",
      ],
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Name of the company, to whom the contact belongs.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tags.",
      optional: true,
    },
    leadSourceId: {
      propDefinition: [
        onepagecrm,
        "leadSourceId",
      ],
      optional: true,
    },
    background: {
      type: "string",
      label: "Background",
      description: "Background infomation about the contact.",
      optional: true,
    },
    ownerId: {
      propDefinition: [
        onepagecrm,
        "userId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.lastName && !this.companyName) {
      throw new ConfigurationError("You must provide at least the **Last Name** or **Company Name** field.");
    }
    const response = await this.onepagecrm.createContact({
      $,
      data: {
        title: this.title,
        first_name: this.firstName,
        last_name: this.lastName,
        job_title: this.jobTitle,
        starred: this.starred,
        company_id: this.companyId,
        company_name: this.companyName,
        tags: parseString(this.tags),
        lead_source_id: this.leadSourceId,
        background: this.background,
        owner_id: this.ownerId,
      },
    });
    $.export("$summary", `Successfully created contact with ID ${response.data?.contact?.id}`);
    return response;
  },
};
