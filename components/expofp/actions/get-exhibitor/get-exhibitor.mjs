import expofp from "../../expofp.app.mjs";

export default {
  name: "Get Exhibitor",
  version: "0.0.2",
  key: "expofp-get-exhibitor",
  description: "Get details of an exhibitor. [See docs here](https://expofp.docs.apiary.io/#reference/0/get-exhibitor-details/get-exhibitor-details)",
  type: "action",
  props: {
    expofp,
    eventId: {
      propDefinition: [
        expofp,
        "eventId",
      ],
    },
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
    const response = await this.expofp.getExhibitor({
      $,
      data: {
        id: this.exhibitorId,
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved exhibitor with ID ${this.exhibitorId}`);
    }

    return response;
  },
};
