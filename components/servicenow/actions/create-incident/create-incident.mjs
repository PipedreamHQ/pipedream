import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-create-incident",
  name: "Create Incident",
  description: "Creates a new incident record in ServiceNow. [See the docs here](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/trouble-ticket-open-api.html#title_trouble-ticket-POST-ticket-tt).",
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

    const channel = this.servicenow.buildChannel(contactMethod);

    const relatedParties = this.servicenow.buildRelatedParties({
      customer: companyId,
      customer_contact: userId,
    });

    const notes = this.servicenow.buildNotes({
      workNote,
      comment,
    });

    const response = await this.servicenow.createTroubleTicket({
      $,
      data: {
        ticketType: "Incident",
        name,
        description,
        severity,
        status,
        channel,
        notes,
        relatedParties,
      },
    });

    $.export("$summary", "Successfully created an incident.");

    return response;
  },
};
