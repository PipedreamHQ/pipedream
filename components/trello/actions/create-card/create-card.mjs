import validate from "validate.js";
import common from "../common.js";

export default {
  ...common,
  key: "trello-create-card",
  name: "Create Card",
  description: "Creates a new card.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
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
      description: "The position of the new card. Valid values: `top`, `bottom`, or a positive float.",
      optional: true,
    },
    due: {
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
      propDefinition: [
        common.props.trello,
        "lists",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "List",
      description: "The ID of the list the card should be created in.",
      optional: false,
    },
    idMembers: {
      propDefinition: [
        common.props.trello,
        "member",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string[]",
      label: "Members",
      description: "Array of member IDs to add to the card",
      optional: true,
    },
    idLabels: {
      propDefinition: [
        common.props.trello,
        "label",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string[]",
      label: "Labels",
      description: "Array of labelIDs to add to the card",
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
      propDefinition: [
        common.props.trello,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "Id Card Source",
      description: "The ID of a card to copy into the new card",
    },
    keepFromSource: {
      type: "string",
      label: "Keep From Source",
      description: "If using `idCardSource` you can specify which properties to copy over. `all` or comma-separated list of: `attachments`, `checklists` , `comments`, `due`, `labels`, `members`, `stickers`.",
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
      description: "Latitude, longitude coordinates. For use with/by the Map Power-Up. Should take the form `lat, long`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name,
      desc,
      pos,
      due,
      dueComplete,
      idList,
      idMembers,
      idLabels,
      urlSource,
      fileSource,
      mimeType,
      idCardSource,
      keepFromSource,
      address,
      locationName,
      coordinates,
    } = this;
    const constraints = {
      idList: {
        presence: true,
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid List id", {
              id: value,
            });
          },
        },
      },
      mimeType: {
        length: {
          maximum: 256,
        },
      },
    };
    if (pos) {
      const posValidationMesssage = "Contains invalid values. Valid values are: `top`, `bottom`, or a positive float.";
      if (validate.isNumber(pos)) {
        constraints.pos = {
          numericality: {
            greaterThanOrEqualTo: 0,
          },
          message: posValidationMesssage,
        };
      } else if (validate.isString(pos)) {
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
    if (due) {
      constraints.due = {
        type: "date",
      };
    }
    if (idMembers) {
      constraints.idMembers = {
        type: "array",
      };
    }
    if (idLabels) {
      constraints.idLabels = {
        type: "array",
      };
    }
    if (urlSource) {
      constraints.urlSource = {
        url: true,
      };
    }
    if (idCardSource) {
      constraints.idCardSource = {
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid Card Source id", {
              id: value,
            });
          },
        },
      };
    }
    if (keepFromSource) {
      validate.validators.keepFromSourceValidator = function (
        keepFromSource,
        options,
      ) {
        let isValid = true;
        if (keepFromSource.length == 1) {
          isValid = keepFromSource.includes("all");
        } else {
          keepFromSource.forEach((keepFromSourceValue) => {
            isValid &= options.includes(keepFromSourceValue);
          });
        }
        if (isValid) {
          return null;
        }
        return "contains invalid values. Valid values are: a one element array with `all` as value or an multiple element array containing one or more of `attachments`, `checklists`, `comments`, `due`, `labels`, `members`, `stickers`.";
      };
      const options = [
        "attachments",
        "checklists",
        "comments",
        "due",
        "labels",
        "members",
        "stickers",
      ];
      constraints.keepFromSource = {
        type: "array",
        keepFromSourceValidator: options,
      };
    }
    if (coordinates) {
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
        idList,
        idCardSource,
        mimeType,
        idMembers,
        idLabels,
        pos,
        due,
        urlSource,
        keepFromSource,
        coordinates,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const res = await this.trello.createCard({
      name,
      desc,
      pos,
      due,
      dueComplete,
      idList,
      idMembers,
      idLabels,
      urlSource,
      fileSource,
      mimeType,
      idCardSource,
      keepFromSource,
      address,
      locationName,
      coordinates,
    }, $);
    $.export("$summary", `Successfully created card ${res.id}`);
    return res;
  },
};
