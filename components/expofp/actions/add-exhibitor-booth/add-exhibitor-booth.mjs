import expofp from "../../expofp.app.mjs";

export default {
  name: "Add Exhibitor Booth",
  version: "0.0.1",
  key: "expofp-add-exhibitor-booth",
  description:
    "Adds an exhibitor booth. [See docs here](https://expofp.docs.apiary.io/#reference/0/add-exhibitor-booth/add-exhibitor-booth)",
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
      type: "string",
      label: "Booth Name",
      description: "Unique name of booth, e.g. `101`",
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
      `Successfully created booth "${this.boothName}"`,
    );

    return response;
  },
};
