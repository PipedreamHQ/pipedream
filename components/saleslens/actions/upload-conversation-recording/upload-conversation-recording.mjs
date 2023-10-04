import saleslens from "../../saleslens.app.mjs";

export default {
  key: "saleslens-upload-conversation-recording",
  name: "Upload Conversation Recording",
  description: "Upload a conversation recording to Saleslens. [See the documentation](https://app.saleslens.io/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    saleslens,
    employeeExternalId: {
      propDefinition: [
        saleslens,
        "employeeExternalId"
      ]
    },
    categoryId: {
      propDefinition: [
        saleslens,
        "categoryId"
      ]
    },
    downloadRecordUrl: {
      type: "string",
      label: "Download Record URL",
      description: "The URL from where the conversation recording can be downloaded",
    },
    locale: {
      propDefinition: [
        saleslens,
        "locale"
      ]
    },
    title: {
      propDefinition: [
        saleslens,
        "title"
      ]
    },
    fileExtension: {
      propDefinition: [
        saleslens,
        "fileExtension"
      ]
    },
    httpHeader: {
      propDefinition: [
        saleslens,
        "httpHeader"
      ]
    },
    tags: {
      propDefinition: [
        saleslens,
        "tags"
      ]
    },
    email: {
      propDefinition: [
        saleslens,
        "email"
      ]
    },
    phone: {
      propDefinition: [
        saleslens,
        "phone"
      ]
    },
    firstName: {
      propDefinition: [
        saleslens,
        "firstName"
      ]
    },
    lastName: {
      propDefinition: [
        saleslens,
        "lastName"
      ]
    },
  },
  async run({ $ }) {
    const response = await this.saleslens.uploadConversation({
      method: "POST",
      data: {
        employeeExternalId: this.employeeExternalId,
        downloadRecordUrl: this.downloadRecordUrl,
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
      },
    });
    $.export("$summary", "Successfully uploaded conversation recording");
    return response;
  },
};