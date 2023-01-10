import recurly from "../recurly.app.mjs";

export default {
  props: {
    recurly,
    commonProperty: {
      propDefinition: [
        recurly,
        "commonProperty",
      ],
    },
  },
};
