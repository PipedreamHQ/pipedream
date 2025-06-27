import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "add_to_calendar_pro-update-rsvp-template",
  name: "Update RSVP Template",
  description: "Update an RSVP template. [See the documentation](https://docs.add-to-calendar-pro.com/api/rsvp#update-an-rsvp-template)",
  version: "0.0.1",
  type: "action",
  props: {
    addToCalendarPro,
    rsvpTemplateId: {
      propDefinition: [
        addToCalendarPro,
        "rsvpTemplateId",
      ],
    },
    rsvpTemplateName: {
      propDefinition: [
        addToCalendarPro,
        "rsvpTemplateName",
      ],
      optional: true,
    },
    max: {
      propDefinition: [
        addToCalendarPro,
        "rsvpTemplateMax",
      ],
    },
    maxPP: {
      propDefinition: [
        addToCalendarPro,
        "rsvpTemplateMaxPP",
      ],
    },
    expires: {
      propDefinition: [
        addToCalendarPro,
        "expires",
      ],
    },
    maybeOption: {
      propDefinition: [
        addToCalendarPro,
        "maybeOption",
      ],
    },
    initialConfirmation: {
      propDefinition: [
        addToCalendarPro,
        "initialConfirmation",
      ],
    },
    doi: {
      propDefinition: [
        addToCalendarPro,
        "doi",
      ],
    },
    headline: {
      propDefinition: [
        addToCalendarPro,
        "headline",
      ],
    },
    text: {
      propDefinition: [
        addToCalendarPro,
        "text",
      ],
    },
    fields: {
      propDefinition: [
        addToCalendarPro,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.addToCalendarPro.updateRsvpTemplate({
      $,
      rsvpTemplateId: this.rsvpTemplateId,
      data: {
        name: this.rsvpTemplateName,
        max: this.max,
        maxpp: this.maxPP,
        expires: this.expires,
        maybe_option: this.maybeOption,
        initial_confirmation: this.initialConfirmation,
        doi: this.doi,
        headline: this.headline,
        text: this.text,
        fields: parseObject(this.fields),
      },
    });
    $.export("$summary", "Successfully updated RSVP template.");
    return response;
  },
};
