import monday from "../monday.app.mjs";

export default {
  props: {
    monday,
    commonProperty: {
      propDefinition: [
        monday,
        "commonProperty",
      ],
    },
  },
};
