import app from "../../saleslens.app.mjs";

export default {
  key: "saleslens-upload-conversation-recording",
  name: "Upload Conversation Recording",
  description: "Uploads a conversation recording. [See the documentation](https://app.saleslens.io/api#tag/ConversationRecord/operation/api_access_tokencall_recordupload_post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    employeeExternalId: {
      propDefinition: [
        app,
        "employeeExternalId",
      ],
    },
    downloadRecordUrl: {
      type: "string",
      label: "Download Record URL",
      description: "URL of the recording",
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
    locale: {
      propDefinition: [
        app,
        "locale",
      ],
    },
    fileExtension: {
      propDefinition: [
        app,
        "fileExtension",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    httpHeader: {
      propDefinition: [
        app,
        "httpHeader",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
  },
  methods: {
    uploadConversation(opts = {}) {
      return this.app.post({
        path: "/access_token/call_record/upload",
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadConversation,
      categoryId,
      ...data
    } = this;

    const response = await uploadConversation({
      $,
      data: {
        categoryId: categoryId && String(categoryId),
        ...data,
      },
    });

    $.export("$summary", "Successfully uploaded the conversation recording");
    return response;
  },
};
