import sortBy from "lodash.sortby";
import base from "./common-predefined-module.mjs";

export default {
  ...base,
  props: {
    ...base.props,
    moduleInfo: {
      type: "string",
      label: "Module",
      description:
        "The type of module that will trigger this event source when created",
      async options() {
        const { modules } = await this.zohoCrm.listModules();
        const options = modules
          .filter(this.areEventsSupportedByModule)
          .filter(({ generated_type: type }) => type !== "custom")
          .map(({
            api_name: type,
            singular_label: name,
          }) => ({
            label: name,
            value: JSON.stringify({
              type,
              name,
            }),
          }));
        return sortBy(options, "label");
      },
    },
  },
  methods: {
    ...base.methods,
    getModuleType() {
      const { type } = JSON.parse(this.moduleInfo);
      return type;
    },
    getModuleName() {
      const { name } = JSON.parse(this.moduleInfo);
      return name;
    },
  },
};
