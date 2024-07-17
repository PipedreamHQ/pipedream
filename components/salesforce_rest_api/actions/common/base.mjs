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
