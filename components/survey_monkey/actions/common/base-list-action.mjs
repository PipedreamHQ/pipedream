export default {
  methods: {
    getItemType() {
      throw new Error("Item type not defined for this action");
    },
    async runRequest() {
      throw new Error("Request type not defined for this action");
    },
  },
  async run({ $ }) {
    const response = await this.runRequest($);

    const amount = response.length;
    $.export(
      "$summary",
      `Successfully fetched ${amount} ${this.getItemType()}${
        amount === 1
          ? ""
          : "s"
      }`,
    );
    return response;
  },
};
