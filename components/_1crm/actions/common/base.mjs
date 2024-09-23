import _1crm from "../../_1crm.app.mjs";

export default {
  props: {
    _1crm,
    checkDuplicates: {
      type: "boolean",
      label: "Check Duplicates",
      description: "Check Duplicates Flag",
      default: true,
      reloadProps: true,
    },
  },
  methods: {
    getMethod() {
      return "create";
    },
    getUpdateId() {
      return "";
    },
    getType(type) {
      switch (type) {
      case "bool": return "boolean";
      case "int": return "integer";
      case "multienum": return "string[]";
      default: return "string";
      }
    },
    filterFields(fields) {
      const groups = [];
      return Object.keys(fields)
        .filter( (key) => !("editable" in fields[key]))
        .filter( (key) => {
          if (fields[key].multi_select_group && !groups.includes(fields[key].multi_select_group)) {
            groups.push(fields[key].multi_select_group);
            return true;
          }
          if (!fields[key].multi_select_group ) return true;
        })
        .reduce( (res, key) => (res[key] = fields[key], res), {} );
    },
    fixValues(data) {
      return Object.keys(data)
        .reduce( (res, key) => (res[key] = (typeof data[key] === "boolean"
          ? +data[key]
          : (Array.isArray(data[key]))
            ? data[key].join(",")
            : data[key]), res), {} );
    },
  },
  async additionalProps() {
    const method = this.getMethod();
    const props = {};
    let { fields } = await this._1crm.getFields({
      module: this.getModule(),
    });
    delete fields.assigned_user;
    delete fields.assigned_user_id;

    fields = this.filterFields(fields);

    for (const [
      key,
      value,
    ] of Object.entries(fields)) {
      props[key] = {
        type: this.getType(value.type),
        label: value.vname,
        description: value.comment,
        optional: (method === "create")
          ? !value.required
          : true,
        options: value.options,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      _1crm,
      checkDuplicates,
      ...data
    } = this;

    const method = this.getMethod();
    const fn = (method === "create")
      ? _1crm.createModel
      : _1crm.updateModel;

    const response = await fn({
      $,
      data: {
        data: this.fixValues(data),
      },
      params: {
        check_duplicates: checkDuplicates,
      },
      updateId: this.getUpdateId(),
      model: this.getModule(),
    });
    if (response.errors) throw new Error(response.errors);

    $.export("$summary", this.getSummary(response));
    return response;
  },
};
