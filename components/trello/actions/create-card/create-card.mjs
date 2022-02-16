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
      type: "string",
      label: "Id List",
      description: "The ID of the list the card should be created in. Must match pattern `^[0-9a-fA-F]{24}$`.",
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
      description: "The ID of a card to copy into the new card. Must match pattern `^[0-9a-fA-F]{24}$`.",
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
        "Latitude, longitude coordinates. For use with/by the Map Power-Up. Should take the form `lat, long`.",
      optional: true,
    },
  },
  async run({ $ }) {
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
    if (this.urlSource) {
      constraints.urlSource = {
        url: true,
      };
    }
    if (this.idCardSource) {
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
    if (this.keepFromSource) {
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
        idList: this.idList,
        idCardSource: this.idCardSource,
        mimeType: this.mimeType,
        idMembers: this.idMembers,
        idLabels: this.idLabels,
        pos: this.pos,
        due: this.due,
        urlSource: this.urlSource,
        keepFromSource: this.keepFromSource,
        coordinates: this.coordinates,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return this.trello.createCard({
      name: this.name,
      desc: this.desc,
      pos: this.pos,
      due: this.due,
      dueComplete: this.dueComplete,
      idList: this.idList,
      idMembers: this.idMembers,
      idLabels: this.idLabels,
      urlSource: this.urlSource,
      fileSource: this.fileSource,
      mimeType: this.mimeType,
      idCardSource: this.idCardSource,
      keepFromSource: this.keepFromSource,
      address: this.address,
      locationName: this.locationName,
      coordinates: this.locationName,
    }, $);
  },
};
