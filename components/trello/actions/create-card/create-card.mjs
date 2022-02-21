import validate from "validate.js";
import common from "../common.js";

export default {
  ...common,
  key: "trello-create-card",
  name: "Create Card",
  description: "Creates a new card. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-post)",
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
      propDefinition: [
        common.props.trello,
        "name",
      ],
      description: "The name of the card.",
      optional: false,
    },
    desc: {
      propDefinition: [
        common.props.trello,
        "desc",
      ],
    },
    pos: {
      propDefinition: [
        common.props.trello,
        "pos",
      ],
    },
    due: {
      propDefinition: [
        common.props.trello,
        "due",
      ],
    },
    dueComplete: {
      propDefinition: [
        common.props.trello,
        "dueComplete",
      ],
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
      propDefinition: [
        common.props.trello,
        "url",
      ],
      optional: true,
    }
    fileSource: {
      type: "string",
      label: "File Attachment Contents",
      description: "Value must be in binary format",
      optional: true,
    },
    mimeType: {
      propDefinition: [
        common.props.trello,
        "mimeType",
      ],
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
      label: "Copy Card",
      description: "Specify an existing card to copy contents from",
    },
    keepFromSource: {
      type: "string[]",
      label: "Copy From Source",
      description: "Specify which properties to copy from the source card",
      options: [
        "all",
        "attachments",
        "checklists",
        "comments",
        "due",
        "labels",
        "members",
        "stickers",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        common.props.trello,
        "address",
      ],
    },
    locationName: {
      propDefinition: [
        common.props.trello,
        "locationName",
      ],
    },
    coordinates: {
      propDefinition: [
        common.props.trello,
        "coordinates",
      ],
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
    const constraints = {};
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
    if (urlSource) {
      constraints.urlSource = {
        url: true,
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
        pos,
        due,
        urlSource,
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
