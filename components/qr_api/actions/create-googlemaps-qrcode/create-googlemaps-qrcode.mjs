import common from "../common/base.mjs";

export default {
  ...common,
  key: "qr_api-create-googlemaps-qrcode",
  name: "Create Google Maps QR Code",
  description: "Create a Google Maps QR Code. [See the documentation](https://qrapi.io/api-documentation/#/qrcode/create_googlemaps_qr_code)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    latitude: {
      type: "string",
      label: "Latitude",
      description: "Enter the map location latitude (in degrees) you want encoded in the QR Code e.g. the latitude of Washington DC, US is 38.8951",
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "Enter the map location longitude (in degrees) you want encoded in the QR Code e.g. the longitude of Washington DC, US is -77.0364",
    },
  },
  methods: {
    ...common.methods,
    getType() {
      return "googlemaps";
    },
    getParams() {
      return {
        latitude: parseFloat(this.latitude),
        longitude: parseFloat(this.longitude),
      };
    },
  },
};
