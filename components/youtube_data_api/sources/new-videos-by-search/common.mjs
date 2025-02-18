import common from "../common/common.mjs";
import consts from "../../common/consts.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    q: {
      type: "string",
      label: "Search Query",
      description: "Search for new videos that match these keywords.",
      optional: true,
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The ID of the channel to search for new videos in. E.g. `UChkRx83xLq2nk55D8CRODVz`",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location parameter, in conjunction with the locationRadius parameter, defines a circular geographic area and also restricts a search to videos that specify, in their metadata, a geographic location that falls within that area. The parameter value is a string that specifies latitude/longitude coordinates e.g. `37.42307,-122.08427`.",
      optional: true,
    },
    locationRadius: {
      type: "string",
      label: "Location Radius",
      description: "The parameter value must be a floating point number followed by a measurement unit. Valid measurement units are m, km, ft, and mi. For example, valid parameter values include `1500m`, `5km`, `10000ft`, and `0.75mi`. The API does not support locationRadius parameter values larger than 1000 kilometers.",
      optional: true,
    },
    videoDuration: {
      type: "string",
      label: "Video Duration",
      description: "Filter the results based on video duration",
      options: consts.VIDEO_DURATIONS,
      optional: true,
    },
  },
  hooks: {},
  methods: {
    ...common.methods,
    getParams() {
      return {
        q: this.q,
        maxResults: this.maxResults,
        channelId: this.channelId,
        location: this.location,
        locationRadius: this.locationRadius,
      };
    },
  },
};
