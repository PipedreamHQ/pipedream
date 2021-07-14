//Template for an action component in Pipedream
const trello = require("../../trello.app");
//--or--
//const common = require("../common");
//const { trello } = common.props;
//if this is used no need to add "trello" as props, it would be included in "common.prop"
module.exports = {
  ...common,
  key: "trello-create-card",
  name: "Create Card",
  description: "Creates a new card.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    trello,
    reusedProp: { propDefinition: [trello, "reusedProp"] },
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
      type: "string",
      label: "Id Members",
      description: "Comma-separated list of member IDs to add to the card.",
      optional: true,
    },
    idLabels: {
      type: "Id Labels",
      label: "Id Labels",
      description: "Comma-separated list of label IDs to add to the card.",
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
    ...common.methods,
    aRandonActionMethod() {
      return "value";
    },
  },
  async run() {
    if (!this.objectProp || !this.stringProp) {
      //Check for required parameters
      throw new Error("Must provide objectProp and stringProp parameters.");
    }
    const jsonStringProp = this.jsonStringProp
      ? JSON.parse(this.jsonStringProp)
      : null; //if prop is optional
    return await this.trello.actionKey(
      this.objectProp,
      jsonStringProp,
      this.stringProp
    );
  },
};
