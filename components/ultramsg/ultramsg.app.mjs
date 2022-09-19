import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ultramsg",
  propDefinitions: {
    to: {
      type: "string",
      label: "To",
      description: "Phone with international format e.g. `+1408XXXXXXX` , or chatID for contact or group",
      useQuery: true,
      async options({ query }) {
        const {
          contacts,
          chats,
        } = await this.getChatsAndContacts(this, query);
        const map = new Map();

        contacts.forEach((contact) => {
          map.set(contact.id, {
            label: contact.name,
            value: contact.id,
          });
        });

        chats.forEach((chat) => {
          map.set(chat.id, {
            label: chat.name,
            value: chat.id,
          });
        });

        return Array.from(map.values());
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://api.ultramsg.com/${this.$auth.instance_id}`;
    },
    _getAxiosParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        data: this._getAxiosConvertedData(opts.data),
      };
    },
    _getAxiosConvertedData(data) {
      return new URLSearchParams({
        token: this.$auth.token,
        ...data,
      });
    },
    _getHeaders() {
      return {
        "content-type": "application/x-www-form-urlencoded",
      };
    },
    async getChatsAndContacts(ctx = this, query = "") {
      const contacts = (await axios(ctx, this._getAxiosParams({
        method: "GET",
        path: "/contacts",
      })))
        .filter((contact) => contact.name.toLowerCase().includes(query.toLowerCase()));

      const chats = (await axios(ctx, this._getAxiosParams({
        method: "GET",
        path: "/chats",
      })))
        .filter((chat) => chat.name.toLowerCase().includes(query.toLowerCase()));

      return {
        contacts,
        chats,
      };
    },
    async sendMessage(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/chat",
        data,
      }));
    },
    async sendImage(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/image",
        data,
      }));
    },
    async sendDocument(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/document",
        data,
      }));
    },
    async sendAudio(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/audio",
        data,
      }));
    },
    async sendVideo(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/video",
        data,
      }));
    },
    async sendLink(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/link",
        data,
      }));
    },
    async sendLocation(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/location",
        data,
      }));
    },
  },
};
