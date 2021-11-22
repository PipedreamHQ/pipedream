import sortBy from "lodash/sortBy.js";
import common from "./common-http-based-predefined-module.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    moduleInfo: {
      type: "string",
      label: "Module",
      description:
        "The type of module that will trigger this event source when created",
      async options({ page = 0 }) {
        if (page !== 0) {
          return [];
        }

        const { modules } = await this.zohoCrm.listModules();
        const options = modules
          .filter(this.areEventsSupportedByModule)
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
    ...common.methods,
    getModuleType() {
      const { type } = JSON.parse(this.moduleInfo);
      return type;
    },
  },
};
