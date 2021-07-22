const trello = require("../../trello.app");
const validate = require("validate.js");
const common = require("../common");

module.exports = {
  key: "trello-create-card",
  name: "Create Card",
  description: "Creates a new card.",
  version: "0.0.1",
  type: "action",
  props: {
    trello,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the card.",
      optional: true,
    },
    desc: {
      type: "string",
      label: "Description",
      description: "The description for the card.",
      optional: true,
    },
    pos: {
      type: "string",
      label: "Position",
      description:
        "The position of the new card. Valid values: `top`, `bottom`, or a positive float.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date for the card.",
      optional: true,
    },
    dueComplete: {
      type: "boolean",
      label: "Due Complete",
      description: "Flag that indicates if `dueDate` expired.",
      optional: true,
    },
    idList: {
      type: "string",
      label: "Id List",
      description: "The ID of the list the card should be created in.",
    },
    idMembers: {
      type: "object",
      label: "Id Members",
      description: "Array of member IDs to add to the card.",
      optional: true,
    },
    idLabels: {
      type: "object",
      label: "Id Labels",
      description: "Array of label IDs to add to the card.",
      optional: true,
    },
    urlSource: {
      type: "string",
      label: "Url Source",
      description: "A URL starting with `http://` or `https://`.",
      optional: true,
    },
    fileSource: {
      type: "string",
      label: "File Source",
      description: "Format: `binary`.",
      optional: true,
    },
    mimeType: {
      type: "string",
      label: "Mime Type",
      description: "The mimeType of the attachment. Max length 256.",
      optional: true,
    },
    idCardSource: {
      type: "string",
      label: "Id Card Source",
      description: "The ID of a card to copy into the new card.",
      optional: true,
    },
    keepFromSource: {
      type: "string",
      label: "Keep From Source",
      description:
        "If using `idCardSource` you can specify which properties to copy over. `all` or comma-separated list of: `attachments`, `checklists` , `comments`, `due`, `labels`, `members`, `stickers`.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "For use with/by the Map Power-Up.",
      optional: true,
    },
    locationName: {
      type: "string",
      label: "Location Name",
      description: "For use with/by the Map Power-Up.",
      optional: true,
    },
    coordinates: {
      type: "string",
      label: "Coordinates",
      description:
        "For use with/by the Map Power-Up. Should take the form latitude,longitude.",
      optional: true,
    },
  },
  methods: {
    ...common,
  },
  async run() {
    const constraints = {
      idList: {
        presence: true,
      },
    };
    const validationResult = validate(
      {
        idList: this.idList,
      },
      constraints,
    );
    if (this.idMembers) {
      constraints.idMembers = {
        type: "array",
      };
    }
    if (this.idLabels) {
      constraints.idLabels = {
        type: "array",
      };
    }
    this.checkValidationResults(validationResult);
    return await this.trello.createCard(
      this.name,
      this.desc,
      this.pos,
      this.dueDate,
      this.dueComplete,
      this.idList,
      this.idMembers,
      this.idLabels,
      this.urlSource,
      this.fileSource,
      this.mimeType,
      this.idCardSource,
      this.keepFromSource,
      this.address,
      this.locationName,
      this.coordinates,
    );
  },
};
