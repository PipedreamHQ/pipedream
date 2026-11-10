import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smartthings",
  propDefinitions: {
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The ID of a SmartThings location",
      async options() {
        const { items } = await this.listLocations();
        return items?.map(({
          locationId: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    roomId: {
      type: "string",
      label: "Room ID",
      description: "The ID of a room within the selected location",
      async options({ locationId }) {
        if (!locationId) {
          return [];
        }
        const { items } = await this.listRooms({
          locationId,
        });
        return items?.map(({
          roomId: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    deviceId: {
      type: "string",
      label: "Device ID",
      description: "The ID of a SmartThings device",
      async options({
        locationId, capability,
      }) {
        const { items } = await this.listDevices({
          params: {
            locationId,
            capability,
          },
        });
        return items?.map(({
          deviceId: value, label, name,
        }) => ({
          label: label || name,
          value,
        })) || [];
      },
    },
    sceneId: {
      type: "string",
      label: "Scene ID",
      description: "The ID of a SmartThings scene",
      async options({ locationId }) {
        const { items } = await this.listScenes({
          params: {
            locationId,
          },
        });
        return items?.map(({
          sceneId: value, sceneName: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    capability: {
      type: "string",
      label: "Capability",
      description: "A SmartThings capability ID, e.g. `switch`, `switchLevel`, `colorControl`, `thermostatMode`. [See the capabilities reference](https://developer.smartthings.com/docs/devices/capabilities/capabilities-reference)",
    },
    component: {
      type: "string",
      label: "Component",
      description: "The device component to target. Most devices only have a `main` component.",
      default: "main",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.smartthings.com/v1";
    },
    _makeRequest({
      $ = this,
      path,
      url,
      ...opts
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    listLocations(opts = {}) {
      return this._makeRequest({
        path: "/locations",
        ...opts,
      });
    },
    getLocation({
      locationId, ...opts
    }) {
      return this._makeRequest({
        path: `/locations/${locationId}`,
        ...opts,
      });
    },
    listRooms({
      locationId, ...opts
    }) {
      return this._makeRequest({
        path: `/locations/${locationId}/rooms`,
        ...opts,
      });
    },
    listDevices(opts = {}) {
      return this._makeRequest({
        path: "/devices",
        ...opts,
      });
    },
    getDevice({
      deviceId, ...opts
    }) {
      return this._makeRequest({
        path: `/devices/${deviceId}`,
        ...opts,
      });
    },
    getDeviceStatus({
      deviceId, ...opts
    }) {
      return this._makeRequest({
        path: `/devices/${deviceId}/status`,
        ...opts,
      });
    },
    getDeviceComponentStatus({
      deviceId, component, ...opts
    }) {
      return this._makeRequest({
        path: `/devices/${deviceId}/components/${component}/status`,
        ...opts,
      });
    },
    executeDeviceCommands({
      deviceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/devices/${deviceId}/commands`,
        ...opts,
      });
    },
    listScenes(opts = {}) {
      return this._makeRequest({
        path: "/scenes",
        ...opts,
      });
    },
    executeScene({
      sceneId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/scenes/${sceneId}/execute`,
        ...opts,
      });
    },
    /**
     * Iterates over every item of a paginated SmartThings list endpoint by
     * following the `_links.next.href` cursor returned by the API.
     */
    async *paginate({
      resourceFn, params = {}, max,
    }) {
      let count = 0;
      let response = await resourceFn({
        params,
      });
      while (response) {
        for (const item of response.items || []) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        const next = response._links?.next?.href;
        if (!next) {
          return;
        }
        response = await this._makeRequest({
          url: next,
        });
      }
    },
  },
};
