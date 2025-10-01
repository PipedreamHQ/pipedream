import expofp from "../../expofp.app.mjs";
import common from "../common/add-or-update-exhibitor.mjs";

export default {
  ...common,
  name: "Update Exhibitor",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "expofp-update-exhibitor",
  description: "Updates an exhibitor. [See the documentation](https://expofp.docs.apiary.io/#reference/0/update-exhibitor/update-exhibitor)",
  type: "action",
  methods: {
    async updateExhibitor(args) {
      return this.expofp._makeRequest({
        path: "/update-exhibitor",
        method: "post",
        ...args,
      });
    },
  },
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
    const response = await this.updateExhibitor({
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
