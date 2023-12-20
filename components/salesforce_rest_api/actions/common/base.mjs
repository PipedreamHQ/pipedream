import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  props: {
    salesforce,
  },
  methods: {
    additionalProps(selector, sobject) {
      if (!selector || !sobject) {
        return {};
      }
      return selector.reduce((props, prop) => ({
        ...props,
        [prop]: sobject[prop],
      }), {});
    },
  },
};
