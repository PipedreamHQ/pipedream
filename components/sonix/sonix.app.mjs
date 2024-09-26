import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sonix",
  propDefinitions: {
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "ID of folder to place the media in",
      async options() {
        const { folders } = await this.listFolders();

        return folders.map(({
          id: value, name, email,
        }) => ({
          label: name || email,
          value,
        }));
      },
    },
    mediaId: {
      type: "string",
      label: "Media ID",
      description: "ID of the media file",
      async options({ page }) {
        const { media } = await this.listMedia({
          params: {
            page: page + 1,
            status: "completed",
          },
        });

        return media.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _getApiKey() {
      return this.$auth.api_key;
    },
    _baseUrl() {
      return "https://api.sonix.ai/v1";
    },
    _getHeaders(headers) {
      return {
        ...headers,
        Authorization: `Bearer ${this._getApiKey()}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...otherOpts
    }) {
      const config = {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._getHeaders(headers),
      };

      return axios($, config);
    },
    listFolders() {
      return this._makeRequest({
        path: "/folders",
      });
    },
    listMedia(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/media",
      });
    },
    submitNewMedia(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/media",
      });
    },
    getTextTranscript(mediaId) {
      return this._makeRequest({
        path: `/media/${mediaId}/transcript`,
      });
    },
    createTranslation({
      mediaId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/media/${mediaId}/translations`,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          media,
          page: currentPage,
          total_pages: lastPage,
        } = await fn({
          params,
        });

        for (const d of media) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = currentPage != lastPage;

      } while (hasMore);
    },
  },
};
