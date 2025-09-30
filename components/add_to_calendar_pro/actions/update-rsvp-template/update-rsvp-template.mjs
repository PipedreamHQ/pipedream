import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "add_to_calendar_pro-update-rsvp-template",
  name: "Update RSVP Template",
  description: "Update an RSVP template. [See the documentation](https://docs.add-to-calendar-pro.com/api/rsvp#update-an-rsvp-template)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    emailRsvpDoi: {
      propDefinition: [
        addToCalendarPro,
        "emailTemplateId",
        () => ({
          type: "rsvp_doi",
        }),
      ],
      label: "Email Template: DOI",
    },
    emailRsvpThankYou: {
      propDefinition: [
        addToCalendarPro,
        "emailTemplateId",
        () => ({
          type: "rsvp_thank_you",
        }),
      ],
      label: "Email Template: Thank you",
    },
    emailRsvpSignupConfirmation: {
      propDefinition: [
        addToCalendarPro,
        "emailTemplateId",
        () => ({
          type: "rsvp_signup_confirmation",
        }),
      ],
      label: "Email Template: Sign-up Confirmation",
    },
    emailRsvpChangeConfirmation: {
      propDefinition: [
        addToCalendarPro,
        "emailTemplateId",
        () => ({
          type: "rsvp_change_confirmation",
        }),
      ],
      label: "Email Template: Change Confirmation",
    },
    emailRsvpEventUpdate: {
      propDefinition: [
        addToCalendarPro,
        "emailTemplateId",
        () => ({
          type: "rsvp_event_update",
        }),
      ],
      label: "Email Template: Event Update",
    },
    emailRsvpMagicLink: {
      propDefinition: [
        addToCalendarPro,
        "emailTemplateId",
        () => ({
          type: "rsvp_magic_link",
        }),
      ],
      label: "Email Template: Magic Link",
    },
    emailRsvpSecondSignup: {
      propDefinition: [
        addToCalendarPro,
        "emailTemplateId",
        () => ({
          type: "rsvp_second_signup",
        }),
      ],
      label: "Email Template: Second Sign-up",
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
        email_rsvp_doi: this.emailRsvpDoi,
        email_rsvp_thank_you: this.emailRsvpThankYou,
        email_rsvp_signup_confirmation: this.emailRsvpSignupConfirmation,
        email_rsvp_change_confirmation: this.emailRsvpChangeConfirmation,
        email_rsvp_event_update: this.emailRsvpEventUpdate,
        email_rsvp_magic_link: this.emailRsvpMagicLink,
        email_rsvp_second_signup: this.emailRsvpSecondSignup,
      },
    });
    $.export("$summary", "Successfully updated RSVP template.");
    return response;
  },
};
