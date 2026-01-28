import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import app from "../../trello.app.mjs";

export default {
  key: "trello-add-attachment-to-card",
  name: "Add Attachment To Card",
  description: "Adds a file attachment on a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-attachments-post)",
  version: "1.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    file: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
    },
    mimeType: {
      propDefinition: [
        app,
        "mimeType",
      ],
    },
    setCover: {
      type: "boolean",
      label: "Set Cover?",
      description: "Determines whether to use the new attachment as a cover for the Card",
      default: false,
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      cardId,
      name,
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

    const form = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(file);

    form.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    response = await this.app.addAttachmentToCard({
      $,
      cardId,
      params,
      headers: form.getHeaders(),
      data: form,
    });

    $.export("$summary", `Successfully added attachement to card ${cardId}`);
    return response;
  },
};
