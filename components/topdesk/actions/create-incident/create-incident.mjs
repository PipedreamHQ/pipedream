import app from "../../topdesk.app.mjs";

export default {
  key: "topdesk-create-incident",
  name: "Create Incident",
  description: "Creates a new incident. [See the documentation](https://developers.topdesk.com/explorer/?page=incident#/incident/createIncident)",
  version: "0.0.3",
  type: "action",
  props: {
    app,
    callerLookupId: {
      type: "string",
      label: "Caller Lookup ID",
      description: "Lookup value for filling in a registered caller's contact details (UUID). **Required** - you must specify either this field or provide caller details manually.",
      propDefinition: [
        app,
        "personId",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the incident. Can only be set by operators.",
      optional: true,
      options: [
        "firstLine",
        "secondLine",
        "partial",
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
    mainIncidentId: {
      type: "string",
      label: "Main Incident ID",
      description: "Main incident UUID, required for creating a partial incident. Can only be set by operators.",
      optional: true,
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
    majorCall: {
      propDefinition: [
        app,
        "majorCall",
      ],
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
      callerLookupId,
      status,
      briefDescription,
      request,
      action,
      actionInvisibleForCaller,
      categoryId,
      subcategoryId,
      callTypeId,
      entryTypeId,
      externalNumber,
      objectName,
      locationId,
      branchId,
      mainIncidentId,
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
      majorCall,
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
        value: mainIncidentId,
        key: "mainIncident",
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

    const response = await app.createIncident({
      $,
      data: {
        status,
        briefDescription,
        request,
        action,
        actionInvisibleForCaller,
        externalNumber,
        targetDate,
        onHold,
        responded,
        responseDate,
        completed,
        completedDate,
        closed,
        closedDate,
        majorCall,
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

    $.export("$summary", `Successfully created incident with ID \`${response.id}\``);

    return response;
  },
};
