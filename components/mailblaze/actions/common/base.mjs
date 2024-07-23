import mailblaze from "../../mailblaze.app.mjs";

export default {
  props: {
    mailblaze,
    listUid: {
      propDefinition: [
        mailblaze,
        "listUid",
      ],
      reloadProps: true,
    },
  },
  methods: {
    parseOptions(options) {
      return Object.keys(options).map((key) => ({
        label: key,
        value: options[key],
      }));
    },
    parseProp(data) {
      return Object.keys(data).reduce((res, key) => {
        res[key] = Array.isArray(data[key])
          ? data[key].join(",")
          : data[key];
        return res;
      }, {});
    },
    getAction() {
      return "add";
    },
    getAdditionalProp() {
      return {};
    },
  },
  async additionalProps() {
    const props = {};
    if (this.listUid) {
      const { data: { records: fields } } = await this.mailblaze.getFields({
        listUid: this.listUid,
      });

      for (const field of fields) {
        props[field.tag] = {
          type: (field.type.identifier === "checkbox")
            ? "string[]"
            : "string",
          label: field.label,
          optional: field.required === "no",
          description: field.help_text,
          options: field.options && this.parseOptions(field.options),
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      mailblaze,
      listUid,
      ...data
    } = this;

    const action = this.getAction();

    const fn = (action === "add")
      ? mailblaze.addSubscriber
      : mailblaze.updateSubscriber;

    const response = await fn({
      $,
      listUid,
      data: this.parseProp(data),
      ...this.getAdditionalProp(),
    });

    $.export("$summary", this.getSummary(response));
    return response;
  },
};
