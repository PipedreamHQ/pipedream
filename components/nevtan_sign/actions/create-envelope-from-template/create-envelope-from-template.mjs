import { ConfigurationError } from "@pipedream/platform";
import nevtanSign from "../../nevtan_sign.app.mjs";
import {
  getEnvelopeId, parseObject,
} from "../../common/utils.mjs";

export default {
  key: "nevtan_sign-create-envelope-from-template",
  name: "Create Envelope From Template",
  description: "Create a draft envelope from a saved template, assigning a real email address to each template role."
    + " Use this to prepare a document for signature from a reusable template. The envelope is created as a draft and returned with its `_id`; this action does not send it to recipients."
    + " Use **List Envelope Types** to find an Envelope Type ID, and **List Envelopes** to check the envelope's status afterwards."
    + " [See the documentation](https://sign.nevtan.com/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
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
      description: "Map each role name defined on the template to the email address of the person filling that role. Example: `{\"Client\": \"alice@example.com\", \"Vendor\": \"bob@example.com\"}`",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject for the envelope. Defaults to the template title. Example: `Please sign: Master Services Agreement`",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message shown to recipients. Example: `Hi Alice, please review and sign by Friday.`",
      optional: true,
    },
    isOrdered: {
      type: "boolean",
      label: "Sign in Order",
      description: "Whether recipients must sign one after another, in the order of the role assignments. Example: `true`. Defaults to `false` (recipients can sign in any order).",
      optional: true,
      default: false,
    },
    expiresAt: {
      type: "string",
      label: "Expires At",
      description: "When the envelope expires, in ISO 8601 format. Example: `2026-12-31T23:59:59`",
      optional: true,
    },
    envelopeTypeId: {
      propDefinition: [
        nevtanSign,
        "envelopeTypeId",
      ],
      description: "The 24-character ID of the envelope (agreement) type. Example: `68b287ab757648f9b762cfa2`. Use **List Envelope Types** to find it (the `id` field). Leave blank to use the default type.",
      optional: true,
    },
  },
  async run({ $ }) {
    const roleAssignments = parseObject(this.roleAssignments);

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
        envelope_type: this.envelopeTypeId,
      },
    });

    $.export("$summary", `Successfully created draft envelope ${getEnvelopeId(response.data)}`);
    return response.data;
  },
};
