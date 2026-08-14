import { ConfigurationError } from "@pipedream/platform";
import wealthbox from "../../wealthbox.app.mjs";
import { DEFAULT_LINKED_TO_TYPE } from "../../common/constants.mjs";

export default {
  key: "wealthbox-start-workflow",
  name: "Start Workflow",
  description: "Enroll a contact in a workflow template via POST /workflows. Run **List Workflow Templates** to find the template id and **List Contact Options** to find the contact id to enroll. Example: enroll contact `67890` in template `999` starting `2026-09-01T09:00:00Z`; returns the workflow enrollment object including `id`, `workflow_template`, `linked_to`, and `starts_at`. [See the documentation](https://dev.wealthbox.com/#workflows-retrieve-all-workflows-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    wealthbox,
    workflowId: {
      type: "string",
      label: "Workflow Template ID",
      description: "Free-form id of the workflow template to enroll into (sent as `workflow_template`). Run **List Workflow Templates** first. Example: `999`.",
    },
    linkedToId: {
      type: "string",
      label: "Contact ID",
      description: "Free-form id of the contact to enroll (sent as `linked_to.id`). Run **List Contact Options** first. Example: `67890`.",
    },
    linkedToType: {
      type: "string",
      label: "Linked To Type",
      description: "Type of the linked resource (sent as `linked_to.type`). Defaults to `Contact`.",
      optional: true,
    },
    label: {
      type: "string",
      label: "Label",
      description: "Optional label for the workflow enrollment.",
      optional: true,
    },
    startsAt: {
      type: "string",
      label: "Starts At",
      description: "Optional ISO 8601 datetime for when the workflow should start. Example: `2026-08-13T09:00:00Z`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const workflowTemplateId = Number(this.workflowId);
    const contactId = Number(this.linkedToId);
    if (!Number.isSafeInteger(workflowTemplateId)) {
      throw new ConfigurationError("Workflow Template ID must be a valid integer.");
    }
    if (!Number.isSafeInteger(contactId)) {
      throw new ConfigurationError("Contact ID must be a valid integer.");
    }

    const response = await this.wealthbox.startWorkflow({
      $,
      data: {
        workflow_template: workflowTemplateId,
        linked_to: {
          id: contactId,
          type: this.linkedToType || DEFAULT_LINKED_TO_TYPE,
        },
        label: this.label,
        starts_at: this.startsAt,
      },
    });

    $.export("$summary", `Successfully started workflow enrollment with ID ${response.id}`);
    return response;
  },
};
