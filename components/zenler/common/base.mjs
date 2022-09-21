import zenler from "../zenler.app.mjs";

export default {
  props: {
    zenler,
    commonProperty: {
      propDefinition: [
        zenler,
        "commonProperty",
      ],
    },
  },
};
