import fynk from "../../fynk.app.mjs";

export default {
  key: "fynk-create-contract-from-template",
  name: "Create Contract from Template",
  description: "Create a new contract in Fynk based on an existing template. [See the documentation](https://app.fynk.com/v1/docs#/operations/v1.documents.create-from-template).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fynk,
    templateUuid: {
      propDefinition: [
        fynk,
        "templateUuid",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The new document's name. If omitted, the name of the template will be used as the new document's name",
      optional: true,
    },
    ownerEmails: {
      type: "string[]",
      label: "Owner Emails",
      description: "Email addresses of the user(s) from your account who should be given ownership of the new document",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      templateUuid,
      name,
      ownerEmails,
    } = this;

    const data = {
      template_uuid: templateUuid,
      name,
      owner_emails: ownerEmails,
    };

    const response = await this.fynk.createDocumentFromTemplate({
      $,
      data,
    });

    $.export("$summary", `Successfully created contract "${response.data.name}" with UUID ${response.data.uuid}`);
    return response;
  },
};

