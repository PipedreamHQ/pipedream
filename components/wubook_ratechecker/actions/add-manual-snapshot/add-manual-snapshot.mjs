import wubook from "../../wubook_ratechecker.app.mjs";

export default {
  key: "wubook_ratechecker-add-manual-snapshot",
  name: "Add Manual Snapshot",
  description: "Adds a manual snapshot for a stay. [See the docs](https://wubook.net/wrpeeker/ratechecker/api_examples)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wubook,
    competitorId: {
      propDefinition: [
        wubook,
        "competitorId",
      ],
    },
    stayId: {
      propDefinition: [
        wubook,
        "stayId",
        (c) => ({
          competitorId: c.competitorId,
        }),
      ],
    },
    length: {
      propDefinition: [
        wubook,
        "length",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wubook.addManualSnapshot({
      $,
      params: {
        stay_id: this.stayId,
        length: this.length,
      },
    });

    $.export("$summary", "Successfully created manual snapshot.");

    return response;
  },
};
