import expofp from "../../expofp.app.mjs";

export default {
  name: "Get Exhibitor",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "expofp-get-exhibitor",
  description: "Get details of an exhibitor. [See the documentation](https://expofp.docs.apiary.io/#reference/0/get-exhibitor-details/get-exhibitor-details)",
  type: "action",
  methods: {
    async getExhibitor(args) {
      return this.expofp._makeRequest({
        path: "/get-exhibitor",
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
    const response = await this.getExhibitor({
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
