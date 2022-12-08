import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-add-note",
  name: "Add Note",
  description: "Adds a new note. For info on [adding an note in Pipedrive](https://developers.pipedrive.com/docs/api/v1/Notes#addNote)",
  version: "0.0.2",
  type: "action",
  props: {
    pipedriveApp,
    content: {
      propDefinition: [
        pipedriveApp,
        "content",
      ],
    },
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      description: "The ID of the deal the note will be attached to. This property is required unless one of (lead_id/person_id/org_id) is specified.",
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "The ID of the person this note will be attached to. This property is required unless one of (deal_id/lead_id/org_id) is specified.",
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "The ID of the organization this note will be attached to. This property is required unless one of (deal_id/lead_id/person_id) is specified.",
    },
    userId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      description: "The ID of the user who will be marked as the author of the note. Only an admin can change the author.",
    },
    addTime: {
      propDefinition: [
        pipedriveApp,
        "addTime",
      ],
    },
    pinnedToDealFlag: {
      propDefinition: [
        pipedriveApp,
        "pinnedToDealFlag",
      ],
      optional: true,
    },
    pinnedToOrgFlag: {
      propDefinition: [
        pipedriveApp,
        "pinnedToOrgFlag",
      ],
      optional: true,
    },
    pinnedToPersonFlag: {
      propDefinition: [
        pipedriveApp,
        "pinnedToPersonFlag",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      content,
      dealId,
      personId,
      organizationId,
      userId,
      addTime,
      pinnedToLeadFlag,
      pinnedToDealFlag,
      pinnedToOrgFlag,
      pinnedToPersonFlag,
    } = this;

    try {
      const resp =
        await this.pipedriveApp.addNote({
          content,
          deal_id: dealId,
          person_id: personId,
          org_id: organizationId,
          user_id: userId,
          add_time: addTime,
          pinned_to_lead_flag: pinnedToLeadFlag,
          pinned_to_deal_flag: pinnedToDealFlag,
          pinned_to_organization_flag: pinnedToOrgFlag,
          pinned_to_person_flag: pinnedToPersonFlag,
        });

      $.export("$summary", "Successfully added note");

      return resp;
    } catch (error) {
      console.error(error.context?.body || error);
      throw error;
    }
  },
};
