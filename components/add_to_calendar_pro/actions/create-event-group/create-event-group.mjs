import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-create-event-group",
  name: "Create Event Group",
  description: "Create an event group. [See the documentation](https://docs.add-to-calendar-pro.com/api/groups#add-a-group)",
  version: "0.0.1",
  type: "action",
  props: {
    addToCalendarPro,
    eventGroupName: {
      propDefinition: [
        addToCalendarPro,
        "eventGroupName",
      ],
    },
    internalNote: {
      propDefinition: [
        addToCalendarPro,
        "internalNote",
      ],
    },
    subscriptionCallUrl: {
      propDefinition: [
        addToCalendarPro,
        "subscriptionCallUrl",
      ],
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
    const response = await this.addToCalendarPro.createGroup({
      $,
      data: {
        name: this.eventGroupName,
        internal_note: this.internalNote,
        subscription: this.subscriptionCallUrl
          ? "external"
          : "no",
        subscription_call_url: this.subscriptionCallUrl,
        cta: this.cta,
        layout: this.styleId,
        landingpage: this.landingPageTemplateId,
      },
    });
    $.export("$summary", "Successfully created event group.");
    return response;
  },
};
