// x-pd-ai: optimized
import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-list-request-type-fields",
  name: "List Request Type Fields",
  description:
    "Lists the fields a given request type accepts, so you can build the `additionalFieldValues` argument for **Create Request** in a single pass."
    + " Each entry gives the `fieldId` to use as the key, whether it is `required`, its `jiraSchema` (the value format), and any `validValues` for select-style fields."
    + " Use **List Sites** for `cloudId`, **List Service Desks** for `serviceDeskId`, and **List Request Types** for `requestTypeId`."
    + " Example: request type `4` (\"Onboard new employees\") on service desk `1` returns a required `summary` plus optional `duedate` (`jiraSchema.type` `date`, so pass `\"2026-09-01\"`), `description`, and `attachment`."
    + " Also returns `canRaiseOnBehalfOf` and `canAddRequestParticipants`, which tell you whether the `raiseOnBehalfOf` and `requestParticipants` arguments of **Create Request** are usable with this account."
    + " Hidden fields are only visible to service desk administrators."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-servicedesk/#api-rest-servicedeskapi-servicedesk-servicedeskid-requesttype-requesttypeid-field-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    cloudId: {
      propDefinition: [
        app,
        "cloudId",
      ],
    },
    serviceDeskId: {
      propDefinition: [
        app,
        "serviceDeskId",
        ({ cloudId }) => ({
          cloudId,
        }),
      ],
      description: "The service desk the request type belongs to. Use **List Service Desks** to find valid IDs (e.g. `1`).",
    },
    requestTypeId: {
      propDefinition: [
        app,
        "requestTypeId",
        ({
          cloudId, serviceDeskId,
        }) => ({
          cloudId,
          serviceDeskId,
        }),
      ],
      description: "The request type whose fields to list. Use **List Request Types** to find valid IDs (e.g. `4`).",
    },
    expand: {
      propDefinition: [
        app,
        "expand",
      ],
      description: "Extra data to include. Pass `[\"hiddenFields\"]` to also return fields hidden on the request type, which only a service desk administrator can see. `hiddenFields` is the only value this endpoint accepts.",
    },
  },
  async run({ $ }) {
    const {
      requestTypeFields, canRaiseOnBehalfOf, canAddRequestParticipants,
    } = await this.app.getRequestTypeCreateMeta({
      $,
      cloudId: this.cloudId,
      serviceDeskId: this.serviceDeskId,
      requestTypeId: this.requestTypeId,
      params: {
        expand: this.expand,
      },
    });

    const fields = requestTypeFields?.map?.(({
      fieldId, name, description, required, jiraSchema, validValues, defaultValues, visible,
    }) => ({
      fieldId,
      name,
      description,
      required,
      jiraSchema,
      validValues,
      defaultValues,
      visible,
    })) ?? [];

    $.export("$summary", `Found ${fields.length} field${fields.length === 1
      ? ""
      : "s"}`);
    return {
      requestTypeFields: fields,
      canRaiseOnBehalfOf,
      canAddRequestParticipants,
    };
  },
};
