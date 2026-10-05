import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";
import { omitUndefined } from "../../common/utils.mjs";

export default {
  key: "add_to_calendar_pro-create-event-group",
  name: "Create Event Group",
  description: "Create an event group. [See the documentation](https://docs.add-to-calendar-pro.com/api/groups#add-a-group)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    subscription: {
      propDefinition: [
        addToCalendarPro,
        "subscription",
      ],
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
    ctaTemplateId: {
      propDefinition: [
        addToCalendarPro,
        "ctaTemplateId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const subscription = this.subscription ?? (this.subscriptionCalUrl
      ? "external"
      : "no");
    const response = await this.addToCalendarPro.createGroup({
      $,
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
        cta_block: this.ctaTemplateId,
      }),
    });
    $.export("$summary", "Successfully created event group.");
    return response;
  },
};
