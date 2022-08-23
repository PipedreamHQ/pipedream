import gmail from "@googleapis/gmail";

const USER_ID = "me";

export default {
  type: "app",
  app: "gmail",
  propDefinitions: {
    message: {
      type: "string",
      label: "Message",
      description: "An email message",
      async options({ prevContext }) {
        const {
          messages,
          nextPageToken,
        } = await this.listMessages({
          pageToken: prevContext?.nextPageToken,
        });

        const options = await Promise.all(messages.map(async (message) => {
          const subject = await this.getMessageSubject({
            id: message.id,
          });
          return {
            label: subject,
            value: message.id,
          };
        }));

        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    label: {
      type: "string",
      label: "Label",
      description: "Labels are used to categorize messages and threads within the user's mailbox",
      async options() {
        const { labels } = await this.listLabels();
        return labels.map((label) => ({
          label: label.name,
          value: label.id,
        }));
      },
    },
  },
  methods: {
    _client() {
      const auth = new gmail.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return gmail.gmail({
        version: "v1",
        auth,
      });
    },
    async listMessages({ pageToken }) {
      const { data } = await this._client().users.messages.list({
        userId: USER_ID,
        pageToken,
      });
      return data;
    },
    async getMessage({ id }) {
      const { data } = await this._client().users.messages.get({
        userId: USER_ID,
        id,
      });
      return data;
    },
    async getMessageSubject({ id }) {
      const message = await this.getMessage({
        id,
      });
      const { value: subject } = message.payload.headers.find(({ name }) => name === "Subject");
      return subject;
    },
    async listLabels() {
      const { data } = await this._client().users.labels.list({
        userId: USER_ID,
      });
      // user-created labels first
      data.labels.sort((a) => a.type === "system"
        ? 1
        : -1);
      return data;
    },
    async addLabelToEmail({
      message, label,
    }) {
      const response = await this._client().users.messages.modify({
        userId: USER_ID,
        id: message,
        requestBody: {
          addLabelIds: [
            label,
          ],
        },
      });
      return response.data;
    },
  },
};
