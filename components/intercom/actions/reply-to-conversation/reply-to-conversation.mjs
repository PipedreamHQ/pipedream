import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-reply-to-conversation",
  name: "Reply To Conversation",
  description: "Add a reply or a note to an existing conversation thread. [See the documentation](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/conversations/replyconversation).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    intercom,
    conversationId: {
      propDefinition: [
        intercom,
        "conversationId",
      ],
    },
    replyType: {
      type: "string",
      label: "Reply Type",
      description: "The type of the reply.",
      options: [
        {
          label: "Contact Reply",
          value: "user",
        },
        {
          label: "Admin Reply",
          value: "admin",
        },
      ],
      reloadProps: true,
    },
    messageType: {
      propDefinition: [
        intercom,
        "messageType",
        ({ replyType: type }) => ({
          type,
        }),
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "The text body of the comment.",
    },
    attachmentUrls: {
      type: "string[]",
      label: "Attachment URLs",
      description: "A list of image URLs that will be added as attachments. You can include up to 10 URLs.",
      optional: true,
    },
  },
  additionalProps() {
    const {
      replyType,
      replyOnBehalfOf,
    } = this;

    if (replyType === "admin") {
      return {
        adminId: {
          type: "string",
          label: "Admin ID",
          description: "The id of the admin who is authoring the comment.",
          options: async () => {
            const { admins } = await this.intercom.listAdmins();
            return admins.map((admin) => ({
              label: admin.name,
              value: admin.id,
            }));
          },
        },
      };
    }

    return {
      replyOnBehalfOf: {
        type: "string",
        label: "Reply On Behalf Of",
        description: "The user ID of the user on whose behalf the reply is being made.",
        options: [
          {
            label: "Intercom User ID",
            value: "intercom_user_id",
          },
          {
            label: "Email",
            value: "email",
          },
          {
            label: "User ID",
            value: "user_id",
          },
        ],
        reloadProps: true,
      },
      ...(replyOnBehalfOf === "intercom_user_id" && {
        intercomUserId: {
          type: "string",
          label: "Intercom User ID",
          description: "The identifier for the contact as given by Intercom.",
          options: async () => {
            const results = await this.intercom.searchContacts({
              query: {
                field: "role",
                operator: "=",
                value: "user",
              },
            });
            return results.map((user) => ({
              label: user.name || user.id,
              value: user.id,
            }));
          },
        },
      }),
      ...(replyOnBehalfOf === "email" && {
        email: {
          type: "string",
          label: "Email",
          description: "The email you have defined for the user.",
          options: async () => {
            const results = await this.intercom.searchContacts({
              query: {
                field: "role",
                operator: "=",
                value: "user",
              },
            });
            return results.map((user) => ({
              label: user.name || user.id,
              value: user.email,
            }));
          },
        },
      }),
      ...(replyOnBehalfOf === "user_id" && {
        userId: {
          type: "string",
          label: "User ID",
          description: "The external ID you have defined for the contact.",
          options: async () => {
            const results = await this.intercom.searchContacts({
              query: {
                field: "role",
                operator: "=",
                value: "user",
              },
            });
            return results.map((user) => ({
              label: user.name || user.id,
              value: user.external_id,
            }));
          },
        },
      }),
    };
  },
  methods: {
    replyToConversation({
      conversationId, ...args
    } = {}) {
      return this.intercom.makeRequest({
        method: "POST",
        endpoint: `conversations/${conversationId}/reply`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      replyToConversation,
      conversationId,
      body,
      attachmentUrls,
      replyType,
      adminId,
      intercomUserId,
      email,
      userId,
      messageType,
    } = this;

    const response = await replyToConversation({
      $,
      conversationId,
      data: {
        body,
        attachment_urls: attachmentUrls,
        admin_id: adminId,
        intercom_user_id: intercomUserId,
        email,
        user_id: userId,
        message_type: messageType,
        type: replyType,
      },
    });

    $.export("$summary", "Reply or note added successfully");
    return response;
  },
};
