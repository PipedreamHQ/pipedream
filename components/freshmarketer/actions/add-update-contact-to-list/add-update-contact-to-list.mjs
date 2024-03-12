import { ConfigurationError } from "@pipedream/platform";
import { SUBSCRIPTION_STATUS_OPTIONS } from "../../common/constants.mjs";
import freshmarketer from "../../freshmarketer.app.mjs";

export default {
  key: "freshmarketer-add-update-contact-to-list",
  name: "Add or Update Contact to List",
  description: "Adds a new contact or updates an existing one on a specific list. Requires contact details and list ID as props.",
  version: "0.0.1",
  type: "action",
  props: {
    freshmarketer,
    email: {
      propDefinition: [
        freshmarketer,
        "contactEmail",
      ],
      description: "Email on which enttity needs to be created or updated.",
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
    subscriptionStatus: {
      type: "string",
      label: "Subscription Status",
      description: "Status of subscription that the contact is in.",
      optional: true,
      options: SUBSCRIPTION_STATUS_OPTIONS,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Designation of the contact in the account he belongs to.",
      optional: true,
    },
    workNumber: {
      type: "string",
      label: "Work Number",
      description: "Work phone number of the contact.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "External ID of the contact.",
      optional: true,
    },
    mobileNumber: {
      type: "string",
      label: "Mobile Number",
      description: "Mobile phone number of the contact.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the contact.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City that the contact belongs to.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State that the contact belongs to.",
      optional: true,
    },
    zipcode: {
      type: "string",
      label: "Zipcode",
      description: "Zipcode of the region that the contact belongs to.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country that the contact belongs to.",
      optional: true,
    },
    territoryId: {
      propDefinition: [
        freshmarketer,
        "territoryId",
      ],
      optional: true,
    },
    leadSourceId: {
      propDefinition: [
        freshmarketer,
        "leadSourceId",
      ],
      optional: true,
    },
    ownerId: {
      propDefinition: [
        freshmarketer,
        "ownerId",
      ],
      optional: true,
    },
    subscriptionTypes: {
      type: "integer",
      label: "Subscription Types",
      description: "Type of subscription that the contact is in.",
      optional: true,
      options: [
        {
          label: "Non-marketing emails from our company.",
          value: 1,
        },
        {
          label: "Newsletter.",
          value: 2,
        },
        {
          label: "Promotional.",
          value: 3,
        },
        {
          label: "Product Uppdates.",
          value: 4,
        },
        {
          label: "Conferences & Events.",
          value: 5,
        },
      ],
    },

  },
  async run({ $ }) {
    if (!this.email && !this.mobileNumber && ! this.externalId) {
      throw new ConfigurationError("Either Email/Mobile/Twitter ID is required to create a contact.");
    }
    const response = await this.freshmarketer.upsertContact({
      $,
      data: {
        unique_identifier: {
          emails: this.email,
        },
        contact: {
          first_name: this.firstName,
          last_name: this.lastName,
          subscription_status: this.subscriptionStatus,
          job_title: this.jobTitle,
          emails: this.email,
          work_number: this.workNumber,
          external_id: this.externalId,
          mobile_number: this.mobileNumber,
          address: this.address,
          city: this.city,
          state: this.state,
          zipcode: this.zipcode,
          country: this.country,
          territory_id: this.territoryId,
          lead_source_id: this.leadSourceId && this.leadSourceId.toString(),
          owner_id: this.ownerId && this.ownerId.toString(),
          subscription_types: this.subscriptionTypes,
        },
      },
    });

    $.export("$summary", `The contact was successfully created/updated with Id: ${response.contact.id}`);
    return response;
  },
};
