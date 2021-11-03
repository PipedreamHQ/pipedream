import amara from "./amara.app.mjs";

export default {
  props: {
    amara,
    team: {
      propDefinition: [
        amara,
        "team",
      ],
    },
  },
};
