import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gryd",
  propDefinitions: {
    vehicleId: {
      type: "string",
      label: "Vehicle ID (VRM)",
      description: "The VRM of the vehicle to fetch data for.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gryd.org";
    },
    _headers() {
      return {
        "X-API-KEY": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getVehicleData(vrm) {
      return this._makeRequest({
        path: `/vehicle/vrm/${vrm}`,
      });
    },
    getVehicleDVLA(vrm) {
      return this._makeRequest({
        path: `/vehicle/vrm/${vrm}/dvla`,
      });
    },
    getVehicleMOT(vrm) {
      return this._makeRequest({
        path: `/vehicle/vrm/${vrm}/mot`,
      });
    },
    getVehicleULEZ(vrm) {
      return this._makeRequest({
        path: `/vehicle/vrm/${vrm}/ulez`,
      });
    },
  },
};
