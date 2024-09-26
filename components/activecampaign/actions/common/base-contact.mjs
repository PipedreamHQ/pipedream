import activecampaign from "../../activecampaign.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    activecampaign,
    email: {
      propDefinition: [
        activecampaign,
        "contactEmail",
      ],
    },
    firstName: {
      propDefinition: [
        activecampaign,
        "contactFirstName",
      ],
    },
    lastName: {
      propDefinition: [
        activecampaign,
        "contactLastName",
      ],
    },
    phone: {
      propDefinition: [
        activecampaign,
        "contactPhone",
      ],
    },
    showCustomFields: {
      type: "boolean",
      label: "Show Custom Fields",
      description: "Allow custom fields to be set",
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (!this.showCustomFields) {
      return {};
    }

    const fields = [];
    const limit = constants.DEFAULT_LIMIT;
    let total = 0;
    const params = {
      limit,
      offset: 0,
    };
    do {
      const { fields: items } = await this.activecampaign.listContactCustomFields({
        params,
      });
      fields.push(...items);
      total = items?.length;
      params.offset += limit;
    } while (total === limit);

    return fields
      .filter(({ type }) => constants.ALLOW_CUSTOM_FIELD_TYPES.includes(type))
      .reduce((reduction, {
        id, title,
      }) => ({
        ...reduction,
        [`${constants.FIELD_VALUE_PROP_NAME}${id}`]: {
          type: "string",
          label: title,
          description: "Set your custom field value",
          optional: true,
        },
      }), {});
  },
  methods: {
    getFieldValues() {
      return Object.entries(this)
        .reduce((reduction, [
          key,
          fieldValue,
        ]) => {
          const [
            , fieldId,
          ] = key.split(constants.FIELD_VALUE_PROP_NAME);
          const customFieldId = utils.emptyStrToUndefined(fieldId);
          const customFieldValue = utils.emptyStrToUndefined(fieldValue);
          if (customFieldId && customFieldValue) {
            return reduction.concat({
              field: customFieldId,
              value: customFieldValue,
            });
          }
          return reduction;
        }, []);
    },
  },
};
