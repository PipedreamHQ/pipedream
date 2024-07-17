import common from "../common/base.mjs";

export default {
  ...common,
  key: "_1crm-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in the 1CRM system. [See the documentation](https://demo.1crmcloud.com/api.php#endpoint_dataList_post)",
  version: "0.0.1",
  type: "action",
  methods: {
    ...common.methods,
    getModule() {
      return "Contact";
    },
    getSummary({ id }) {
      return  `Successfully created contact with ID ${id}`;
    },
  },
};
