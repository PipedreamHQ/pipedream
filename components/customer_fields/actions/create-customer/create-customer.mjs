/* eslint-disable no-unused-vars */
import common from "../common/customer.mjs";

export default {
  ...common,
  key: "customer_fields-create-customer",
  name: "Create Customer",
  description: "Create a new customer with detailed attributes using the provided data. [See the documentation](https://docs.customerfields.com/#8a70d5ee-da8f-4ef0-8b08-9c1882b4da04).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  methods: {
    ...common.methods,
    createCustomer(args = {}) {
      return this.app.post({
        path: "/customers",
        ...args,
      });
    },
  },
  async additionalProps() {
    const { data_columns: dataColumns } =
      await this.app.listDataColumns({
        params: {
          ignore_read_only: true,
          form_id: this.formId,
        },
      });
    return this.getPropsFromDataColumns({
      dataColumns,
    });
  },
  async run({ $: step }) {
    const {
      app,
      createCustomer,
      getDataFromDataColumns,
      formId,
      ...dataColumns
    } = this;

    const response =
      await createCustomer({
        step,
        data: getDataFromDataColumns(dataColumns),
      });

    step.export("$summary", `Successfully created customer with ID ${response?.customer?.id}.`);

    return response;
  },
};
