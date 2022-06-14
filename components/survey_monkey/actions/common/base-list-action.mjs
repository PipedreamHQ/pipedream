export default {
  methods: {
    getItemName() {
      throw new Error("Item name not defined for this action");
    },
    async runRequest() {
      throw new Error("Request method not defined for this action");
    },
  },
  async run({ $ }) {
    const response = await this.runRequest($);

    const amount = response.length;
    $.export(
      "$summary",
      `Successfully fetched ${amount} ${this.getItemName()}${
        amount === 1
          ? ""
          : "s"
      }`,
    );
    return response;
  },
};
