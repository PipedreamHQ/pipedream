import klaviyo from "../../klaviyo.app.mjs";

export default {
  key: "klaviyo-get-lists",
  name: "Get Lists",
  description: "Get a listing of all of the lists in an account. [See the docs here](https://developers.klaviyo.com/en/v1-2/reference/get-lists)",
  version: "0.2.0",
  type: "action",
  props: {
    klaviyo,
  },
  methods: {
    getSummary() {
      return "List Successfully fetched!";
    },
  },
  async run({ $ }) {
    const response = await this.klaviyo.getLists();

    $.export("$summary", response || this.getSummary(response));
    return response;
  },
};
