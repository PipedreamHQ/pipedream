import app from "../../topdesk.app.mjs";

export default {
  key: "topdesk-update-incident",
  name: "Update Incident",
  description: "Updates an existing incident. [See the documentation](https://developers.topdesk.com/explorer/?page=incident#/incident/patchIncident)",
  version: "0.0.3",
  type: "action",
  props: {
    app,
    incidentId: {
      propDefinition: [
        app,
        "incidentId",
      ],
    },
    callerLookupId: {
      type: "string",
      label: "Caller Lookup ID",
      description: "Lookup value for filling in a registered caller's contact details (UUID). Can only be set by operators.",
      optional: true,
      propDefinition: [
        app,
        "personId",
      ],
    },
    briefDescription: {
      propDefinition: [
        app,
        "briefDescription",
      ],
    },
    request: {
      propDefinition: [
        app,
        "request",
      ],
    },
    action: {
      propDefinition: [
        app,
        "action",
      ],
    },
    actionInvisibleForCaller: {
      propDefinition: [
        app,
        "actionInvisibleForCaller",
      ],
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
    subcategoryId: {
      propDefinition: [
        app,
        "subcategoryId",
        ({ categoryId }) => ({
          categoryId,
        }),
      ],
    },
    callTypeId: {
      propDefinition: [
        app,
        "callTypeId",
      ],
    },
    callDate: {
      type: "string",
      label: "Call Date",
      description: "The date when this call was registered in ISO 8601 format (e.g., `2024-08-01T12:00:00.000+0200`). Can only be set by operators.",
      optional: true,
    },
    entryTypeId: {
      propDefinition: [
        app,
        "entryTypeId",
      ],
    },
    externalNumber: {
      propDefinition: [
        app,
        "externalNumber",
      ],
    },
    objectName: {
      propDefinition: [
        app,
        "objectName",
      ],
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
    },
    branchId: {
      propDefinition: [
        app,
        "branchId",
      ],
    },
    impact: {
      propDefinition: [
        app,
        "impactId",
      ],
    },
    urgency: {
      propDefinition: [
        app,
        "urgencyId",
      ],
    },
    priority: {
      propDefinition: [
        app,
        "priorityId",
      ],
    },
    duration: {
      propDefinition: [
        app,
        "durationId",
      ],
    },
    targetDate: {
      propDefinition: [
        app,
        "targetDate",
      ],
    },
    slaId: {
      propDefinition: [
        app,
        "slaId",
      ],
    },
    onHold: {
      propDefinition: [
        app,
        "onHold",
      ],
    },
    operatorId: {
      propDefinition: [
        app,
        "operatorId",
      ],
      label: "Operator",
      description: "The operator assigned to the incident. Can only be set by operators.",
      optional: true,
    },
    operatorGroupId: {
      propDefinition: [
        app,
        "operatorGroupId",
      ],
    },
    supplierId: {
      propDefinition: [
        app,
        "supplierId",
      ],
    },
    processingStatusId: {
      propDefinition: [
        app,
        "processingStatusId",
      ],
    },
    responded: {
      propDefinition: [
        app,
        "responded",
      ],
    },
    responseDate: {
      propDefinition: [
        app,
        "responseDate",
      ],
    },
    completed: {
      propDefinition: [
        app,
        "completed",
      ],
    },
    completedDate: {
      propDefinition: [
        app,
        "completedDate",
      ],
    },
    closed: {
      propDefinition: [
        app,
        "closed",
      ],
    },
    closedDate: {
      propDefinition: [
        app,
        "closedDate",
      ],
    },
    closureCodeId: {
      propDefinition: [
        app,
        "closureCodeId",
      ],
    },
    costs: {
      type: "string",
      label: "Costs",
      description: "Costs as a decimal number. Can only be set by operators.",
      optional: true,
    },
    feedbackMessage: {
      type: "string",
      label: "Feedback Message",
      description: "Feedback message from the caller",
      optional: true,
    },
    feedbackRating: {
      type: "integer",
      label: "Feedback Rating",
      description: "Feedback rating (1-5). Can be set by persons.",
      optional: true,
      min: 1,
      max: 5,
    },
    majorCall: {
      propDefinition: [
        app,
        "majorCall",
      ],
    },
    majorCallObject: {
      type: "object",
      label: "Major Call Object",
      description: "Major call details as a JSON object. Can only be set by operators.",
      optional: true,
    },
    publishToSsd: {
      propDefinition: [
        app,
        "publishToSsd",
      ],
    },
    optionalFields1: {
      propDefinition: [
        app,
        "optionalFields1",
      ],
    },
    optionalFields2: {
      propDefinition: [
        app,
        "optionalFields2",
      ],
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: false,
  },
  async run({ $ }) {
    const {
      app,
      incidentId,
      callerLookupId,
      briefDescription,
      request,
      action,
      actionInvisibleForCaller,
      categoryId,
      subcategoryId,
      callTypeId,
      callDate,
      entryTypeId,
      externalNumber,
      objectName,
      locationId,
      branchId,
      impact,
      urgency,
      priority,
      duration,
      targetDate,
      slaId,
      onHold,
      operatorId,
      operatorGroupId,
      supplierId,
      processingStatusId,
      responded,
      responseDate,
      completed,
      completedDate,
      closed,
      closedDate,
      closureCodeId,
      costs,
      feedbackMessage,
      feedbackRating,
      majorCall,
      majorCallObject,
      publishToSsd,
      optionalFields1,
      optionalFields2,
    } = this;

    // Fields that take { id: value } structure
    const idFields = [
      {
        value: callerLookupId,
        key: "callerLookup",
      },
      {
        value: categoryId,
        key: "category",
      },
      {
        value: subcategoryId,
        key: "subcategory",
      },
      {
        value: callTypeId,
        key: "callType",
      },
      {
        value: entryTypeId,
        key: "entryType",
      },
      {
        value: locationId,
        key: "location",
      },
      {
        value: branchId,
        key: "branch",
      },
      {
        value: impact,
        key: "impact",
      },
      {
        value: urgency,
        key: "urgency",
      },
      {
        value: priority,
        key: "priority",
      },
      {
        value: duration,
        key: "duration",
      },
      {
        value: slaId,
        key: "sla",
      },
      {
        value: operatorId,
        key: "operator",
      },
      {
        value: operatorGroupId,
        key: "operatorGroup",
      },
      {
        value: supplierId,
        key: "supplier",
      },
      {
        value: processingStatusId,
        key: "processingStatus",
      },
      {
        value: closureCodeId,
        key: "closureCode",
      },
    ];

    const response = await app.updateIncident({
      $,
      incidentId,
      data: {
        briefDescription,
        request,
        action,
        actionInvisibleForCaller,
        callDate,
        externalNumber,
        targetDate,
        onHold,
        responded,
        responseDate,
        completed,
        completedDate,
        closed,
        closedDate,
        costs,
        feedbackMessage,
        feedbackRating,
        majorCall,
        majorCallObject,
        publishToSsd,
        optionalFields1,
        optionalFields2,
        ...(objectName && {
          object: {
            name: objectName,
          },
        }),
        ...idFields.reduce((acc, {
          value, key,
        }) => ({
          ...acc,
          ...value && {
            [key]: {
              id: value,
            },
          },
        }), {}),
      },
    });

    $.export("$summary", `Successfully updated incident with ID \`${response.id}\``);

    return response;
  },
};
