import { ConfigurationError } from "@pipedream/platform";
import nevtanSign from "../../nevtan_sign.app.mjs";

export default {
  key: "nevtan_sign-create-envelope-from-template",
  name: "Create Envelope From Template",
  description: "Create a draft envelope from a saved template, assigning a real email address to each template role. The envelope is created as a draft; it is not sent to recipients by this action.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    nevtanSign,
    workspaceId: {
      propDefinition: [
        nevtanSign,
        "workspaceId",
      ],
    },
    templateId: {
      propDefinition: [
        nevtanSign,
        "templateId",
      ],
    },
    roleAssignments: {
      type: "object",
      label: "Role Assignments",
      description: "Map each role name defined on the template to the email address of the person filling that role. Example: `{ \"Client\": \"alice@example.com\", \"Vendor\": \"bob@example.com\" }`",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject for the envelope. Defaults to the template title.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message shown to recipients",
      optional: true,
    },
    isOrdered: {
      type: "boolean",
      label: "Sign in Order",
      description: "Set to `true` to require recipients to sign one after another, in the order of the role assignments",
      optional: true,
      default: false,
    },
    expiresAt: {
      type: "string",
      label: "Expires At",
      description: "When the envelope expires, in ISO 8601 format. Example: `2026-12-31T23:59:59`",
      optional: true,
    },
    envelopeType: {
      type: "string",
      label: "Envelope Type ID",
      description: "The ID of the envelope (agreement) type. Leave blank to use the default type.",
      optional: true,
    },
  },
  async run({ $ }) {
    const roleAssignments = typeof this.roleAssignments === "string"
      ? JSON.parse(this.roleAssignments)
      : this.roleAssignments;

    if (!roleAssignments || !Object.keys(roleAssignments).length) {
      throw new ConfigurationError("Provide at least one role assignment");
    }

    const response = await this.nevtanSign.createEnvelopeFromTemplate({
      $,
      workspaceId: this.workspaceId,
      templateId: this.templateId,
      data: {
        role_assignments: roleAssignments,
        subject: this.subject,
        message: this.message,
        is_ordered: this.isOrdered ?? false,
        expires_at: this.expiresAt,
        envelope_type: this.envelopeType,
      },
    });

    const envelopeId = this.nevtanSign.getEnvelopeId(response.data);
    $.export("$summary", `Successfully created draft envelope ${envelopeId}`);
    return response.data;
  },
};
