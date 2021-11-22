const sortBy = require("lodash/sortBy");
const base = require("./predefined-module");

module.exports = { // eslint-disable-line
  ...base,
  props: {
    ...base.props,
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
    ...base.methods,
    getModuleType() {
      const { type } = JSON.parse(this.moduleInfo);
      return type;
    },
<<<<<<< HEAD
    getModuleName() {
      const { name } = JSON.parse(this.moduleInfo);
      return name;
    },
=======
    getModuleName(){
      const { name } = JSON.parse(this.moduleInfo);
      return name;
    }
>>>>>>> b4504cafe0ab032f571253d7610dfa143fb55c2c
  },
};
