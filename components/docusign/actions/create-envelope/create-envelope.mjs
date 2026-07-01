import docusign from "../../docusign.app.mjs";
import {
  ENVELOPE_CREATION_STATUS_OPTIONS,
  parseJsonObject,
} from "../common/utils.mjs";

export default {
  key: "docusign-create-envelope",
  name: "Create Envelope",
  description: "Create a DocuSign envelope from a full envelope definition JSON payload. Use this for advanced cases such as multiple documents, multiple recipients, composite templates, custom tabs, or eventNotification webhooks. For a simpler single-document flow, use **Create Envelope From File**. [See the documentation](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopes/create/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    docusign,
    account: {
      propDefinition: [
        docusign,
        "account",
      ],
    },
    envelopeDefinitionJson: {
      type: "string",
      label: "Envelope Definition JSON",
      description: "A full DocuSign envelope definition JSON object. Example: `{\"emailSubject\":\"Please sign\",\"status\":\"sent\",\"documents\":[...],\"recipients\":{\"signers\":[...]}}`.",
    },
    status: {
      type: "string",
      label: "Status Override",
      description: "Optional envelope status override. Use `created` to save as a draft or `sent` to send immediately.",
      optional: true,
      options: ENVELOPE_CREATION_STATUS_OPTIONS,
    },
    mergeRolesOnDraft: {
      type: "boolean",
      label: "Merge Roles On Draft",
      description: "When creating a draft from multiple templates, merge template roles and remove empty recipients.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = parseJsonObject(this.envelopeDefinitionJson, "Envelope Definition JSON");
    if (this.status) {
      data.status = this.status;
    }

    const baseUri = await this.docusign.getBaseUri({
      $,
      accountId: this.account,
    });
    const response = await this.docusign.createEnvelope({
      $,
      baseUri,
      data,
      params: {
        merge_roles_on_draft: this.mergeRolesOnDraft,
      },
    });

    $.export("$summary", `Created envelope ${response.envelopeId || ""}`.trim());
    return response;
  },
};
