import mailercloud from "../../mailercloud.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "mailercloud-update-contact",
  name: "Update Contact",
  description: "Update an existing contact in the user's Mailercloud account. [See the documentation](https://apidoc.mailercloud.com/docs/mailercloud-api/55b552af7970c-update-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailercloud,
    listId: {
      propDefinition: [
        mailercloud,
        "listId",
      ],
      description: "The ID of a list to filter contacts by",
    },
    contactId: {
      propDefinition: [
        mailercloud,
        "contactId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    name: {
      propDefinition: [
        mailercloud,
        "name",
      ],
    },
    city: {
      propDefinition: [
        mailercloud,
        "city",
      ],
    },
    state: {
      propDefinition: [
        mailercloud,
        "state",
      ],
    },
    zip: {
      propDefinition: [
        mailercloud,
        "zip",
      ],
    },
    country: {
      propDefinition: [
        mailercloud,
        "country",
      ],
    },
    phone: {
      propDefinition: [
        mailercloud,
        "phone",
      ],
    },
    industry: {
      propDefinition: [
        mailercloud,
        "industry",
      ],
    },
    department: {
      propDefinition: [
        mailercloud,
        "department",
      ],
    },
    jobTitle: {
      propDefinition: [
        mailercloud,
        "jobTitle",
      ],
    },
    organization: {
      propDefinition: [
        mailercloud,
        "organization",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mailercloud.updateContact({
      contactId: this.contactId,
      data: utils.cleanObject({
        name: this.name,
        city: this.city,
        state: this.state,
        zip: this.zip,
        country: this.country,
        phone: this.phone,
        industry: this.industry,
        department: this.department,
        job_title: this.jobTitle,
        organization: this.organization,
      }),
      $,
    });
    $.export("$summary", `Successfully updated contact with ID: ${this.contactId}`);
    return response;
  },
};
