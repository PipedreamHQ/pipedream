import app from "../../justcall.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "justcall-create-contact",
  name: "Create Contact",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add a contact to your existing JustCall Sales Dialer campaign. [See the documentation](https://justcall.io/developer-docs/#add_contacts)",
  type: "action",
  props: {
    app,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact.",
      optional: true,
    },
    contactNumber: {
      type: "string",
      label: "Contact Number",
      description: "Phone number of the contact.",
    },
    otherNumbers: {
      type: "string[]",
      label: "Other Numbers",
      description: "Other phone numbers associated with the contact. Each entry should be a JSON string with `label` and `number` fields. Example: `{\"label\": \"Work\", \"number\": \"+1234567890\"}`",
      optional: true,
    },
    extension: {
      type: "integer",
      label: "Extension",
      description: "Assign an extension to the contact.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company with which the contact is associated.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the contact.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional information added for the contact in JustCall.",
      optional: true,
    },
    acrossTeam: {
      type: "boolean",
      label: "Across Team",
      description: "Choose to add a contact for all agents or only for the account owner. `true`: Add contact for all agents. `false`: Add contact for account owner (Default).",
      optional: true,
    },
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "Specify the agent ID to create contact only for a specific agent. All contacts are by default always available to the account owner along with respective agents (if any).",
      optional: true,
    },
    agentIds: {
      type: "string[]",
      label: "Agent IDs",
      description: "Specify the agent IDs to create contact only for specific agents.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      firstName,
      lastName,
      contactNumber,
      otherNumbers,
      extension,
      email,
      company,
      address,
      notes,
      acrossTeam,
      agentId,
      agentIds,
    } = this;

    const response = await app.createContact({
      $,
      data: {
        first_name: firstName,
        last_name: lastName,
        contact_number: contactNumber,
        other_numbers: utils.parseJson(otherNumbers ?? []),
        extension,
        email,
        company,
        address,
        notes,
        across_team: acrossTeam,
        agent_id: agentId,
        agent_ids: utils.parseJson(agentIds ?? []),
      },
    });

    $.export("$summary", `A new contact with Id \`${response.data.id}\` was successfully created!`);
    return response;
  },
};
