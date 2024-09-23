import fs from "fs";
import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import common from "../common.mjs";

export default {
  ...common,
  key: "trello-create-card",
  name: "Create Card",
  description: "Creates a new card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-post).",
  version: "0.1.0",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    name: {
      propDefinition: [
        common.props.app,
        "name",
      ],
      description: "The name of the card.",
      optional: false,
    },
    desc: {
      propDefinition: [
        common.props.app,
        "desc",
      ],
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
    },
    idList: {
      propDefinition: [
        common.props.app,
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
        common.props.app,
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
        common.props.app,
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
        common.props.app,
        "url",
      ],
    },
    mimeType: {
      propDefinition: [
        common.props.app,
        "mimeType",
      ],
    },
    file: {
      propDefinition: [
        common.props.app,
        "file",
      ],
    },
    idCardSource: {
      propDefinition: [
        common.props.app,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "Copy Card",
      description: "Specify an existing card to copy contents from. Keep in mind that if you copy a card, the **File Attachment Path**, **File Attachment URL** and **File Attachment Type** fields will be ignored.",
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
          boardId: c.board,
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
    createCard(args = {}) {
      return this.app.post({
        path: "/cards",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createCard,
      name,
      desc,
      pos,
      due,
      dueComplete,
      idList,
      idMembers,
      idLabels,
      urlSource,
      mimeType,
      file,
      idCardSource,
      keepFromSource,
      address,
      locationName,
      coordinates,
      customFieldIds,
    } = this;

    let response;
    const params = {
      name,
      desc,
      pos,
      due,
      dueComplete,
      idList,
      idMembers,
      idLabels,
      mimeType,
      idCardSource,
      keepFromSource: keepFromSource?.join(","),
      address,
      locationName,
      coordinates,
    };

    if (file && !file?.startsWith("/tmp")) {
      throw new ConfigurationError("The file path must be in the `/tmp` directory");
    }

    if (file) {
      const form = new FormData();
      form.append("fileSource", fs.createReadStream(file));

      response = await createCard({
        $,
        params,
        headers: form.getHeaders(),
        data: form,
      });

    } else {
      response = await createCard({
        $,
        params: {
          ...params,
          urlSource,
        },
      });
    }

    if (customFieldIds) {
      const customFieldItems = await this.getCustomFieldItems($);
      const customFields = await this.app.updateCustomFields({
        $,
        cardId: response.id,
        data: {
          customFieldItems,
        },
      });
      response.customFields = customFields;
    }

    $.export("$summary", `Successfully created card \`${response.id}\`.`);

    return response;
  },
};
