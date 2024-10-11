import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import FormData from "form-data";
import app from "../../trello.app.mjs";

export default {
  key: "trello-add-attachment-to-card",
  name: "Add Attachment To Card",
  description: "Adds a file attachment on a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-attachments-post)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    board: {
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
        app,
        "name",
      ],
    },
    fileType: {
      propDefinition: [
        app,
        "fileType",
      ],
      reloadProps: true,
    },
    url: {
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
    setCover: {
      type: "boolean",
      label: "Set Cover?",
      description: "Determines whether to use the new attachment as a cover for the Card",
      default: false,
      optional: true,
    },
  },
  async additionalProps(props) {
    const attachmentIsPath = this.fileType === "path";
    const attachmentIsUrl = this.fileType === "url";
    props.file.hidden = !attachmentIsPath;
    props.mimeType.hidden = !attachmentIsPath;
    props.url.hidden = !attachmentIsUrl;

    return {};
  },
  async run({ $ }) {
    const {
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

      response = await this.app.addAttachmentToCard({
        $,
        cardId,
        params,
        headers: form.getHeaders(),
        data: form,
      });

    } else {
      response = await this.app.addAttachmentToCard({
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
