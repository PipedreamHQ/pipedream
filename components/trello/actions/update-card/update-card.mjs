import pick from "lodash-es/pick.js";
import pickBy from "lodash-es/pickBy.js";
import app from "../../trello.app.mjs";

export default {
  key: "trello-update-card",
  name: "Update Card",
  description: "Updates a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-put).",
  version: "0.2.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    idBoard: {
      propDefinition: [
        app,
        "board",
      ],
    },
    cardId: {
      propDefinition: [
        app,
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
        app,
        "name",
      ],
      description: "The new name for the card.",
    },
    desc: {
      propDefinition: [
        app,
        "desc",
      ],
      description: "The new description for the card.",
    },
    closed: {
      type: "boolean",
      label: "Archived",
      description: "Whether to archive the card",
      default: false,
      optional: true,
    },
    idMembers: {
      propDefinition: [
        app,
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
        app,
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
        app,
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
        app,
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
        app,
        "pos",
      ],
      description: "The position of the new card. `top`, `bottom`, or a positive float",
    },
    due: {
      propDefinition: [
        app,
        "due",
      ],
    },
    dueComplete: {
      propDefinition: [
        app,
        "dueComplete",
      ],
      description: "Whether the due date should be marked complete.",
      default: false,
    },
    subscribed: {
      type: "boolean",
      label: "Subscribed",
      description: "Whether the member should be subscribed to the card.",
      default: false,
      optional: true,
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
    locationName: {
      propDefinition: [
        app,
        "locationName",
      ],
    },
    coordinates: {
      propDefinition: [
        app,
        "coordinates",
      ],
    },
    customFieldIds: {
      propDefinition: [
        app,
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
