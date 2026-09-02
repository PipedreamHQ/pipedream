// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import jiraServiceDesk from "../../jira_service_desk.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "jira_service_desk-create-request",
  name: "Create Request",
  description:
    "Creates a customer request (ticket) in a Jira Service Management service desk."
    + " This is the single tool for creating any kind of ticket (incident, service request, access request, hardware request, and so on)."
    + " The kind of ticket is decided by `requestTypeId`, not by the wording of the summary, so always pick the request type deliberately."
    + " Use **List Sites** to get `cloudId`, **List Service Desks** to get `serviceDeskId`, and **List Request Types** to choose the `requestTypeId` whose name and description match the user's intent."
    + " Call **List Request Type Fields** to see which fields that request type requires; pass anything beyond summary and description in `additionalFieldValues`, keyed by Jira field ID."
    + " Worked example: on service desk `1`, request type `4` (\"Onboard new employees\") requires `summary` and also accepts a `duedate`, so call with Summary `Joseph Wilson starts on September 1`, Description `Needs a laptop and an email account`, and Additional Field Values `{ \"duedate\": \"2026-09-01\" }`."
    + " Optionally attach one or more files at creation time via `attachments`; to add, replace, or delete attachments on a request that already exists, use **Manage Request Attachment** instead."
    + " Returns the created request including its `issueKey` and `issueId`. If `attachments` is set, the response also includes either an `attachments` array (on success) or an `attachmentError` string (if the request was created but the attachment step failed) — the request itself is never rolled back because of an attachment failure."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-post)",
  version: "1.1.0",
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
      ],
      description: "The service desk to raise the request in. Use **List Service Desks** to find valid IDs (e.g. `1`).",
    },
    requestTypeId: {
      propDefinition: [
        jiraServiceDesk,
        "requestTypeId",
      ],
      description: "The request type that determines what kind of ticket this is. Use **List Request Types** to see the types this service desk offers and pick the one matching the user's intent (e.g. `8` for \"Report a system problem\").",
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "One-line title of the request, e.g. `Laptop won't boot after the latest update`. Required by virtually every request type.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Body of the request, as plain text.",
      optional: true,
    },
    additionalFieldValues: {
      type: "object",
      label: "Additional Field Values",
      description:
        "Any other fields the chosen request type requires or accepts, as a JSON object of Jira field ID to value, e.g. `{ \"duedate\": \"2026-09-01\", \"customfield_10052\": \"Laptop\" }`."
        + " Run **List Request Type Fields** for the exact `fieldId`s, which are required, and their schemas."
        + " Values that parse as JSON are converted (`[\"a\",\"b\"]` becomes a list, `5` becomes a number); to keep a numeric-looking value a string, wrap it in quotes (`\"\\\"123\\\"\"`)."
        + " Keys `summary` and `description` given here override the props above.",
      optional: true,
    },
    requestParticipants: {
      type: "string[]",
      label: "Request Participants",
      description: "Atlassian account IDs to add as participants, e.g. `[\"5b10a2844c20165700ede21g\"]`. Not available to users who only have the Service Desk Customer permission, or if the feature is turned off for customers.",
      optional: true,
    },
    raiseOnBehalfOf: {
      type: "string",
      label: "Raise On Behalf Of",
      description: "Atlassian account ID of the customer to raise this request for, e.g. `5b10a2844c20165700ede21g`. Not available to users who only have the Service Desk Customer permission.",
      optional: true,
    },
    form: {
      type: "object",
      label: "Form",
      description: "Answers to the form attached to the request type, as `{ \"answers\": { \"<questionId>\": { \"text\": \"...\" } } }`. Omit any Jira field from `additionalFieldValues` when it is linked to a form answer here. For answers in ADF, also set `isAdfRequest` to `true`.",
      optional: true,
    },
    isAdfRequest: {
      type: "boolean",
      label: "Is ADF Request",
      description: "Set to `true` to send rich-text fields (such as `description`) as Atlassian Document Format objects rather than plain text. Leave unset to send plain strings. When `true`, do not use the Description prop, which only sends plain text: pass the ADF object as a JSON string under the `description` key of `additionalFieldValues` instead. Marked experimental by Atlassian.",
      optional: true,
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "Extra information about the channel the request came in on. Marked experimental by Atlassian.",
      optional: true,
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "File(s) to attach to the request as it's created. Provide file URLs or paths to files in the /tmp directory (e.g. `/tmp/myFile.pdf`).",
      format: "file-ref",
      optional: true,
    },
    attachmentsPublic: {
      type: "boolean",
      label: "Attachments Public",
      description: "Whether the attached file(s) are visible to the customer who raised the request. Defaults to `true`; set to `false` to attach internal-only files.",
      optional: true,
      default: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      jiraServiceDesk,
      cloudId,
      serviceDeskId,
      requestTypeId,
      summary,
      description,
      additionalFieldValues,
      requestParticipants,
      raiseOnBehalfOf,
      form,
      isAdfRequest,
      channel,
      attachments,
      attachmentsPublic,
    } = this;

    let extraFields = additionalFieldValues;
    if (typeof extraFields === "string") {
      try {
        extraFields = JSON.parse(extraFields);
      } catch (error) {
        throw new ConfigurationError(`Additional Field Values is not valid JSON: ${error.message}`);
      }
    }
    if (extraFields != null && (typeof extraFields !== "object" || Array.isArray(extraFields))) {
      throw new ConfigurationError("Additional Field Values must be a JSON object of Jira field ID to value (not a list or a single value).");
    }

    // Object props arrive from the UI with string values; parse the ones that carry
    // non-string Jira field types (arrays, objects, numbers) and leave the rest as text.
    const parsedExtraFields = Object.fromEntries(
      Object.entries(extraFields ?? {}).map(([
        fieldId,
        value,
      ]) => {
        if (typeof value !== "string") {
          return [
            fieldId,
            value,
          ];
        }
        try {
          return [
            fieldId,
            JSON.parse(value),
          ];
        } catch {
          return [
            fieldId,
            value,
          ];
        }
      }),
    );

    const requestFieldValues = {
      [constants.REQUEST_FIELD.SUMMARY]: summary,
      [constants.REQUEST_FIELD.DESCRIPTION]: description,
      ...parsedExtraFields,
    };

    const response = await jiraServiceDesk.createCustomerRequest({
      $,
      cloudId,
      data: {
        serviceDeskId,
        requestTypeId,
        requestFieldValues,
        requestParticipants,
        raiseOnBehalfOf,
        form,
        isAdfRequest,
        channel,
      },
    });

    if (!attachments?.length) {
      $.export("$summary", `Successfully created request ${response.issueKey}`);
      return response;
    }

    try {
      const attachResponse = await jiraServiceDesk.attachFilesToRequestFromSource({
        $,
        cloudId,
        serviceDeskId,
        issueIdOrKey: response.issueKey,
        files: attachments,
        isPublic: attachmentsPublic,
      });

      $.export("$summary", `Created request ${response.issueKey} with ${attachments.length} attachment(s)`);
      return {
        ...response,
        attachments: attachResponse.attachments.values,
      };
    } catch (error) {
      $.export("$summary", `Created request ${response.issueKey}, but attaching file(s) failed: ${error.message}`);
      return {
        ...response,
        attachmentError: error.message,
      };
    }
  },
};
