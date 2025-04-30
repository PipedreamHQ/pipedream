import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "philips_hue",
  propDefinitions: {
    username: {
      type: "string",
      label: "Username",
      description: "The username to use. [See the documentation](https://developers.meethue.com/develop/hue-api-v2/getting-started/) for information on how to create an authorized username",
    },
    lightId: {
      type: "string",
      label: "Light ID",
      description: "The identifier of a hue light",
      async options({ username }) {
        const { data } = await this.listLights({
          username,
        });
        return data?.map(({
          id: value, metadata,
        }) => ({
          label: metadata.name,
          value,
        })) || [];
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The identifier of a hue light group",
      async options({ username }) {
        const { data } = await this.listGroups({
          username,
        });
        return data?.map(({ id }) => id ) || [];
      },
    },
    sceneId: {
      type: "string",
      label: "Scene ID",
      description: "The identifier of a scene",
      async options({ username }) {
        const { data } = await this.listScenes({
          username,
        });
        return data?.map(({
          id: value, metadata,
        }) => ({
          label: metadata.name,
          value,
        })) || [];
      },
    },
    motionId: {
      type: "string",
      label: "Motion Sensor ID",
      description: "The identifier of a hue motion sensor",
      async options({ username }) {
        const { data } = await this.listMotionSensors({
          username,
        });
        return data?.map(({ id }) => id ) || [];
      },
    },
    temperatureId: {
      type: "string",
      label: "Temperature Sensor ID",
      description: "The identifier of a hue temperature sensor",
      async options({ username }) {
        const { data } = await this.listTemperatureSensors({
          username,
        });
        return data?.map(({ id }) => id ) || [];
      },
    },
    lightLevelId: {
      type: "string",
      label: "Light Level Sensor ID",
      description: "The identifier of a hue light level sensor",
      async options({ username }) {
        const { data } = await this.listLightSensors({
          username,
        });
        return data?.map(({ id }) => id ) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.meethue.com/route/clip/v2";
    },
    _makeRequest({
      $ = this,
      path,
      username,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "hue-application-key": username,
        },
        ...opts,
      });
    },
    getLight({
      lightId, ...opts
    }) {
      return this._makeRequest({
        path: `/resource/light/${lightId}`,
        ...opts,
      });
    },
    getGroup({
      groupId, ...opts
    }) {
      return this._makeRequest({
        path: `/resource/grouped_light/${groupId}`,
        ...opts,
      });
    },
    getScene({
      sceneId, ...opts
    }) {
      return this._makeRequest({
        path: `/resource/scene/${sceneId}`,
        ...opts,
      });
    },
    getMotionSensor({
      motionId, ...opts
    }) {
      return this._makeRequest({
        path: `/resource/motion/${motionId}`,
        ...opts,
      });
    },
    getTemperatureSensor({
      temperatureId, ...opts
    }) {
      return this._makeRequest({
        path: `/resource/temperature/${temperatureId}`,
        ...opts,
      });
    },
    getLightSensor({
      lightLevelId, ...opts
    }) {
      return this._makeRequest({
        path: `/resource/light_level/${lightLevelId}`,
        ...opts,
      });
    },
    listLights(opts = {}) {
      return this._makeRequest({
        path: "/resource/light",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/resource/grouped_light",
        ...opts,
      });
    },
    listScenes(opts = {}) {
      return this._makeRequest({
        path: "/resource/scene",
        ...opts,
      });
    },
    listMotionSensors(opts = {}) {
      return this._makeRequest({
        path: "/resource/motion",
        ...opts,
      });
    },
    listTemperatureSensors(opts = {}) {
      return this._makeRequest({
        path: "/resource/temperature",
        ...opts,
      });
    },
    listLightSensors(opts = {}) {
      return this._makeRequest({
        path: "/resource/light_level",
        ...opts,
      });
    },
    updateLight({
      lightId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/resource/light/${lightId}`,
        ...opts,
      });
    },
    updateGroup({
      groupId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/resource/grouped_light/${groupId}`,
        ...opts,
      });
    },
    updateScene({
      sceneId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/resource/scene/${sceneId}`,
        ...opts,
      });
    },
  },
};
