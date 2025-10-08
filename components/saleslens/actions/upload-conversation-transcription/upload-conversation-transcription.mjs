import app from "../../saleslens.app.mjs";

export default {
  key: "saleslens-upload-conversation-transcription",
  name: "Upload Conversation Transcription",
  description: "Uploads a transcript of the conversation. [See the documentation](https://app.saleslens.io/api#tag/ConversationTranscription/operation/api_access_tokencall_transcriptionupload_post)",
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
    transcription: {
      type: "string",
      label: "Transcription",
      description: "The transcription of the conversation",
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
    title: {
      propDefinition: [
        app,
        "title",
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
    uploadTranscription(args = {}) {
      return this.app.post({
        path: "/access_token/call_transcription/upload",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadTranscription,
      categoryId,
      ...data
    } = this;

    const response = await uploadTranscription({
      $,
      data: {
        categoryId: categoryId && String(categoryId),
        ...data,
      },
    });

    $.export("$summary", "Successfully uploaded the conversation transcription");
    return response;
  },
};
