import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "acymailing",
  propDefinitions: {
    lists: {
      type: "string[]",
      label: "Lists",
      description: "Array of list names.",
      async options() {
        const { items } = await this.getLists();
        return items.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    userData: {
      type: "object",
      label: "User Data",
      description: "User data including at least a unique identifier (e.g., email).",
    },
    userEmail: {
      type: "string",
      label: "User Email",
      description: "The user's unique identifier (e.g., email).",
    },
    emailContent: {
      type: "string",
      label: "Email Content",
      description: "The content of the email to send.",
    },
    listIds: {
      type: "string[]",
      label: "List IDs",
      description: "Array of list IDs.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.example.com/index.php";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}?page=acymailing_front&option=com_acym&ctrl=api&task=${path}`,
        headers: {
          ...headers,
          "Api-Key": `${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async getLists() {
      return this._makeRequest({
        path: "getLists",
      });
    },
    async createUserOrUpdate(userData) {
      return this._makeRequest({
        method: "POST",
        path: "createOrUpdateUser",
        data: userData,
      });
    },
    async sendEmailToUser(userEmail, emailContent) {
      return this._makeRequest({
        method: "POST",
        path: "sendEmailToSingleUser",
        data: {
          email: userEmail,
          content: emailContent,
        },
      });
    },
    async subscribeUserToLists(userEmail, listIds) {
      return this._makeRequest({
        method: "POST",
        path: "subscribeUsers",
        data: {
          emails: [
            userEmail,
          ],
          listIds,
        },
      });
    },
  },
};
