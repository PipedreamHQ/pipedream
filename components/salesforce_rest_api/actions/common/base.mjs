import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  props: {
    salesforce,
  },
  methods: {
    getAdvancedProps() {
      return {};
    },
  },
  additionalProps() {
    return this.useAdvancedProps
      ? this.getAdvancedProps()
      : {};
  },
};
