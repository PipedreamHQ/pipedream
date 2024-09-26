export default {
  methods: {
    getItemName() {
      throw new Error("Item name not defined for this list action");
    },
    async runRequest() {
      throw new Error("Request method not defined for this list action");
    },
  },
  async run({ $ }) {
    const response = await this.runRequest($);

    const amount = response.length;
    if (typeof amount !== "number") {
      throw new Error("Unknown return value for this list action");
    }

    const itemName = this.getItemName();
    const summary =
      amount === 0
        ? `Successful request, but no ${itemName}s were found`
        : `Successfully fetched ${amount} ${itemName}${
          amount === 1
            ? ""
            : "s"
        }`;

    $.export("$summary", summary);
    return response;
  },
};
