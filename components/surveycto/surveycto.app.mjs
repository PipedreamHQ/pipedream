import { axios } from "@pipedream/platform";
import convert from "xml-js";

export default {
  type: "app",
  app: "surveycto",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to watch",
      async options() {
        const forms = await this.listForms();
        return forms.map(({
          formID, name,
        }) => ({
          value: formID._text,
          label: name._text,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.servername}.surveycto.com`;
    },
    _auth() {
      return {
        username: `${this.$auth.email}`,
        password: `${this.$auth.password}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
      });
    },
    async listForms() {
      const xml = await this._makeRequest({
        path: "/formList",
      });
      const { xforms } = JSON.parse(convert.xml2json(xml, {
        compact: true,
      }));
      return xforms?.xform;
    },
    listSubmissions({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/api/v2/forms/data/wide/json/${formId}`,
        ...opts,
      });
    },
  },
};
