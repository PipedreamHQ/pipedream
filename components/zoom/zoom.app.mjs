export default {
  type: "app",
  app: "zoom",
  propDefinitions: {
    zoomRoomName: {
      type: "string",
      label: "Name",
      description: "Name of the Zoom Room.",
    },
    zoomRoomType: {
      type: "string",
      label: "Type",
      description: "Type of the Zoom Room.",
      options: [
        "ZoomRoom",
        "SchedulingDisplayOnly",
        "DigitalSignageOnly",
      ],
    },
    locationId: {
      type: "string",
      label: "LocationId",
      description: "Location ID of the lowest level location in the (location hierarchy)[https://support.zoom.us/hc/en-us/articles/115000342983-Zoom-Rooms-Location-Hierarchy] where the Zoom Room is to be added. For instance if the structure of the location hierarchy is set up as “country, states, city, campus, building, floor”, a room can only be added under the floor level location.",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.zoom.us/v2/";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getAxiosParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
  },
};
