import hubspot from "../../hubspot.app.mjs";

export default {
  props: {
    hubspot: {
      ...hubspot,
      reloadProps: true,
    },
  },
};
