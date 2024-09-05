import common from "../common.mjs";
import pickBy from "lodash-es/pickBy.js";
import pick from "lodash-es/pick.js";

export default {
  ...common,
  key: "trello-update-card",
  name: "Update Card",
  description: "Updates a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-put)",
  version: "0.1.5",
  type: "action",
  props: {
    ...common.props,
    idBoard: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
    idCard: {
      propDefinition: [
        common.props.trello,
        "cards",
        (c) => ({
          board: c.idBoard,
        }),
      ],
      type: "string",
      label: "Card",
      description: "Specify the card to update",
      optional: false,
    },
    name: {
      propDefinition: [
        common.props.trello,
        "name",
      ],
      description: "The new name for the card.",
    },
    desc: {
      propDefinition: [
        common.props.trello,
        "desc",
      ],
      description: "The new description for the card.",
    },
    closed: {
      type: "boolean",
      label: "Archived",
      description: "Whether to archive the card",
      default: false,
    },
    idMembers: {
      propDefinition: [
        common.props.trello,
        "member",
        (c) => ({
          board: c.idBoard,
        }),
      ],
      type: "string[]",
      label: "Members",
      description: "Change the members that are assigned to the card",
      optional: true,
    },
    idAttachmentCover: {
      type: "string",
      label: "Cover",
      description:
        "Assign an attachment to be the cover image for the card",
      optional: true,
    },
    idList: {
      propDefinition: [
        common.props.trello,
        "lists",
        (c) => ({
          board: c.idBoard,
        }),
      ],
      type: "string",
      label: "List",
      description: "Move the card to a particular list",
    },
    idLabels: {
      propDefinition: [
        common.props.trello,
        "label",
        (c) => ({
          board: c.idBoard,
        }),
      ],
      type: "string[]",
      label: "Labels",
      description: "Array of labelIDs to add to the card",
      optional: true,
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
    customFieldIds: {
      propDefinition: [
        common.props.trello,
        "customFieldIds",
        (c) => ({
          boardId: c.idBoard,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.customFieldIds?.length) {
      return props;
    }
    for (const customFieldId of this.customFieldIds) {
      const customField = await this.trello.getCustomField(customFieldId);
      props[customFieldId] = {
        type: "string",
        label: `Value for Custom Field - ${customField.name}`,
      };
      if (customField.type === "list") {
        props[customFieldId].options = customField.options?.map((option) => ({
          value: option.id,
          label: option.value.text,
        })) || [];
      }
    }
    return props;
  },
  methods: {
    ...common.methods,
    async getCustomFieldItems($) {
      const customFieldItems = [];
      for (const customFieldId of this.customFieldIds) {
        const customField = await this.trello.getCustomField(customFieldId, $);
        const customFieldItem = {
          idCustomField: customFieldId,
        };
        if (customField.type === "list") {
          customFieldItem.idValue = this[customFieldId];
        } else if (customField.type === "checkbox") {
          customFieldItem.value = {
            checked: this[customFieldId],
          };
        } else {
          customFieldItem.value = {
            [customField.type]: this[customFieldId],
          };
        }
        customFieldItems.push(customFieldItem);
      }
      return customFieldItems;
    },
  },
  async run({ $ }) {
    const opts = pickBy(pick(this, [
      "name",
      "desc",
      "closed",
      "idMembers",
      "idAttachmentCover",
      "idList",
      "idLabels",
      "idBoard",
      "pos",
      "due",
      "dueComplete",
      "subscribed",
      "address",
      "locationName",
      "coordinates",
    ]));
    const res = await this.trello.updateCard(this.idCard, opts, $);

    if (this.customFieldIds) {
      const customFieldItems = await this.getCustomFieldItems($);
      const updatedCustomFields = await this.trello.updateCustomFields(this.idCard, {
        customFieldItems,
      }, $);
      res.updatedCustomFields = updatedCustomFields;
    }

    $.export("$summary", `Successfully updated card ${res.name}`);
    return res;
  },
};
