import app from "../../trello.app.mjs";
import fs from "fs";
import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  key: "trello-create-card",
  name: "Create Card",
  description: "Creates a new card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-post).",
  version: "0.1.1",
  type: "action",
  props: {
    app,
    board: {
      propDefinition: [
        app,
        "board",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "The name of the card.",
      optional: false,
    },
    desc: {
      propDefinition: [
        app,
        "desc",
      ],
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
    },
    idList: {
      propDefinition: [
        app,
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
        app,
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
        app,
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
    fileType: {
      propDefinition: [
        app,
        "fileType",
      ],
      optional: true,
      reloadProps: true,
    },
    urlSource: {
      propDefinition: [
        app,
        "url",
      ],
      hidden: true,
    },
    file: {
      propDefinition: [
        app,
        "file",
      ],
      hidden: true,
    },
    mimeType: {
      propDefinition: [
        app,
        "mimeType",
      ],
      hidden: true,
    },
    idCardSource: {
      propDefinition: [
        app,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "Copy Card",
      description: "Specify an existing card to copy contents from. Keep in mind that if you copy a card, the **File Attachment Path**, **File Attachment URL** and **File Attachment Type** fields will be ignored.",
      reloadProps: true,
    },
    keepFromSource: {
      type: "string[]",
      label: "Copy From Source",
      description: "Specify which properties to copy from the source card",
      options: constants.CARD_KEEP_FROM_SOURCE_PROPERTIES,
      optional: true,
      hidden: true,
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
          boardId: c.board,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps(existingProps) {
    const props = {};

    const attachmentIsPath = this.fileType === "path";
    const attachmentIsUrl = this.fileType === "url";
    existingProps.file.hidden = !attachmentIsPath;
    existingProps.mimeType.hidden = !attachmentIsPath;
    existingProps.urlSource.hidden = !attachmentIsUrl;

    existingProps.keepFromSource.hidden = !this.idCardSource;

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

      response = await this.app.createCard({
        $,
        params,
        headers: form.getHeaders(),
        data: form,
      });
    } else {
      response = await this.app.createCard({
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
