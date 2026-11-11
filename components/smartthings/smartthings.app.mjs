import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smartthings",
  propDefinitions: {
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The ID of a SmartThings location, e.g. `a1b2c3d4-0000-1111-2222-333344445555`. Use **List Locations** to find it (the `locationId` field).",
      async options({ prevContext }) {
        return this._getOptionsPage({
          prevContext,
          resourceFn: () => this.listLocations(),
          mapper: ({
            locationId: value, name: label,
          }) => ({
            label,
            value,
          }),
        });
      },
    },
    roomId: {
      type: "string",
      label: "Room ID",
      description: "The ID of a room within the selected location, e.g. `b2c3d4e5-0000-1111-2222-333344445555`. Use **List Rooms** with the same `locationId` to find it (the `roomId` field).",
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
      description: "The ID of a SmartThings device, e.g. `c3d4e5f6-0000-1111-2222-333344445555`. Use **List Devices** to find it (the `deviceId` field).",
      async options({
        locationId, capability, prevContext,
      }) {
        return this._getOptionsPage({
          prevContext,
          resourceFn: () => this.listDevices({
            params: {
              locationId,
              capability,
            },
          }),
          mapper: ({
            deviceId: value, label, name,
          }) => ({
            label: label || name,
            value,
          }),
        });
      },
    },
    sceneId: {
      type: "string",
      label: "Scene ID",
      description: "The ID of a SmartThings scene, e.g. `d4e5f6a7-0000-1111-2222-333344445555`. Use **List Scenes** to find it (the `sceneId` field).",
      async options({
        locationId, prevContext,
      }) {
        return this._getOptionsPage({
          prevContext,
          resourceFn: () => this.listScenes({
            params: {
              locationId,
            },
          }),
          mapper: ({
            sceneId: value, sceneName: label,
          }) => ({
            label,
            value,
          }),
        });
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
      description: "The device component to target, e.g. `main`. Most devices only have a `main` component; use **Get Device Status** to see a device's components.",
      default: "main",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.smartthings.com/v1";
    },
    /**
     * Returns one page of prop options. The next-page URL from
     * `_links.next.href` is stored in the context so the UI can load more.
     */
    async _getOptionsPage({
      prevContext, resourceFn, mapper,
    }) {
      if (prevContext?.next === null) {
        return [];
      }
      const response = prevContext?.next
        ? await this._makeRequest({
          url: prevContext.next,
        })
        : await resourceFn();
      return {
        options: response?.items?.map(mapper) || [],
        context: {
          next: response?._links?.next?.href || null,
        },
      };
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
      $, resourceFn, params = {}, max,
    }) {
      let count = 0;
      let previousNext;
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
        if (next === previousNext) {
          throw new Error("SmartThings pagination cursor did not advance");
        }
        previousNext = next;
        response = await this._makeRequest({
          $,
          url: next,
        });
      }
    },
  },
};
