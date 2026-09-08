import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cpfcnpj",
  propDefinitions: {
    documento: {
      type: "string",
      label: "Document Number",
      description: "The document number to look up. Use a CPF for people (11 digits) or a CNPJ for companies (14 digits). Formatting characters such as dots, slashes and dashes are accepted.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.cpfcnpj.com.br";
    },
    _token() {
      return this.$auth.token;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        pacote,
        documento,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method: "GET",
        url: `${this._baseUrl()}/${this._token()}/${pacote}/${documento}`,
        headers: {
          "Accept": "application/json",
        },
      });
    },
    async consultarCnpj({
      pacote, documento, ...args
    } = {}) {
      return this._makeRequest({
        pacote,
        documento,
        ...args,
      });
    },
    async consultarCpf({
      pacote, documento, ...args
    } = {}) {
      return this._makeRequest({
        pacote,
        documento,
        ...args,
      });
    },
  },
};
