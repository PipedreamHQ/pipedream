import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-my-company",
  name: "Get My Company",
  description: "Gets info about a company.",
  version: "0.1.2",
  type: "action",
  props: {
    quickbooks,
  },
  async run({ $ }) {

    const response = await this.quickbooks.getBill({
      $,
    });

    if (response) {
      $.export("summary", "Successfully retrieved company");
    }

  },
};
