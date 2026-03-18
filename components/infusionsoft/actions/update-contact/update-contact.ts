import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { UpdateContactParams } from "../../types/requestParams";

export default defineAction({
  name: "Update Contact",
  description:
    "Update an existing contact in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Contact)",
  key: "infusionsoft-update-contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact to update.",
      optional: false,
    },
    givenName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name.",
      optional: true,
    },
    familyName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's primary email address.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The contact's primary phone number.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company the contact is associated with.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The contact's job title.",
      optional: true,
    },
    ownerId: {
      type: "string",
      label: "Owner ID",
      description: "The ID of the Keap user who owns this contact.",
      optional: true,
    },
    leadsourceId: {
      type: "string",
      label: "Lead Source ID",
      description: "The ID of the lead source for this contact.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description:
        'JSON array of custom field objects with id and content. Example: [{"id": "1", "content": "value"}]',
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const params: UpdateContactParams = {
      $,
      contactId: this.contactId,
      givenName: this.givenName,
      familyName: this.familyName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      companyName: this.companyName,
      jobTitle: this.jobTitle,
      ownerId: this.ownerId,
      leadsourceId: this.leadsourceId,
      customFields: this.customFields,
    };

    const result = await this.infusionsoft.updateContact(params);

    $.export("$summary", `Successfully updated contact ${this.contactId}`);

    return result;
  },
});
