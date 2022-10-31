import expofp from "../../expofp.app.mjs";

export default {
  name: "Update Booth",
  version: "0.0.1",
  key: "expofp-update-booth",
  description: "Updates a booth. [See docs here](https://expofp.docs.apiary.io/#reference/0/update-booth/update-booth)",
  type: "action",
  props: {
    expofp,
    eventId: {
      propDefinition: [
        expofp,
        "eventId",
      ],
    },
    boothId: {
      label: "Booth ID/Name",
      type: "string",
      description: "The booth ID or name. E.g. `101` or `A21`",
    },
    adminNotes: {
      label: "Admin Notes",
      description: "Admin notes for the booth. E.g. `Hidden administrative notes for booth`",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.expofp.updateBooth({
      $,
      data: {
        eventId: this.eventId,
        name: this.boothId,
        description: this.description,
      },
    });

    $.export("$summary", `Successfully updasted booth with ID ${this.boothId}`);

    return response;
  },
};
