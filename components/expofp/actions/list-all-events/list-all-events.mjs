import expofp from "../../expofp.app.mjs";

export default {
  name: "List All Events",
  version: "0.0.1",
  key: "expofp-list-all-events",
  description:
    "List all events. [See docs here](https://expofp.docs.apiary.io/#reference/0/list-all-events/list-all-events)",
  type: "action",
  props: {
    expofp,
  },
  async run({ $ }) {
    const response = await this.expofp.listAllEvents({
      $,
    });

    const { length } = response;

    $.export(
      "$summary",
      `Successfully listed ${length} event${length === 1
        ? ""
        : "s"}`,
    );

    return response;
  },
};
