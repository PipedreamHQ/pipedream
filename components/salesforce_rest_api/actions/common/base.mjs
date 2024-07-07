import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  props: {
    salesforce,
  },
  methods: {
    getAdvancedProps() {
      return {};
    },
    getAdditionalFields() {
      return Object.fromEntries(Object.entries(this.additionalFields ?? {}).map(([
        key,
        value,
      ]) => {
        try {
          return [
            key,
            JSON.parse(value),
          ];
        } catch (err) {
          return [
            key,
            value,
          ];
        }
      }));
    },
  },
  additionalProps() {
    return this.useAdvancedProps
      ? {
        ...this.getAdvancedProps(),
        additionalFields: {
          type: "object",
          label: "Additional Fields",
          description:
              "Other fields to set for this object. Values will be parsed as JSON where applicable.",
          optional: true,
        },
      }
      : {};
  },
};
