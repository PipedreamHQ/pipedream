import app from "../../pandadoc.app.mjs";

export default {
  key: "pandadoc-create-document-from-template",
  name: "Create Document From Template",
  description: "Create Document from PandaDoc Template. [See the docs here](https://developers.pandadoc.com/reference/create-document-from-pandadoc-template)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    name: {
      type: "string",
      label: "Document Name",
      description: "Specify the document's name.",
    },
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
    documentFolderId: {
      propDefinition: [
        app,
        "documentFolderId",
      ],
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Mark your document with one or several tags.",
      optional: true,
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: `The list of recipients you're sending the document to. Every object must contain the email parameter. 
      The role, first_name and last_name parameters are optional. If the role parameter passed, a person is assigned all fields matching their corresponding role. 
      If not passed, a person will receive a read-only link to view the document. 
      If the first_name and last_name not passed the system: 1. creates a new contact, 
      if none exists with the given email; or 2. gets the existing contact with the given email that already exists.
      \n\nE.g. \`{ "email": "john.doe@pipedream.com", "first_name": "John", "last_name": "Doe" }\``,
    },
    tokens: {
      type: "string[]",
      label: "Tokens",
      description: `You may pass a list of tokens/values to pre-fill tokens (variables) used in a template. 
      Name is a token (variable) name in a template. 
      Value is a real value you would like to replace a token (variable) with.
      \n\nE.g. \`{ "name": "Favorite.Pet", "value": "Dog Doe" }\``,
      optional: true,
    },
  },
  methods: {
    parseToAnyArray(arr) {
      if (!arr) {
        return undefined;
      }
      return arr.map((item) => {
        if (typeof (item) === "string") {
          return JSON.parse(item);
        }
        return item;
      });
    },
  },
  async run({ $ }) {
    const {
      name,
      templateId,
      documentFolderId,
      tags,
      recipients,
      tokens,
    } = this;

    const response = await this.app.createDocumentFromTemplate({
      $,
      data: {
        name,
        template_uuid: templateId,
        folder_uuid: documentFolderId,
        tags,
        recipients: this.parseToAnyArray(recipients),
        tokens: this.parseToAnyArray(tokens),
      },
    });

    $.export("$summary", `Successfully created document with template ID: ${templateId}`);
    return response;
  },
};
