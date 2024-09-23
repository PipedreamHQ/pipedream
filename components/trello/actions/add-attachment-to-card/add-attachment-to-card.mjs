import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import FormData from "form-data";
import common from "../common.mjs";

export default {
  ...common,
  key: "trello-add-attachment-to-card",
  name: "Add Attachment To Card",
  description: "Adds a file attachment on a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-attachments-post)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    board: {
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
          board: c.board,
        }),
      ],
      type: "string",
      label: "Card",
      description: "The ID of the Card to add the Attachment to",
      optional: false,
    },
    name: {
      propDefinition: [
        common.props.app,
        "name",
      ],
    },
    url: {
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
    setCover: {
      type: "boolean",
      label: "Set Cover?",
      description: "Determines whether to use the new attachment as a cover for the Card",
      default: false,
    },
  },
  methods: {
    ...common.methods,
    addAttachmentToCard({
      cardId, ...args
    } = {}) {
      return this.app.post({
        path: `/cards/${cardId}/attachments`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addAttachmentToCard,
      cardId,
      name,
      url,
      mimeType,
      setCover,
      file,
    } = this;

    let response;
    const params = {
      name,
      mimeType,
      setCover,
    };

    if (file && !file?.startsWith("/tmp")) {
      throw new ConfigurationError("The file path must be in the `/tmp` directory");
    }

    if (file) {
      const form = new FormData();
      form.append("file", fs.createReadStream(file));

      response = await addAttachmentToCard({
        $,
        cardId,
        params,
        headers: form.getHeaders(),
        data: form,
      });

    } else {
      response = await addAttachmentToCard({
        $,
        cardId,
        params: {
          ...params,
          url,
        },
      });
    }

    $.export("$summary", `Successfully added attachement to card ${cardId}`);
    return response;
  },
};
