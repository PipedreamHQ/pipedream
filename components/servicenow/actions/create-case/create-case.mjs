import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-create-case",
  name: "Create Case",
  description: "Creates a new case record in ServiceNow.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    servicenow,
    name: {
      propDefinition: [
        servicenow,
        "name",
      ],
    },
    description: {
      propDefinition: [
        servicenow,
        "description",
      ],
    },
    severity: {
      propDefinition: [
        servicenow,
        "caseSeverity",
      ],
    },
    status: {
      propDefinition: [
        servicenow,
        "status",
      ],
    },
    channelName: {
      propDefinition: [
        servicenow,
        "channelName",
      ],
    },
    accountId: {
      propDefinition: [
        servicenow,
        "accountId",
      ],
    },
    contactId: {
      propDefinition: [
        servicenow,
        "contactId",
      ],
    },
    workNote: {
      propDefinition: [
        servicenow,
        "workNote",
      ],
    },
    comment: {
      propDefinition: [
        servicenow,
        "comment",
      ],
    },
  },
  async run({ $ }) {
    const {
      name,
      description,
      severity,
      status,
      channelName,
      accountId,
      contactId,
      workNote,
      comment,
    } = this;

    if (!description) {
      throw new Error("Description is required.");
    }

    const notes = this.servicenow.buildNotes({
      workNote,
      comment,
    });

    const relatedParties = this.servicenow.buildRelatedParties({
      customer: accountId,
      customer_contact: contactId,
    });

    const response = await this.servicenow.createTroubleTicket({
      $,
      ticketType: "Case",
      name,
      description,
      severity,
      status,
      channelName,
      notes,
      relatedParties,
    });

    $.export("$summary", "Successfully created a case.");

    return response;
  },
};
