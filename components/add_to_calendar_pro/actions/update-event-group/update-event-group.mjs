import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

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
    subscriptionCalUrl: {
      propDefinition: [
        addToCalendarPro,
        "subscriptionCalUrl",
      ],
      description: "URL to an external calendar. Needs to start with \"http\"! Usually ends with \".ics\". Note: You can only change the subscription setting as long as there are no events linked to the group",
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
    const response = await this.addToCalendarPro.updateGroup({
      $,
      groupProKey: this.groupProKey,
      data: {
        name: this.eventGroupName,
        internal_note: this.internalNote,
        subscription: this.subscriptionCalUrl
          ? "external"
          : "no",
        subscription_cal_url: this.subscriptionCalUrl,
        cta: this.cta,
        layout: this.styleId,
        landingpage: this.landingPageTemplateId,
      },
    });
    $.export("$summary", "Successfully updated event group.");
    return response;
  },
};
