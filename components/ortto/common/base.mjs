import ortto from "../ortto.app.mjs";

export default {
  props: {
    ortto,
    commonProperty: {
      propDefinition: [
        ortto,
        "commonProperty",
      ],
    },
  },
};
