const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "trello-add-attachment-to-card-via-url",
  name: "Add Attachment to Card via URL",
  description: "Adds a file attachment on a card by referencing a public URL.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    idCard: {
      type: "string",
      label: "Id Card",
      description: "The ID of the Card to add the Attachment on. Must match pattern `^[0-9a-fA-F]{24}$`.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the attachment. Max length 256.",
      optional: true,
    },
    url: {
      type: "string",
      label: "File URL",
      description: "A URL to a file you'd like to attach. Must start with http:// or https://.",
      optional: true,
    },
    mimeType: {
      type: "string",
      label: "Mime Type",
      description: "The mimeType of the attachment. Max length 256.",
      optional: true,
    },
    setCover: {
      type: "boolean",
      label: "Set Cover?",
      description: "Determines whether to use the new attachment as a cover for the Card.",
      default: false,
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const constraints = {
      idCard: {
        presence: true,
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid Card id", {
              id: value,
            });
          },
        },
      },
    };
    if (this.name) {
      constraints.name = {
        length: {
          maximum: 256,
        },
      };
    }
    if (this.url) {
      constraints.urlSource = {
        url: true,
      };
    }
    if (this.mimeType) {
      constraints.mimeType = {
        length: {
          maximum: 256,
        },
      };
    }
    const validationResult = validate(
      {
        idCard: this.idCard,
        name: this.name,
        url: this.url,
        mimeType: this.mimeType,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.trello.addAttachmentToCardViaUrl(this.idCard, {
      name: this.name,
      url: this.url,
      mimeType: this.mimeType,
      setCover: this.setCover,
    });
  },
};
