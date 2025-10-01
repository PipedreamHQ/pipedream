import expofp from "../../expofp.app.mjs";

export default {
  name: "Add Exhibitor Booth",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "expofp-add-exhibitor-booth",
  description:
    "Adds an exhibitor booth. [See the documentation](https://expofp.docs.apiary.io/#reference/0/add-exhibitor-booth/add-exhibitor-booth)",
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
        ({ eventId }) => ({
          eventId,
        }),
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
  methods: {
    async addExhibitorBooth(args) {
      return this.expofp._makeRequest({
        path: "/add-exhibitor-booth",
        method: "post",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      expofp, ...data
    } = this;
    const response = await this.addExhibitorBooth({
      $,
      data,
    });

    $.export(
      "$summary",
      `Successfully added booth "${this.boothName}"`,
    );

    return response;
  },
};
