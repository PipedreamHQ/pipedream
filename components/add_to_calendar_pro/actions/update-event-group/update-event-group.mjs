import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";
import { omitUndefined } from "../../common/utils.mjs";

export default {
  key: "add_to_calendar_pro-update-event-group",
  name: "Update Event Group",
  description: "Update an event group. [See the documentation](https://docs.add-to-calendar-pro.com/api/groups#update-a-group)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    addToCalendarPro,
    groupProKey: {
      propDefinition: [
        addToCalendarPro,
        "groupProKey",
      ],
    },
    eventGroupName: {
      propDefinition: [
        addToCalendarPro,
        "eventGroupName",
      ],
      optional: true,
    },
    internalNote: {
      propDefinition: [
        addToCalendarPro,
        "internalNote",
      ],
    },
    subscription: {
      propDefinition: [
        addToCalendarPro,
        "subscription",
      ],
      options: [
        "no",
        "children",
      ],
      description: "Existing no and children groups can switch between those modes. External groups cannot change mode.",
    },
    publicEventOverview: {
      propDefinition: [
        addToCalendarPro,
        "publicEventOverview",
      ],
    },
    subscriptionCalUrl: {
      propDefinition: [
        addToCalendarPro,
        "subscriptionCalUrl",
      ],
      description: "URL to an external calendar. Needs to start with \"http\"! Usually ends with \".ics\". You can only change the subscription setting as long as there are no events linked to the group.",
    },
    cta: {
      propDefinition: [
        addToCalendarPro,
        "cta",
      ],
    },
    styleId: {
      propDefinition: [
        addToCalendarPro,
        "styleId",
      ],
    },
    landingPageTemplateId: {
      propDefinition: [
        addToCalendarPro,
        "landingPageTemplateId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const subscription = this.subscription ?? (this.subscriptionCalUrl === undefined
      ? undefined
      : this.subscriptionCalUrl
        ? "external"
        : "no");
    const response = await this.addToCalendarPro.updateGroup({
      $,
      groupProKey: this.groupProKey,
      data: omitUndefined({
        name: this.eventGroupName,
        internal_note: this.internalNote,
        subscription,
        public_event_overview: this.publicEventOverview,
        subscription_cal_url: subscription === "children"
          ? undefined
          : this.subscriptionCalUrl,
        cta: this.cta,
        layout: this.styleId,
        landingpage: this.landingPageTemplateId,
      }),
    });
    $.export("$summary", "Successfully updated event group.");
    return response;
  },
};
