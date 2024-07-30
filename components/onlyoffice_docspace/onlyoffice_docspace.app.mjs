import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "onlyoffice_docspace",
  propDefinitions: {
    file: {
      type: "string",
      label: "File",
      description: "The file or folder ID.",
      async options({
        resourcesName = constants.RESOURCE_NAME.FOLDERS,
        mapper = ({
          id,
          title: label,
        }) => ({
          value: String(id),
          label,
        }),
        params = {
          filterType: constants.FILTER_TYPE.FOLDERS_ONLY,
          withsubfolders: true,
        },
      }) {
        const { response: { [resourcesName]: resources } } =
          await this.listMyFilesAndFolders({
            params,
          });
        return resources.map(mapper);
      },
    },
  },
  methods: {
    getUrl(path) {
      const baseUrl = constants.BASE_URL
        .replace(constants.SUBDOMAIN_PLACEHOLDER, this.$auth.subdomain);
      return `${baseUrl}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": this.$auth.oauth_access_token,
        ...headers,
      };
    },
    getConfig({
      headers, data: preData, ...args
    } = {}) {
      const contentType = constants.CONTENT_TYPE_KEY_HEADER;
      const hasMultipartHeader = utils.hasMultipartHeader(headers);
      const data = hasMultipartHeader && utils.getFormData(preData) || preData;
      const currentHeaders = this.getHeaders(headers);

      return {
        headers: hasMultipartHeader
          ? {
            ...currentHeaders,
            [contentType]: data.getHeaders()[contentType.toLowerCase()],
          }
          : currentHeaders,
        data,
        ...args,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = this.getConfig({
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        ...args,
      });
      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listMyFilesAndFolders(args = {}) {
      return this._makeRequest({
        path: "/files/@my",
        ...args,
      });
    },
    searchUsersByExtendedFilter(args = {}) {
      return this._makeRequest({
        path: "/people/simple/filter",
        ...args,
      });
    },
  },
};
