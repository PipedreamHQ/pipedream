import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-create-incident",
  name: "Create Incident",
  description: "Creates a new incident record in ServiceNow.",
  version: "0.0.1",
  type: "action",
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
        "incidentSeverity",
      ],
    },
    status: {
      propDefinition: [
        servicenow,
        "status",
      ],
    },
    contactMethod: {
      propDefinition: [
        servicenow,
        "contactMethod",
      ],
    },
    companyId: {
      propDefinition: [
        servicenow,
        "companyId",
      ],
    },
    userId: {
      propDefinition: [
        servicenow,
        "userId",
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
      contactMethod,
      companyId,
      userId,
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
      customer: companyId,
      customer_contact: userId,
    });

    const response = await this.servicenow.createTroubleTicket({
      $,
      ticketType: "Incident",
      name,
      description,
      severity,
      status,
      channelName: contactMethod,
      notes,
      relatedParties,
    });

    $.export("$summary", "Successfully created an incident.");

    return response;
  },
};
