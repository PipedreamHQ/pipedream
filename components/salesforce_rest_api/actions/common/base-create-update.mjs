import { ConfigurationError } from "@pipedream/platform";
import salesforce from "../../salesforce_rest_api.app.mjs";
import { getAdditionalFields } from "../../common/props-utils.mjs";

export const additionalFields = {
  type: "object",
  label: "Additional Fields",
  description:
      "Other fields to set for this record. Values will be parsed as JSON where applicable.",
  optional: true,
};

export function getProps({
  objType,
  createOrUpdate = "create",
  docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_concepts.htm",
  showDateInfo = false,
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
    ...showDateInfo && {
      dateInfo: {
        type: "alert",
        alertType: "warning",
        content: "Date fields should be a [valid date string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format) or a Unix timestamp in milliseconds. Example values: `2022-01-15T18:30:00.000Z` or `1642271400000`.",
      },
    },
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
    getObjectType() {
      return "";
    },
    getAdvancedProps() {
      return {};
    },
    getAdditionalFields,
    formatDateTimeProps(props = {}) {
      // https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_valid_date_formats.htm
      return Object.fromEntries(Object.entries(props).filter(([
        , value,
      ]) => value !== undefined)
        .map(([
          key,
          value,
        ]) => {
          const numValue = Number(value);
          const date = new Date(Number.isNaN(numValue)
            ? value
            : numValue);
          if (Number.isNaN(date.valueOf())) {
            throw new ConfigurationError(`Invalid date format for prop \`${key}\`. Please provide a valid date format.`);
          }
          return [
            key,
            date.toISOString(),
          ];
        }));
    },
  },
  async additionalProps() {
    const objectType = this.getObjectType();
    if (!this.useAdvancedProps || !objectType) return {};

    const fields = (await this.salesforce.getFieldsForObjectType(objectType));
    const fieldNames = fields.map((f) => f.name);
    const filteredProps = Object.fromEntries(Object.entries(this.getAdvancedProps()).filter(([
      key,
    ]) => fieldNames.includes(key) || key[0] === key[0].toLowerCase()));
    return {
      ...filteredProps,
      additionalFields,
    };
  },
};
