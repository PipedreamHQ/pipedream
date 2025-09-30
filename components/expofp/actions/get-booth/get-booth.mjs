import expofp from "../../expofp.app.mjs";

export default {
  name: "Get Booth",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "expofp-get-booth",
  description: "Get details of a booth. [See the documentation](https://expofp.docs.apiary.io/#reference/0/get-booth-details/get-booth-details)",
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
    boothName: {
      propDefinition: [
        expofp,
        "boothName",
        ({ eventId }) => ({
          eventId,
        }),
      ],
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
