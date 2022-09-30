import common from "../common.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    location: {
      type: "string",
      label: "Location",
      description: "The location parameter, in conjunction with the locationRadius parameter, defines a circular geographic area and also restricts a search to videos that specify, in their metadata, a geographic location that falls within that area. The parameter value is a string that specifies latitude/longitude coordinates e.g. `37.42307,-122.08427`.",
    },
    locationRadius: {
      type: "string",
      label: "Location Radius",
      description: "The parameter value must be a floating point number followed by a measurement unit. Valid measurement units are m, km, ft, and mi. For example, valid parameter values include `1500m`, `5km`, `10000ft`, and `0.75mi`. The API does not support locationRadius parameter values larger than 1000 kilometers.",
    },
  },
  methods: {
    ...common.methods,
    getParams() {
      return {
        location: this.location,
        locationRadius: this.locationRadius,
      };
    },
  },
};
