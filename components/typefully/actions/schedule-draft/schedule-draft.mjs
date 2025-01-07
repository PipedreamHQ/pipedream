import typefully from "../../typefully.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "typefully-schedule-draft",
  name: "Schedule Draft",
  description: "Schedules a draft for publication at a specific date and time. [See the documentation](https://support.typefully.com/en/articles/8718287-typefully-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    typefully,
    content: {
      propDefinition: [
        "typefully",
        "content",
      ],
    },
    scheduleDate: {
      propDefinition: [
        "typefully",
        "scheduleDate",
      ],
      optional: false,
    },
    threadify: {
      propDefinition: [
        "typefully",
        "threadify",
      ],
      optional: true,
    },
    share: {
      propDefinition: [
        "typefully",
        "share",
      ],
      optional: true,
    },
    autoRetweetEnabled: {
      propDefinition: [
        "typefully",
        "autoRetweetEnabled",
      ],
      optional: true,
    },
    autoPlugEnabled: {
      propDefinition: [
        "typefully",
        "autoPlugEnabled",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.typefully.scheduleDraftAtSpecificDate();
    $.export("$summary", `Draft scheduled for ${this.scheduleDate}`);
    return response;
  },
};
