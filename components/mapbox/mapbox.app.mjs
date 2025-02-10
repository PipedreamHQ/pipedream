import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mapbox",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Geocoding Props
    address: {
      type: "string",
      label: "Address",
      description: "The address to geocode",
    },
    boundingBox: {
      type: "string",
      label: "Bounding Box",
      description: "Optional bounding box in the format minLng,minLat,maxLng,maxLat",
      optional: true,
    },
    proximity: {
      type: "string",
      label: "Proximity",
      description: "Optional proximity point in the format longitude,latitude",
      optional: true,
    },
    // Directions Props
    startCoordinate: {
      type: "string",
      label: "Start Coordinate",
      description: "The starting point in the format longitude,latitude",
    },
    endCoordinate: {
      type: "string",
      label: "End Coordinate",
      description: "The ending point in the format longitude,latitude",
    },
    waypoints: {
      type: "string[]",
      label: "Waypoints",
      description: "Optional waypoints as an array of longitude,latitude strings",
      optional: true,
    },
    transportationMode: {
      type: "string",
      label: "Transportation Mode",
      description: "Optional transportation mode",
      options: [
        {
          label: "Driving",
          value: "driving",
        },
        {
          label: "Walking",
          value: "walking",
        },
        {
          label: "Cycling",
          value: "cycling",
        },
        {
          label: "Driving Traffic",
          value: "driving-traffic",
        },
      ],
      optional: true,
    },
    routeType: {
      type: "string",
      label: "Route Type",
      description: "Optional route type",
      options: [
        {
          label: "Fastest",
          value: "fastest",
        },
        {
          label: "Shortest",
          value: "shortest",
        },
      ],
      optional: true,
    },
    // Tileset Upload Props
    sourceFile: {
      type: "string",
      label: "Source File",
      description: "The source file for the tileset",
    },
    tilesetName: {
      type: "string",
      label: "Tileset Name",
      description: "The name of the new tileset",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description for the tileset",
      optional: true,
    },
    privacySettings: {
      type: "string",
      label: "Privacy Settings",
      description: "Optional privacy settings for the tileset",
      options: [
        {
          label: "Public",
          value: "public",
        },
        {
          label: "Private",
          value: "private",
        },
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.mapbox.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers = {}, params = {}, data, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
        },
        params: {
          access_token: this.$auth.access_token,
          ...params,
        },
        data,
        ...otherOpts,
      });
    },
    async geocode(opts = {}) {
      const {
        address, boundingBox, proximity,
      } = opts;
      const params = {
        types: "address",
      };
      if (boundingBox) {
        params.bbox = boundingBox;
      }
      if (proximity) {
        params.proximity = proximity;
      }
      return this._makeRequest({
        path: `/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
        params,
      });
    },
    async getDirections(opts = {}) {
      const {
        startCoordinate, endCoordinate, waypoints, transportationMode, routeType,
      } = opts;
      let coordinates = `${startCoordinate};${endCoordinate}`;
      if (waypoints && waypoints.length > 0) {
        coordinates = `${startCoordinate};${waypoints.join(";")};${endCoordinate}`;
      }
      const params = {};
      if (transportationMode) {
        params.profile = transportationMode;
      }
      if (routeType) {
        params.alternatives = routeType === "fastest"
          ? "true"
          : "false";
      }
      return this._makeRequest({
        path: `/directions/v5/mapbox.${transportationMode || "driving"}/${coordinates}`,
        params,
      });
    },
    async uploadTileset(opts = {}) {
      const {
        sourceFile, tilesetName, description, privacySettings,
      } = opts;
      const params = {
        tileset: tilesetName,
      };
      if (description) {
        params.description = description;
      }
      if (privacySettings) {
        params.private = privacySettings === "private"
          ? true
          : false;
      }
      return this._makeRequest({
        method: "POST",
        path: `/uploads/v1/${encodeURIComponent(this.$auth.username)}`,
        params,
        data: {
          data: sourceFile,
          tileset: {
            name: tilesetName,
            description: description || "",
            private: privacySettings === "private",
          },
        },
      });
    },
  },
};
