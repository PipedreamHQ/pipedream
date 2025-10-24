import app from "../../topdesk.app.mjs";

export default {
  key: "topdesk-create-incident",
  name: "Create Incident",
  description: "Creates a new incident. [See the documentation](https://developers.topdesk.com/explorer/?page=incident#/incident/createIncident)",
  version: "0.0.1",
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
      type: "string",
      label: "Brief Description",
      description: "Brief description of the incident (max 80 characters)",
      optional: true,
    },
    request: {
      type: "string",
      label: "Request",
      description: "The initial request text. HTML tags are supported: `<i>`, `<em>`, `<b>`, `<strong>`, `<u>`, `<br>`, `<h5>`, `<h6>`",
      optional: true,
    },
    action: {
      type: "string",
      label: "Action",
      description: "The initial action text. HTML tags are supported: `<i>`, `<em>`, `<b>`, `<strong>`, `<u>`, `<br>`, `<h5>`, `<h6>`",
      optional: true,
    },
    actionInvisibleForCaller: {
      type: "boolean",
      label: "Action Invisible For Caller",
      description: "Whether the initial action is invisible for persons. Can only be set by operators.",
      optional: true,
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The UUID of the category",
      optional: true,
    },
    subcategoryId: {
      type: "string",
      label: "Subcategory ID",
      description: "The UUID of the subcategory",
      optional: true,
    },
    callTypeId: {
      type: "string",
      label: "Call Type ID",
      description: "The UUID of the call type",
      optional: true,
    },
    entryTypeId: {
      type: "string",
      label: "Entry Type ID",
      description: "The UUID of the entry type. Can only be set by operators.",
      optional: true,
    },
    externalNumber: {
      type: "string",
      label: "External Number",
      description: "External number (max 60 characters). Can only be set by operators.",
      optional: true,
    },
    objectId: {
      type: "string",
      label: "Object ID",
      description: "The UUID of the object (asset). Can only be set by operators.",
      optional: true,
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The UUID of the location. Can only be set by operators.",
      optional: true,
    },
    branchId: {
      type: "string",
      label: "Branch ID",
      description: "The UUID of the branch. Can only be set by operators.",
      optional: true,
    },
    mainIncidentId: {
      type: "string",
      label: "Main Incident ID",
      description: "Main incident UUID, required for creating a partial incident. Can only be set by operators.",
      optional: true,
    },
    impact: {
      type: "string",
      label: "Impact ID",
      description: "The UUID of the impact. Can only be set by operators.",
      optional: true,
    },
    urgency: {
      type: "string",
      label: "Urgency ID",
      description: "The UUID of the urgency. Can only be set by operators.",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority ID",
      description: "The UUID of the priority. Can only be set by operators.",
      optional: true,
    },
    duration: {
      type: "string",
      label: "Duration ID",
      description: "The UUID of the duration. Can only be set by operators.",
      optional: true,
    },
    targetDate: {
      type: "string",
      label: "Target Date",
      description: "Target date in ISO 8601 format (e.g., `2024-08-01T12:00:00.000+0200`). Can only be set by operators.",
      optional: true,
    },
    slaId: {
      type: "string",
      label: "SLA ID",
      description: "The UUID of the SLA. Can only be set by operators.",
      optional: true,
    },
    onHold: {
      type: "boolean",
      label: "On Hold",
      description: "Whether the incident is on hold. Can only be set by operators.",
      optional: true,
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
      type: "string",
      label: "Operator Group ID",
      description: "The UUID of the operator group assigned to the incident",
      optional: true,
    },
    supplierId: {
      type: "string",
      label: "Supplier ID",
      description: "The UUID of the supplier. Can only be set by operators.",
      optional: true,
    },
    processingStatusId: {
      type: "string",
      label: "Processing Status ID",
      description: "The UUID of the processing status. Can only be set by operators.",
      optional: true,
    },
    responded: {
      type: "boolean",
      label: "Responded",
      description: "Whether the incident is responded. SLM-licence is needed. Can only be set by operators.",
      optional: true,
    },
    responseDate: {
      type: "string",
      label: "Response Date",
      description: "Response date in ISO 8601 format. SLM-licence is needed. Can only be set by operators.",
      optional: true,
    },
    completed: {
      type: "boolean",
      label: "Completed",
      description: "Whether the incident is completed. Can only be set by operators.",
      optional: true,
    },
    completedDate: {
      type: "string",
      label: "Completed Date",
      description: "Completed date in ISO 8601 format. Can only be set by operators.",
      optional: true,
    },
    closed: {
      type: "boolean",
      label: "Closed",
      description: "Whether the incident is closed. Can only be set by operators.",
      optional: true,
    },
    closedDate: {
      type: "string",
      label: "Closed Date",
      description: "Closed date in ISO 8601 format. Can only be set by operators.",
      optional: true,
    },
    closureCodeId: {
      type: "string",
      label: "Closure Code ID",
      description: "The UUID of the closure code. Can only be set by operators.",
      optional: true,
    },
    majorCall: {
      type: "boolean",
      label: "Major Call",
      description: "Whether the incident is a major call. Can only be set by operators.",
      optional: true,
    },
    publishToSsd: {
      type: "boolean",
      label: "Publish To SSD",
      description: "Whether to publish the incident to Self Service Desk. Can only be set by operators.",
      optional: true,
    },
    optionalFields1: {
      type: "object",
      label: "Optional Fields 1",
      description: "Optional fields tab 1 as a JSON object",
      optional: true,
    },
    optionalFields2: {
      type: "object",
      label: "Optional Fields 2",
      description: "Optional fields tab 2 as a JSON object",
      optional: true,
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
      objectId,
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
        value: objectId,
        key: "object",
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
