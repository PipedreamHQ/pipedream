import expofp from "../../expofp.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  name: "Update Exhibitor",
  version: "0.0.2",
  key: "expofp-update-exhibitor",
  description: "Updates an exhibitor. [See docs here](https://expofp.docs.apiary.io/#reference/0/update-exhibitor/update-exhibitor)",
  type: "action",
  props: {
    ...common.props,
    exhibitorId: {
      propDefinition: [
        expofp,
        "exhibitorId",
        (c) => ({
          eventId: c.eventId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.expofp.updateExhibitor({
      $,
      data: {
        ...this.getCommonParams(),
        id: this.exhibitorId,
      },
    });

    $.export("$summary", `Successfully updated exhibitor with ID ${this.exhibitorId}`);

    return response;
  },
};
