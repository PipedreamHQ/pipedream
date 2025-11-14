import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-list-availabilities",
  name: "List Availabilities",
  description: "List availabilities of a channel you have access to. [See the documentation](https://developers.bookingexperts.com/reference/availabilities-index)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bookingExperts,
  },
  async run({ $ }) {
    const { data } = await this.bookingExperts.listAvailabilities({
      $,
    });
    $.export("$summary", `Found ${data.length} availabilities`);
    return data;
  },
};
