import { ConfigurationError } from "@pipedream/platform";
import salesforce from "../../salesforce_rest_api.app.mjs";

export function getProps({
  objType,
  createOrUpdate = "create",
  docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_concepts.htm",
}) {
  let { initialProps } = objType;
  if (initialProps && createOrUpdate === "update") {
    initialProps = Object.fromEntries(
      Object.entries(initialProps).map(([
        key,
        value,
      ]) => [
        key,
        {
          ...value,
          optional: true,
        },
      ]),
    );
  }

  return {
    salesforce,
    ...objType[createOrUpdate === "create"
      ? "createProps"
      : "updateProps"],
    ...initialProps,
    docsInfo: {
      type: "alert",
      alertType: "info",
      content: `[See the documentation](${docsLink}) for more information on available fields.`,
    },
    useAdvancedProps: {
      propDefinition: [
        salesforce,
        "useAdvancedProps",
      ],
    },
  };
}

export default {
  methods: {
    getAdvancedProps() {
      return {};
    },
    getAdditionalFields() {
      return Object.fromEntries(
        Object.entries(this.additionalFields ?? {}).map(([
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
        }),
      );
    },
    formatDateTimeProps(props = {}) {
      // https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_valid_date_formats.htm
      return Object.fromEntries(Object.entries(props).map(([
        key,
        value,
      ]) => {
        const numValue = Number(value);
        const date = new Date(isNaN(numValue)
          ? value
          : numValue);
        if (isNaN(date.valueOf())) {
          throw new ConfigurationError(`Invalid date format for prop \`${key}\`. Please provide a [valid date string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format).`);
        }
        return [
          key,
          date.toISOString(),
        ];
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
