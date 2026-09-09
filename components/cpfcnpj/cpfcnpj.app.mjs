import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cpfcnpj",
  propDefinitions: {
    documento: {
      type: "string",
      label: "Document Number",
      description: "The document number to look up. Use a CPF for people (11 digits) or a CNPJ for companies (14 digits). Formatting characters such as dots, slashes and dashes are accepted.",
    },
    pacoteCpf: {
      type: "string",
      label: "Package",
      description: "The data package that defines which fields are returned",
      options: constants.CPF_PACOTES,
      default: "3",
    },
    pacoteCnpj: {
      type: "string",
      label: "Package",
      description: "The data package that defines which fields are returned",
      options: constants.CNPJ_PACOTES,
      default: "6",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.cpfcnpj.com.br";
    },
    _token() {
      return this.$auth.token;
    },
    _normalizeDocumento(documento) {
      return `${documento}`.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
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
        url: `${this._baseUrl()}/${this._token()}/${pacote}/${this._normalizeDocumento(documento)}`,
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
