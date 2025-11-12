/* eslint-disable no-unused-vars */
import common from "../common/customer.mjs";

export default {
  ...common,
  key: "customer_fields-update-customer",
  name: "Update Customer",
  description: "Update an existing customer's information with new provided data. [See the documentation](https://docs.customerfields.com/#26b4ad8d-2503-4ac9-bc7f-e8eeeaf89947).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    customerId: {
      propDefinition: [
        common.props.app,
        "customerId",
      ],
    },
  },
  methods: {
    ...common.methods,
    updateCustomer({
      customerId, ...args
    } = {}) {
      return this.app.put({
        path: `/customers/${customerId}`,
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
      isCreate: false,
    });
  },
  async run({ $: step }) {
    const {
      app,
      updateCustomer,
      getDataFromDataColumns,
      formId,
      customerId,
      ...dataColumns
    } = this;

    const response =
      await updateCustomer({
        step,
        customerId,
        data: getDataFromDataColumns(dataColumns),
      });

    step.export("$summary", `Successfully updated customer with ID ${response?.customer?.id}.`);

    return response;
  },
};
