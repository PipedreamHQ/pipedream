import amazonSes from "../../amazon_ses.app.mjs";

export default {
  props: {
    amazonSes,
    region: {
      propDefinition: [
        amazonSes,
        "region",
      ],
    },
  },
};
