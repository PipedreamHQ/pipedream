import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-set-custom-contact-attributes",
  name: "Set Custom Contact Attributes",
  description: "Updates custom attributes for a specified user. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Custom-Attributes/#tag/Custom-Attributes/operation/patchEndusersUseridCustom-attributes)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dixa,
    userId: {
      propDefinition: [
        dixa,
        "endUserId",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    const { data } = await this.dixa.listCustomAttributes();

    for (const item of data) {
      if (item.isDeactivated || item.isArchived || item.entityType != "Contact") continue;

      props[item.id] = {
        type: "string",
        label: item.label,
        description: item.description,
        optional: !item.isRequired,
        default: item.inputDefinition.placeholder,
      };

      if (item.inputDefinition._type === "Select") {
        props[item.id].options = this.prepareOptions(item.inputDefinition.options);
      }
    }
    return props;
  },
  methods: {
    prepareOptions(options, parentVal = "", parentLabel = "") {
      const newOptions = [];

      for (const opt of options) {
        const newLabel = parentLabel
          ? `${parentLabel} - ${opt.label}`
          : opt.label;

        const newVal = parentVal
          ? `${parentVal}/${opt.value}`
          : opt.value;

        if (opt.nestedOptions.length) {
          newOptions.push(...this.prepareOptions(opt.nestedOptions, newVal, newLabel));
        } else {
          newOptions.push({
            label: newLabel,
            value: newVal,
          });
        }
      }
      return newOptions;
    },
    async prepareData(data) {
      const response = {};
      const { data: customAttributes } = await this.dixa.listCustomAttributes();
      Object.entries(data).map(([
        key,
        val,
      ]) => {
        const customAttribute = customAttributes.find((attr) => attr.id === key);

        response[key] = customAttribute.inputDefinition._type != "Text"
          ? val.split("/")
          : val;
      });
      return response;
    },
  },
  async run({ $ }) {
    const {
      dixa,
      // eslint-disable-next-line no-unused-vars
      prepareOptions,
      prepareData,
      userId,
      ...data
    } = this;

    const response = await dixa.updateCustomAttributes({
      $,
      userId,
      data: await prepareData(data),
    });
    $.export("$summary", `Updated custom attributes for user ${this.userId}`);
    return response;
  },
};
