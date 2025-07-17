import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-create-message-template",
  name: "Create Message Template",
  description: "Create a new message template. [See the documentation](https://dev.frontapp.com/reference/create-message-template).",
  version: "0.0.1",
  type: "action",
  props: {
    frontApp,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the message template",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the message template",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "Body of the message template. You can supply HTML with inline CSS to structure and style your template",
    },
    folderId: {
      propDefinition: [
        frontApp,
        "folderId",
      ],
      description: "ID of the message template folder to place this message template in",
    },
    inboxIds: {
      type: "string[]",
      label: "Inbox IDs",
      description: "The specific inboxes this template is available in. If not specified, it will be available in all inboxes",
      propDefinition: [
        frontApp,
        "inboxId",
      ],
      optional: true,
    },
    attachments: {
      propDefinition: [
        frontApp,
        "attachments",
      ],
    },
  },
  async run({ $ }) {
    const {
      frontApp,
      name,
      subject,
      body,
      folderId,
      inboxIds,
      attachments,
    } = this;

    let data, headers = {};

    // Handle attachments if provided
    if (attachments?.length > 0) {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("body", body);
      formData.append("subject", subject);
      formData.append("folder_id", folderId);
      formData.append("inbox_ids", inboxIds);

      for (const attachment of attachments) {
        const {
          stream, metadata,
        } = await getFileStreamAndMetadata(attachment);
        formData.append("attachments", stream, {
          contentType: metadata.contentType,
          knownLength: metadata.size,
          filename: metadata.name,
        });
      }

      data = formData;
      headers = formData.getHeaders();
    } else {
      // Simple JSON request without attachments
      data = {
        name,
        subject,
        body,
        folder_id: folderId,
        inbox_ids: inboxIds,
      };
    }

    const response = await frontApp.createMessageTemplate({
      data,
      headers,
      $,
    });

    $.export("$summary", `Successfully created message template "${name}"`);
    return response;
  },
};
