import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mapulus",
  propDefinitions: {
    mapId: {
      type: "string",
      label: "Map",
      description: "Identifier of a map",
      async options({ prevContext }) {
        const args = prevContext?.next
          ? {
            url: prevContext.next,
          }
          : {};
        const {
          data, pages,
        } = await this.listMaps(args);
        const options = data?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            next: pages?.next_page,
          },
        };
      },
    },
    locationId: {
      type: "string",
      label: "Location",
      description: "Identifier of a location",
      async options({ prevContext }) {
        const args = prevContext?.next
          ? {
            url: prevContext.next,
          }
          : {};
        const {
          data, pages,
        } = await this.listLocations(args);
        const options = data?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            next: pages?.next_page,
          },
        };
      },
    },
    layerId: {
      type: "string",
      label: "Layer",
      description: "Identifier of a layer",
      async options({
        mapId, locationId,
      }) {
        if (!mapId && !locationId) {
          return [];
        }
        if (!mapId) {
          const location = await this.getLocation({
            locationId,
          });
          mapId = location.map_id;
        }
        const args = {
          mapId,
          params: {
            expand: [
              "layer",
            ],
          },
        };
        const map = await this.getMap(args);
        return map?.layers.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the location",
    },
    latitude: {
      type: "string",
      label: "Latitude",
      description: "The latitude of the location.",
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "The longitude of the location.",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the location.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.mapulus.com/api/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      url,
      ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getLocation({
      locationId, ...args
    }) {
      return this._makeRequest({
        path: `/locations/${locationId}`,
        ...args,
      });
    },
    getMap({
      mapId, ...args
    }) {
      return this._makeRequest({
        path: `/maps/${mapId}`,
        ...args,
      });
    },
    listMaps(args = {}) {
      return this._makeRequest({
        path: "/maps",
        ...args,
      });
    },
    listLocations(args = {}) {
      return this._makeRequest({
        path: "/locations",
        ...args,
      });
    },
    createLocation(args = {}) {
      return this._makeRequest({
        path: "/locations",
        method: "POST",
        ...args,
      });
    },
    updateLocation({
      locationId, ...args
    }) {
      return this._makeRequest({
        path: `/locations/${locationId}`,
        method: "PUT",
        ...args,
      });
    },
    async *paginate({
      resourceFn,
      args = {},
    }) {
      let next = false;
      do {
        const {
          data, pages,
        } = await resourceFn(args);
        for (const item of data) {
          yield item;
        }
        next = pages?.next_page;
        args = {
          ...args,
          url: next,
        };
      } while (next);
    },
  },
};
