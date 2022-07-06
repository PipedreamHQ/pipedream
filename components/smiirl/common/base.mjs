import smiirl from "../smiirl.app.mjs";

export default {
  props: {
    smiirl,
    commonProperty: {
      propDefinition: [
        smiirl,
        "commonProperty",
      ],
    },
  },
};
