import common from "../common/base.mjs";

export default {
  ...common,
  key: "_1crm-create-lead",
  name: "Create Lead",
  description: "Crafts a new lead in 1CRM. [See the documentation](https://demo.1crmcloud.com/api.php#endpoint_dataList_post)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
    getModule() {
      return "Lead";
    },
    getSummary({ id }) {
      return  `Successfully created lead with ID ${id}`;
    },
  },
};
