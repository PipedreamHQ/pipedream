import common from "./send-common.mjs";

export default {
  props: {
    ...common.props,
    radiusCenter: {
      propDefinition: [
        common.props.thanksIo,
        "radiusCenter",
      ],
    },
    radiusDistance: {
      propDefinition: [
        common.props.thanksIo,
        "radiusDistance",
      ],
    },
  },
};
