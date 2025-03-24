import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "clearly_defined",
  propDefinitions: {
    type: {
      type: "string",
      label: "Type",
      description: "The type of component",
      options: constants.COMPONENT_TYPES,
    },
    provider: {
      type: "string",
      label: "Provider",
      description: "Where the component can be found",
      options: constants.COMPONENT_PROVIDERS,
    },
    namespace: {
      type: "string",
      label: "Namespace",
      description: "Many component systems have namespaces. GitHub orgs, NPM namespace, Maven group id, Conda Subdir/Architecture. If your component does not have a namespace, use '-' (ASCII hyphen).",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the component you want",
    },
    revision: {
      type: "string",
      label: "Revision",
      description: "Components typically have some differentiator like a version or commit id. Use that here. If this segment is omitted, the latest revision is used (if that makes sense for the provider).",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The field to sort the results by",
      options: constants.SORT_FIELDS,
      optional: true,
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "The direction to sort the results by",
      options: constants.SORT_DIRECTIONS,
      optional: true,
    },
    form: {
      type: "string",
      label: "Form",
      description: "Form of the response",
      options: constants.RESPONSE_FORMS,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.environment}.clearlydefined.io`;
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        ...opts,
      });
    },
    getDefinitions(opts = {}) {
      return this._makeRequest({
        path: "/definitions",
        ...opts,
      });
    },
    getHarvests({
      type, provider, namespace, name, revision, ...opts
    }) {
      return this._makeRequest({
        path: `/harvest/${type}/${provider}/${namespace}/${name}/${revision}`,
        ...opts,
      });
    },
    createDefinition(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/definitions",
        ...opts,
      });
    },
  },
};
