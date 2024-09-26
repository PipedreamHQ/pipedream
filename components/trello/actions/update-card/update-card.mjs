import common from "../common.mjs";
import pickBy from "lodash-es/pickBy.js";
import pick from "lodash-es/pick.js";

export default {
  ...common,
  key: "trello-update-card",
  name: "Update Card",
  description: "Updates a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-put).",
  version: "0.2.0",
  type: "action",
  props: {
    ...common.props,
    idBoard: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    cardId: {
      propDefinition: [
        common.props.app,
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
        common.props.app,
        "name",
      ],
      description: "The new name for the card.",
    },
    desc: {
      propDefinition: [
        common.props.app,
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
        common.props.app,
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
      propDefinition: [
        common.props.app,
        "cardAttachmentId",
        ({ cardId }) => ({
          cardId,
          params: {
            filter: "cover",
          },
        }),
      ],
    },
    idList: {
      propDefinition: [
        common.props.app,
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
        common.props.app,
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
        common.props.app,
        "pos",
      ],
    },
    due: {
      propDefinition: [
        common.props.app,
        "due",
      ],
    },
    dueComplete: {
      propDefinition: [
        common.props.app,
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
        common.props.app,
        "address",
      ],
    },
    locationName: {
      propDefinition: [
        common.props.app,
        "locationName",
      ],
    },
    coordinates: {
      propDefinition: [
        common.props.app,
        "coordinates",
      ],
    },
    customFieldIds: {
      propDefinition: [
        common.props.app,
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
      const customField = await this.app.getCustomField({
        customFieldId,
      });
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
        const customField = await this.app.getCustomField({
          $,
          customFieldId,
        });
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
    const res = await this.app.updateCard({
      $,
      cardId: this.cardId,
      data: pickBy(pick(this, [
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
      ])),
    });

    if (this.customFieldIds) {
      const customFieldItems = await this.getCustomFieldItems($);
      const updatedCustomFields = await this.app.updateCustomFields({
        $,
        cardId: this.cardId,
        data: {
          customFieldItems,
        },
      });
      res.updatedCustomFields = updatedCustomFields;
    }

    $.export("$summary", `Successfully updated card ${res.name}`);
    return res;
  },
};
