import { ConfigurationError } from "@pipedream/platform";
import app from "../../callingly.app.mjs";

export default {
  key: "callingly-update-lead",
  name: "Update Lead",
  description: "Updates an existing lead in Callingly. [See the documentation](https://help.callingly.com/article/38-callingly-api-documentation#Update-Agent-sx_cL)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    leadId: {
      propDefinition: [
        app,
        "leadId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Lead's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Lead's last name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Lead's email address",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Lead's phone number (E164 format preferred, e.g., +11234567890)",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Lead's company name",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Source of the lead",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Lead status (e.g., missed, contacted)",
      optional: true,
    },
    result: {
      type: "string",
      label: "Result",
      description: "Lead result",
      optional: true,
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "Lead stage",
      optional: true,
    },
    isStopped: {
      type: "boolean",
      label: "Is Stopped",
      description: "Whether the lead is stopped",
      optional: true,
    },
    isBlocked: {
      type: "boolean",
      label: "Is Blocked",
      description: "Whether the lead is blocked",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.updateLead({
      $,
      leadId: this.leadId,
      data: {
        id: this.leadId,
        ...(this.firstName && {
          fname: this.firstName,
        }),
        ...(this.lastName && {
          lname: this.lastName,
        }),
        ...(this.email && {
          email: this.email,
        }),
        ...(this.phoneNumber && {
          phone_number: this.phoneNumber,
        }),
        ...(this.company && {
          company: this.company,
        }),
        ...(this.source && {
          source: this.source,
        }),
        ...(this.status && {
          status: this.status,
        }),
        ...(this.result && {
          result: this.result,
        }),
        ...(this.stage && {
          stage: this.stage,
        }),
        ...(this.isStopped && {
          is_stopped: +this.isStopped,
        }),
        ...(this.isBlocked && {
          is_blocked: +this.isBlocked,
        }),
      },
    });

    if (Object.hasOwn(response, "success") && response.success === false) {
      throw new ConfigurationError(response.message);
    }

    $.export("$summary", `Successfully updated lead with ID: ${this.leadId}`);
    return response;
  },
};
