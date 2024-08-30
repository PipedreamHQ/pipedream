import app from "../../pandadoc.app.mjs";

export default {
  key: "pandadoc-create-document-from-template",
  name: "Create Document From Template",
  description: "Create a Document from a PandaDoc Template. [See the documentation here](https://developers.pandadoc.com/reference/create-document-from-pandadoc-template)",
  type: "action",
  version: "0.0.7",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
      reloadProps: true,
      description: "The ID of a template you want to use. Note: if you want to **prefill fields in your template**, you need to map your template fields to the API fields following [the instruction here](https://developers.pandadoc.com/reference/create-document-from-pandadoc-template#prefilled-fields)",
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
      propDefinition: [
        app,
        "recipients",
      ],
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
  async additionalProps() {
    const props = {};
    const { fields } = await this.app.getTemplate({
      templateId: this.templateId,
    });
    for (const field of fields) {
      if (!field.merge_field) {
        continue;
      }
      props[field.merge_field] = {
        type: "string",
        label: `Field ${field.merge_field}`,
        optional: true,
      };
    }
    return props;
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

    const fields = {};
    const { fields: items } = await this.app.getTemplate({
      templateId: this.templateId,
    });
    for (const field of items) {
      if (!field.merge_field) {
        continue;
      }
      fields[field.merge_field] = {
        value: this[field.merge_field],
      };
    }

    const response = await this.app.createDocument({
      $,
      data: {
        name,
        template_uuid: templateId,
        folder_uuid: documentFolderId,
        tags,
        recipients: this.parseToAnyArray(recipients),
        tokens: this.parseToAnyArray(tokens),
        fields,
      },
    });

    $.export("$summary", `Successfully created document with template ID: ${templateId}`);
    return response;
  },
};
