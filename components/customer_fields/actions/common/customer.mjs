/* eslint-disable no-unused-vars */
import app from "../../customer_fields.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    formId: {
      description: "The form ID that will be attached to the customer. Note that any settings will be applied to the customer from the form. For example, if the form requires account approval, the customer will be submitted as a pending status.",
      optional: true,
      reloadProps: true,
      propDefinition: [
        app,
        "formId",
      ],
    },
  },
  methods: {
    getPropsFromDataColumns({
      dataColumns = [], isCreate = true,
    } = {}) {
      const {
        keysToIgnore,
        ...props
      } = dataColumns.reduce((props, {
        key, label, data_type: dataTypeKey, read_only: readOnly,
      }) => {
        const dataType = constants.DATA_TYPE[dataTypeKey];
        const ignoreKey = props.keysToIgnore?.some((keyToIgnore) => key.startsWith(keyToIgnore));

        if (isCreate && key.includes("id")) {
          return props;
        }

        if (ignoreKey || readOnly) {
          return props;
        }

        if (!dataType) {
          return {
            ...props,
            keysToIgnore: props.toIgnore?.length
              ? props.toIgnore.concat(key)
              : [
                key,
              ],
          };
        }

        return {
          ...props,
          [key]: {
            type: dataType,
            label,
            description: "The value to set for the data column.",
            optional: true,
          },
        };
      }, {});
      return props;
    },
    getDataFromDataColumns(dataColumns = {}) {
      return Object.entries(dataColumns)
        .reduce((reduction, [
          complexKey,
          value,
        ]) => {
          const [
            mainKey,
            key,
          ] = complexKey.split(".");

          if (!key) {
            return {
              ...reduction,
              [mainKey]: value,
            };
          }

          return {
            ...reduction,
            [mainKey]: {
              ...reduction[mainKey],
              [key]: value,
            },
          };
        }, {});
    },
  },
};
