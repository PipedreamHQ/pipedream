import expofp from "../../expofp.app.mjs";

export default {
  name: "Update Booth",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "expofp-update-booth",
  description: "Updates a booth. [See the documentation](https://expofp.docs.apiary.io/#reference/0/update-booth/update-booth)",
  type: "action",
  methods: {
    async updateBooth(args) {
      return this.expofp._makeRequest({
        path: "/update-booth",
        method: "post",
        ...args,
      });
    },
  },
  props: {
    expofp,
    eventId: {
      propDefinition: [
        expofp,
        "eventId",
      ],
    },
    boothName: {
      propDefinition: [
        expofp,
        "boothName",
        ({ eventId }) => ({
          eventId,
        }),
      ],
    },
    adminNotes: {
      label: "Admin Notes",
      description: "Admin notes for the booth. E.g. `Hidden administrative notes for booth`",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.updateBooth({
      $,
      data: {
        eventId: this.eventId,
        name: this.boothId,
        adminNotes: this.adminNotes,
      },
    });

    $.export("$summary", `Successfully updated booth with ID ${this.boothId}`);

    return response;
  },
};
