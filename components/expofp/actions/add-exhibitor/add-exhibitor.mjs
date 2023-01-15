import common from "../common.mjs";

export default {
  ...common,
  name: "Add Exhibitor",
  version: "0.0.1",
  key: "expofp-add-exhibitor",
  description:
    "Adds an exhibitor. [See docs here](https://expofp.docs.apiary.io/#reference/0/add-exhibitor/add-exhibitor)",
  type: "action",
  props: {
    ...common.props,
  },
  async run({ $ }) {
    const { eventId } = this;
    const response = await this.expofp.addExhibitor({
      $,
      data: {
        ...this.getCommonParams(),
        eventId,
      },
    });

    $.export(
      "$summary",
      `Successfully created exhibitor (ID ${response.id})`,
    );

    return response;
  },
};
