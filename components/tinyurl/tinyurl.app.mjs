import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tinyurl",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Required props for creating a new shortened link
    destinationUrl: {
      type: "string",
      label: "Destination URL",
      description: "The URL to be shortened",
    },
    // Optional props for creating a new shortened link
    customAlias: {
      type: "string",
      label: "Custom Alias",
      description: "Optional custom alias for the shortened URL",
      optional: true,
    },
    expirationDate: {
      type: "string",
      label: "Expiration Date",
      description: "Optional expiration date for the shortened URL (YYYY-MM-DD)",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Optional tags for the shortened URL",
      optional: true,
    },
    // Required prop for updating metadata
    linkIdOrAlias: {
      type: "string",
      label: "Link ID or Alias",
      description: "The ID or alias of the link to update",
    },
    // Optional props for updating metadata
    title: {
      type: "string",
      label: "Title",
      description: "Optional new title for the link",
      optional: true,
    },
    updateTags: {
      type: "string[]",
      label: "Tags",
      description: "Optional new tags for the link",
      optional: true,
    },
    updateExpirationDate: {
      type: "string",
      label: "Expiration Date",
      description: "Optional new expiration date for the link (YYYY-MM-DD)",
      optional: true,
    },
    // Required prop for retrieving analytics
    analyticsLinkIdOrAlias: {
      type: "string",
      label: "Analytics Link ID or Alias",
      description: "The ID or alias of the link to retrieve analytics for",
    },
    // Props for emitting new link creation events
    emitNewLinkFilterDomain: {
      type: "string",
      label: "Filter by Domain",
      description: "Optional domain to filter new link creation events",
      optional: true,
    },
    emitNewLinkFilterTag: {
      type: "string",
      label: "Filter by Tag",
      description: "Optional tag to filter new link creation events",
      optional: true,
    },
    // Props for emitting link click events
    emitLinkClickMonitoredLinks: {
      type: "string[]",
      label: "Monitored Links",
      description: "List of link IDs or aliases to monitor for click events",
    },
    emitLinkClickFilterGeography: {
      type: "string",
      label: "Filter by Geography",
      description: "Optional geography filter for link click events",
      optional: true,
    },
    emitLinkClickFilterDeviceType: {
      type: "string",
      label: "Filter by Device Type",
      description: "Optional device type filter for link click events",
      optional: true,
    },
    // Props for emitting metadata update events
    emitMetadataUpdateFilter: {
      type: "string",
      label: "Filter for Metadata Updates",
      description: "Optional filter to monitor specific metadata changes",
      optional: true,
    },
  },
  methods: {
    // Existing method
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    // Base URL for TinyURL API
    _baseUrl() {
      return "https://api.tinyurl.com";
    },
    // Method to make API requests
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", data, params, headers, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        data: data
          ? data
          : undefined,
        params: params
          ? params
          : undefined,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
        },
        ...otherOpts,
      });
    },
    // Method to create a new TinyURL
    async createTinyURL(opts = {}) {
      const data = {
        destination_url: this.destinationUrl,
        ...(this.customAlias && {
          custom_alias: this.customAlias,
        }),
        ...(this.expirationDate && {
          expiration_date: this.expirationDate,
        }),
        ...(this.tags && {
          tags: this.tags,
        }),
      };
      return this._makeRequest({
        method: "POST",
        path: "/create",
        data,
      });
    },
    // Method to update metadata of an existing TinyURL
    async updateTinyURLMetadata(opts = {}) {
      const data = {
        link_id_or_alias: this.linkIdOrAlias,
        ...(this.title && {
          title: this.title,
        }),
        ...(this.updateTags && {
          tags: this.updateTags,
        }),
        ...(this.updateExpirationDate && {
          expiration_date: this.updateExpirationDate,
        }),
      };
      return this._makeRequest({
        method: "PATCH",
        path: "/update",
        data,
      });
    },
    // Method to retrieve information about a TinyURL
    async getTinyURLInfo(opts = {}) {
      const [
        domain,
        alias,
      ] = this.linkIdOrAlias.split("/");
      return this._makeRequest({
        method: "GET",
        path: `/alias/${domain}/${alias}`,
      });
    },
    // Method to delete a TinyURL
    async deleteTinyURL(opts = {}) {
      const [
        domain,
        alias,
      ] = this.linkIdOrAlias.split("/");
      return this._makeRequest({
        method: "DELETE",
        path: `/alias/${domain}/${alias}`,
      });
    },
    // Method to retrieve analytics for a specific TinyURL
    async retrieveAnalytics(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/analytics/location/${this.analyticsLinkIdOrAlias}`,
      });
    },
    // Method to emit new link creation events
    async pollNewLinks({
      domainFilter, tagFilter,
    }, emit) {
      const params = {};
      if (domainFilter) {
        params.domain = domainFilter;
      }
      if (tagFilter) {
        params.tag = tagFilter;
      }
      const response = await this._makeRequest({
        method: "GET",
        path: "/links/new",
        params,
      });
      const newLinks = response.links || [];
      newLinks.forEach((link) => {
        emit(link);
      });
    },
    // Method to emit link click events
    async pollLinkClicks({
      linksToMonitor, geographyFilter, deviceTypeFilter,
    }, emit) {
      for (const link of linksToMonitor) {
        const analytics = await this.retrieveAnalytics({
          linkIdOrAlias: link,
        });
        if (
          (geographyFilter && analytics.geography === geographyFilter) ||
          (deviceTypeFilter && analytics.device_type === deviceTypeFilter)
        ) {
          emit(analytics);
        }
      }
    },
    // Method to emit metadata update events
    async pollMetadataUpdates({ emitMetadataUpdateFilter }, emit) {
      const response = await this._makeRequest({
        method: "GET",
        path: "/links",
      });
      const links = response.links || [];
      links.forEach((link) => {
        if (!emitMetadataUpdateFilter || link.metadata.includes(emitMetadataUpdateFilter)) {
          emit(link);
        }
      });
    },
    // Pagination utility method
    async paginate(fn, ...opts) {
      let results = [];
      let hasMore = true;
      let page = 1;
      while (hasMore) {
        const response = await fn({
          ...opts,
          page,
        });
        results = results.concat(response.links || []);
        hasMore = response.has_more;
        page += 1;
      }
      return results;
    },
  },
};
