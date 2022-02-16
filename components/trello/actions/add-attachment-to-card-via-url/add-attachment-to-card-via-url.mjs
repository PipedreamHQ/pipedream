import validate from "validate.js";
import common from "../common.js";

export default {
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
  async run({ $ }) {
    const {
      idCard,
      name,
      url,
      mimeType,
      setCover,
    } = this;
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
    if (name) {
      constraints.name = {
        length: {
          maximum: 256,
        },
      };
    }
    if (url) {
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
        idCard,
        name,
        url,
        mimeType,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return this.trello.addAttachmentToCardViaUrl(idCard, {
      name,
      url,
      mimeType,
      setCover,
    }, $);
  },
};
