import saleslens from "../../saleslens.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "saleslens-upload-conversation-transcription",
  name: "Upload Conversation Transcription",
  description: "Uploads a transcript of the conversation. [See the documentation](https://app.saleslens.io/api)",
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
    transcription: {
      propDefinition: [
        saleslens,
        "transcription",
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
    const response = await this.saleslens.uploadTranscription({
      data: {
        employeeExternalId: this.employeeExternalId,
        categoryId: this.categoryId,
        transcription: this.transcription,
        locale: this.locale,
        title: this.title,
        tags: this.tags,
        email: this.email,
        phone: this.phone,
        firstName: this.firstName,
        lastName: this.lastName,
      },
    });

    $.export("$summary", "Successfully uploaded the conversation transcription");
    return response;
  },
};
