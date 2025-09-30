import common from "../common/add-or-update-exhibitor.mjs";

export default {
  ...common,
  name: "Add Exhibitor",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "expofp-add-exhibitor",
  description:
    "Adds an exhibitor. [See the documentation](https://expofp.docs.apiary.io/#reference/0/add-exhibitor/add-exhibitor)",
  type: "action",
  methods: {
    ...common.methods,
    async addExhibitor(args) {
      return this.expofp._makeRequest({
        path: "/add-exhibitor",
        method: "post",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const { eventId } = this;
    const response = await this.addExhibitor({
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
