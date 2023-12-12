import tookan from "../app/tookan.app";

export default {
  props: {
    tookan,
    additionalOptions: {
      propDefinition: [
        tookan,
        "additionalOptions",
      ],
    },
    timezone: {
      propDefinition: [
        tookan,
        "timezone",
      ],
    },
  },
};
