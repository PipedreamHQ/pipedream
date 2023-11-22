import saleslens from "../../saleslens.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "saleslens-upload-conversation-recording",
  name: "Upload Conversation Recording",
  description: "Uploads a conversation recording. [See the documentation](https://app.saleslens.io/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    saleslens,
    employeeExternalId: {
      propDefinition: [
        saleslens,
        "employeeExternalId",
      ],
    },
    categoryId: {
      propDefinition: [
        saleslens,
        "categoryId",
      ],
    },
    locale: {
      propDefinition: [
        saleslens,
        "locale",
      ],
    },
    title: {
      propDefinition: [
        saleslens,
        "title",
      ],
    },
    fileExtension: {
      propDefinition: [
        saleslens,
        "fileExtension",
      ],
    },
    httpHeader: {
      propDefinition: [
        saleslens,
        "httpHeader",
      ],
    },
    tags: {
      propDefinition: [
        saleslens,
        "tags",
      ],
    },
    email: {
      propDefinition: [
        saleslens,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        saleslens,
        "phone",
      ],
    },
    firstName: {
      propDefinition: [
        saleslens,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        saleslens,
        "lastName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.saleslens.uploadConversation({
      employeeExternalId: this.employeeExternalId,
      categoryId: this.categoryId,
      locale: this.locale,
      title: this.title,
      fileExtension: this.fileExtension,
      httpHeader: this.httpHeader,
      tags: this.tags,
      email: this.email,
      phone: this.phone,
      firstName: this.firstName,
      lastName: this.lastName,
    });

    $.export("$summary", "Successfully uploaded the conversation recording");
    return response;
  },
};
