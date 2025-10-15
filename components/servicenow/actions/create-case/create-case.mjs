import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-create-case",
  name: "Create Case",
  description: "Creates a new case record in ServiceNow. [See the docs here](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/trouble-ticket-open-api.html#title_trouble-ticket-POST-ticket-tt).",
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

    const channel = this.servicenow.buildChannel(channelName);

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
      data: {
        ticketType: "Case",
        name,
        description,
        severity,
        status,
        channel,
        notes,
        relatedParties,
      },
    });

    $.export("$summary", "Successfully created a case.");

    return response;
  },
};
