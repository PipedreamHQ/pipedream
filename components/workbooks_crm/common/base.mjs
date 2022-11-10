import workbooks_crm from "../workbooks_crm.app.mjs";

export default {
  props: {
    workbooks_crm,
    commonProperty: {
      propDefinition: [
        workbooks_crm,
        "commonProperty",
      ],
    },
  },
};
