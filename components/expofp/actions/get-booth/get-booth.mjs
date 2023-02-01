import expofp from "../../expofp.app.mjs";

export default {
  name: "Get Booth",
  version: "0.0.2",
  key: "expofp-get-booth",
  description: "Get details of a booth. [See docs here](https://expofp.docs.apiary.io/#reference/0/get-booth-details/get-booth-details)",
  type: "action",
  methods: {
    async getBooth(args) {
      return this.expofp._makeRequest({
        path: "/get-booth",
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
    boothId: {
      label: "Booth ID/Name",
      type: "string",
      description: "The booth ID or name. E.g. `101` or `A21`",
    },
  },
  async run({ $ }) {
    const response = await this.getBooth({
      $,
      data: {
        eventId: this.eventId,
        name: this.boothId,
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved booth with ID ${this.boothId}`);
    }

    return response;
  },
};
