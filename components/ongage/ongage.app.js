const axios = require("axios");
const Ongage = require("ongage");

module.exports = {
  type: "app",
  app: "ongage",
  methods: {
    _ongage (client) {
      return new Ongage[client](
        this.$auth.x_username,
        this.$auth.x_password,
        this.$auth.x_account_code,
      );
    },
    async _execute ({
      body, ...config
    }) {
      if (body) config.data = body;
      const res = await axios(config);
      return res.data;
    },
    async getLists (page) {
      const api = this._ongage("ListsApi");
      const req = api.getAll({
        sort: "name",
        order: "ASC",
        limit: 50,
        offset: 50 * page,
      });
      return await this._execute(req);
    },
    async subscribe (listId, email, fields = {}, overwrite = false) {
      const api = this._ongage("ContactsApi");
      const req = api.create({
        email,
        overwrite,
        fields,
      }, listId);
      return await this._execute(req);
    },
    async updateSubscriber (listId, email, fields = {}) {
      const api = this._ongage("ContactsApi");
      const req = api.update({
        email,
        fields,
      }, listId);
      return await this._execute(req);
    },
    async findSubscriber (email) {
      const api = this._ongage("ContactsApi");
      const req = api.getListsByEmail(email);
      return await this._execute(req);
    },
  },
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      async options ({ page }) {
        const { payload } = await this.getLists(page);
        return payload.map(list => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
    overwrite: {
      type: "boolean",
      label: "Overwrite?",
      default: false,
      description: "Whether to overwrite the specified fields if the subscriber already exists. Only the fields specified will be overwritten. For more information, see the [Ongage API documentation](https://ongage.atlassian.net/wiki/spaces/HELP/pages/1004175381/Contacts+API+Methods#ContactsAPIMethods-Description.3)",
    },
    haltOnError: {
      type: "boolean",
      label: "Halt on error?",
      default: true,
    },
    email: {
      type: "string",
      label: "Email Address",
    },
    fields: {
      type: "object",
      label: "List Fields",
    },
  },
};
