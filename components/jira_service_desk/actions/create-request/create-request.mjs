import jiraServiceDesk from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-create-request",
  name: "Create Request",
  description:
    "Creates a new customer request. [See the documentation](https://docs.atlassian.com/jira-servicedesk/REST/3.6.2/#servicedeskapi/request-createCustomerRequest)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jiraServiceDesk,
    cloudId: {
      propDefinition: [
        jiraServiceDesk,
        "cloudId",
      ],
    },
    serviceDeskId: {
      propDefinition: [
        jiraServiceDesk,
        "serviceDeskId",
        ({ cloudId }) => ({
          cloudId,
        }),
      ],
    },
    requestTypeId: {
      propDefinition: [
        jiraServiceDesk,
        "requestTypeId",
        ({
          cloudId, serviceDeskId,
        }) => ({
          cloudId,
          serviceDeskId,
        }),
      ],
      reloadProps: true,
    },
    requestParticipants: {
      type: "string[]",
      label: "Request Participants",
      description:
        "Not available to users who only have the Service Desk Customer permission or if the feature is turned off for customers..",
      optional: true,
    },
    raiseOnBehalfOf: {
      type: "string",
      label: "Raise On Behalf Of",
      description:
        "Not available to users who only have the Service Desk Customer permission.",
      optional: true,
    },
  },
  async additionalProps() {
    const {
      cloudId, serviceDeskId, requestTypeId,
    } = this;
    const types = await this.jiraServiceDesk.getRequestTypeFields({
      cloudId,
      serviceDeskId,
      requestTypeId,
    });

    return Object.fromEntries(
      types.map((field) => [
        field.fieldId,
        {
          type: "string",
          label: `Field: "${field.name}"`,
          description: `[See the documentation](https://docs.atlassian.com/jira-servicedesk/REST/3.6.2/#fieldformats) for info on specific fields. If the provided value is not a string, it will be parsed as JSON.${field.description
            ? `
\\
Field description: "${field.description}"`
            : ""}${field.jiraSchema
            ? `
  \\
  Field schema: \`${JSON.stringify(field.jiraSchema)}\``
            : ""}`,
          optional: !field.required,
        },
      ]),
    );
  },
  async run({ $ }) {
    const {
      // eslint-disable-next-line no-unused-vars
      jiraServiceDesk,
      cloudId,
      serviceDeskId,
      requestTypeId,
      requestParticipants,
      raiseOnBehalfOf,
      ...requestFieldValues
    } = this;

    Object.entries(requestFieldValues).forEach(([
      key,
      value,
    ]) => {
      try {
        const parsedValue = JSON.parse(value);
        requestFieldValues[key] = parsedValue;
      }
      catch (err) {
        // ignore non-serializable values
      }
    });

    const response = await this.jiraServiceDesk.createCustomerRequest({
      $,
      cloudId,
      data: {
        serviceDeskId,
        requestTypeId,
        requestFieldValues,
        requestParticipants,
        raiseOnBehalfOf,
      },
    });
    $.export("$summary", "Successfully created request");
    return response;
  },
};
