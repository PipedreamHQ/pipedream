import teamgate from "../../teamgate.app.mjs";
import TEAMGATE_META from "../common/meta-selection.mjs";

export default {
  key: "teamgate-create-activity",
  name: "Create Activity",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new activity [See the docs here](https://developers.teamgate.com/#6be9bc87-47bb-4c32-b46b-9c0771deac83)",
  type: "action",
  props: {
    teamgate,
    type: {
      propDefinition: [
        teamgate,
        "type",
      ],
      reloadProps: true,
    },
    products: {
      propDefinition: [
        teamgate,
        "products",
      ],
      optional: true,
    },
    companies: {
      propDefinition: [
        teamgate,
        "companies",
      ],
      optional: true,
    },
    deals: {
      propDefinition: [
        teamgate,
        "deals",
      ],
      optional: true,
    },
    leads: {
      propDefinition: [
        teamgate,
        "leads",
      ],
      optional: true,
    },
  },
  async additionalProps() {
    return TEAMGATE_META[this.type];
  },
  async run({ $ }) {
    const {
      // eslint-disable-next-line no-unused-vars
      teamgate,
      reminders,
      ...data
    } = this;

    if (reminders && Object.entries(reminders).length) {
      const remindersArray = [];
      for (const [
        key,
        value,
      ] of Object.entries(reminders)) {
        remindersArray.push({
          "type": key,
          "before": value,
        });
      }
      if (remindersArray.length)
        data.reminders = remindersArray;
    }

    const response = await this.teamgate.createEvent({
      $,
      data,
    });
    $.export("$summary", `${data.type} Successfuly created`);
    return response;
  },
};
