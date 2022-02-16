const validate = require("validate.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "trello-update-card",
  name: "Update Card",
  description: "Updates a card.",
  version: "0.0.13",
  type: "action",
  props: {
    ...props,
    idCard: {
      type: "string",
      label: "Id Card",
      description: "The ID of the card to be updated. Must match pattern `^[0-9a-fA-F]{24}$`.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The new name for the card.",
      optional: true,
    },
    desc: {
      type: "string",
      label: "Description",
      description: "The new description for the card.",
      optional: true,
    },
    closed: {
      type: "boolean",
      label: "Closed",
      description: "Whether the card should be archived (closed: true)",
      default: false,
    },
    idMembers: {
      type: "string[]",
      label: "Id Members",
      description: "String array of member IDs to add to the card.",
      optional: true,
    },
    idAttachmentCover: {
      type: "string",
      label: "Attachment Cover Id",
      description:
        "The ID of the image attachment the card should use as its cover, or `null` for none. Must match pattern `^[0-9a-fA-F]{24}$`.",
      optional: true,
    },
    idList: {
      type: "string",
      label: "Id List",
      description: "The ID of the list the card should be created in. Must match pattern `^[0-9a-fA-F]{24}$`.",
      optional: true,
    },
    idLabels: {
      type: "string[]",
      label: "Id Labels",
      description: "Array of label IDs to add to the card.",
      optional: true,
    },
    board: {
      propDefinition: [
        props.trello,
        "board",
      ],
      label: "Id Board",
      description: "The ID of the board containing the card to update is located. Must match pattern `^[0-9a-fA-F]{24}$`.",
    },
    pos: {
      type: "string",
      label: "Position",
      description:
        "The position of the new card. Valid values: `top`, `bottom`, or a positive float.",
      optional: true,
    },
    due: {
      type: "string",
      label: "Due Date",
      description: "When the card is due, or `null`.",
      optional: true,
    },
    dueComplete: {
      type: "boolean",
      label: "Due Complete",
      description: "Whether the due date should be marked complete.",
      default: false,
    },
    subscribed: {
      type: "boolean",
      label: "Subscribed",
      description: "Whether the member is should be subscribed to the card.",
      default: false,
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
        "For use with/by the Map Power-Up. Should take the form latitude, longitude.",
      optional: true,
    },
    cover: {
      type: "object",
      label: "Cover",
      description:
        "Updates the card's cover.",
      optional: true,
    },
  },
  methods: {
    ...methods,
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
    if (this.idMembers) {
      constraints.idMembers = {
        type: "array",
      };
    }
    if (this.idAttachmentCover) {
      constraints.idAttachmentCover = {
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid Attachment Cover id", {
              id: value,
            });
          },
        },
      };
    }
    if (this.idList) {
      constraints.idList = {
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid List id", {
              id: value,
            });
          },
        },
      };
    }
    if (this.idLabels) {
      constraints.idLabels = {
        type: "array",
      };
    }
    if (this.board) {
      constraints.board = {
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid Board id", {
              id: value,
            });
          },
        },
      };
    }
    if (this.pos) {
      const posValidationMesssage =
          "contains invalid values. Valid values are: `top`, `bottom`, or a positive float.";
      if (validate.isNumber(this.pos)) {
        constraints.pos = {
          numericality: {
            greaterThanOrEqualTo: 0,
          },
          message: posValidationMesssage,
        };
      } else if (validate.isString(this.pos)) {
        const options = [
          "top",
          "bottom",
        ];
        validate.validators.posStringValidator = function (
          posString,
          options,
        ) {
          return options.includes(posString) ?
            null :
            posValidationMesssage;
        };
        constraints.pos = {
          posStringValidator: options,
        };
      }
    }
    if (this.due) {
      constraints.due = {
        type: "date",
      };
    }
    if (this.coordinates) {
      constraints.coordinates = {
        format: {
          pattern: "^(-?\\d+(\\.\\d+)?),\\s*(-?\\d+(\\.\\d+)?)$",
          message: function (value) {
            return validate.format(
              "^%{id} doesn't use a valid `latitud, longitud` format.",
              {
                id: value,
              },
            );
          },
        },
      };
    }
    const validationResult = validate(
      {
        idCard: this.idCard,
        idMembers: this.idMembers,
        idAttachmentCover: this.idAttachmentCover,
        idList: this.idList,
        idLabels: this.idLabels,
        board: this.board,
        pos: this.pos,
        due: this.due,
        coordinates: this.coordinates,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    //Need to send only defined props, otherwise request against Trello API
    //endpoint for updateCard fails
    const opts = {};
    if (this.name) {
      opts.name = this.name;
    }
    if (this.desc) {
      opts.desc = this.desc;
    }
    if (this.closed) {
      opts.closed = this.closed;
    }
    if (this.idMembers) {
      opts.idMembers = this.idMembers;
    }
    if (this.idAttachmentCover) {
      opts.idAttachmentCover = this.idAttachmentCover;
    }
    if (this.idList) {
      opts.idList = this.idList;
    }
    if (this.idLabels) {
      opts.idLabels = this.idLabels;
    }
    if (this.board) {
      opts.idBoard = this.board;
    }
    if (this.pos) {
      opts.pos = this.pos;
    }
    if (this.due) {
      opts.due = this.due;
    }
    if (this.dueComplete) {
      opts.dueComplete = this.dueComplete;
    }
    if (this.subscribed) {
      opts.subscribed = this.subscribed;
    }
    if (this.address) {
      opts.address = this.address;
    }
    if (this.locationName) {
      opts.locationName = this.locationName;
    }
    if (this.coordinates) {
      opts.coordinates = this.coordinates;
    }
    if (this.cover) {
      opts.cover = this.cover;
    }
    return await this.trello.updateCard(this.idCard, opts);
  },
};
