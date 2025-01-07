import typefully from "../../typefully.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "typefully-schedule-draft-next-slot",
  name: "Schedule Draft Next Slot",
  description: "Schedules an existing draft for publication in the next available time slot. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    typefully,
    content: {
      propDefinition: [
        typefully,
        "content",
      ],
    },
    threadify: {
      propDefinition: [
        typefully,
        "threadify",
      ],
      optional: true,
    },
    share: {
      propDefinition: [
        typefully,
        "share",
      ],
      optional: true,
    },
    autoRetweetEnabled: {
      propDefinition: [
        typefully,
        "autoRetweetEnabled",
      ],
      optional: true,
    },
    autoPlugEnabled: {
      propDefinition: [
        typefully,
        "autoPlugEnabled",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.typefully.scheduleDraftNextAvailableSlot();
    $.export("$summary", "Draft scheduled successfully");
    return response;
  },
};
