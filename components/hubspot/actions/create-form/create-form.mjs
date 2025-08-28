import { ConfigurationError } from "@pipedream/platform";
import { LANGUAGE_OPTIONS } from "../../common/constants.mjs";
import {
  cleanObject, parseObject,
} from "../../common/utils.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-create-form",
  name: "Create Form",
  description: "Create a form in HubSpot. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F)",
  version: "0.0.2",
  type: "action",
  props: {
    hubspot,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the form.",
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Whether the form is archived.",
      optional: true,
    },
    fieldGroups: {
      type: "string[]",
      label: "Field Groups",
      description: "A list for objects of group type and fields. **Format: `[{ \"groupType\": \"default_group\", \"richTextType\": \"text\", \"fields\": [ { \"objectTypeId\": \"0-1\", \"name\": \"email\", \"label\": \"Email\", \"required\": true, \"hidden\": false, \"fieldType\": \"email\", \"validation\": { \"blockedEmailDomains\": [], \"useDefaultBlockList\": false }}]}]`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information.",
      optional: true,
    },
    createNewContactForNewEmail: {
      type: "boolean",
      label: "Create New Contact for New Email",
      description: "Whether to create a new contact when a form is submitted with an email address that doesn't match any in your existing contacts records.",
      optional: true,
    },
    editable: {
      type: "boolean",
      label: "Editable",
      description: "Whether the form can be edited.",
      optional: true,
    },
    allowLinkToResetKnownValues: {
      type: "boolean",
      label: "Allow Link to Reset Known Values",
      description: "Whether to add a reset link to the form. This removes any pre-populated content on the form and creates a new contact on submission.",
      optional: true,
    },
    lifecycleStages: {
      type: "string[]",
      label: "Lifecycle Stages",
      description: "A list of objects of lifecycle stages. **Format: `[{ \"objectTypeId\": \"0-1\", \"value\": \"subscriber\" }]`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information.",
      optional: true,
      default: [],
    },
    postSubmitActionType: {
      type: "string",
      label: "Post Submit Action Type",
      description: "The action to take after submit. The default action is displaying a thank you message.",
      options: [
        "thank_you",
        "redirect_url",
      ],
      optional: true,
    },
    postSubmitActionValue: {
      type: "string",
      label: "Post Submit Action Value",
      description: "The thank you text or the page to redirect to.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language of the form.",
      options: LANGUAGE_OPTIONS,
      optional: true,
    },
    prePopulateKnownValues: {
      type: "boolean",
      label: "Pre-populate Known Values",
      description: "Whether contact fields should pre-populate with known information when a contact returns to your site.",
      optional: true,
    },
    cloneable: {
      type: "boolean",
      label: "Cloneable",
      description: "Whether the form can be cloned.",
      optional: true,
    },
    notifyContactOwner: {
      type: "boolean",
      label: "Notify Contact Owner",
      description: "Whether to send a notification email to the contact owner when a submission is received.",
      optional: true,
    },
    recaptchaEnabled: {
      type: "boolean",
      label: "Recaptcha Enabled",
      description: "Whether CAPTCHA (spam prevention) is enabled.",
      optional: true,
    },
    archivable: {
      type: "boolean",
      label: "Archivable",
      description: "Whether the form can be archived.",
      optional: true,
    },
    notifyRecipients: {
      propDefinition: [
        hubspot,
        "contactEmail",
      ],
      type: "string[]",
      optional: true,
    },
    renderRawHtml: {
      type: "boolean",
      label: "Render Raw HTML",
      description: "Whether the form will render as raw HTML as opposed to inside an iFrame.",
      optional: true,
    },
    cssClass: {
      type: "string",
      label: "CSS Class",
      description: "The CSS class of the form.",
      optional: true,
    },
    theme: {
      type: "string",
      label: "Theme",
      description: "The theme used for styling the input fields. This will not apply if the form is added to a HubSpot CMS page.",
      options: [
        "default_style",
        "canvas",
        "linear",
        "round",
        "sharp",
        "legacy",
      ],
      optional: true,
    },
    submitButtonText: {
      type: "string",
      label: "Submit Button Text",
      description: "The text displayed on the form submit button.",
      optional: true,
    },
    labelTextSize: {
      type: "string",
      label: "Label Text Size",
      description: "The size of the label text.",
      optional: true,
    },
    legalConsentTextColor: {
      type: "string",
      label: "Legal Consent Text Color",
      description: "The color of the legal consent text.",
      optional: true,
    },
    fontFamily: {
      type: "string",
      label: "Font Family",
      description: "The font family of the form.",
      optional: true,
    },
    legalConsentTextSize: {
      type: "string",
      label: "Legal Consent Text Size",
      description: "The size of the legal consent text.",
      optional: true,
    },
    backgroundWidth: {
      type: "string",
      label: "Background Width",
      description: "The width of the background.",
      optional: true,
    },
    helpTextSize: {
      type: "string",
      label: "Help Text Size",
      description: "The size of the help text.",
      optional: true,
    },
    submitFontColor: {
      type: "string",
      label: "Submit Font Color",
      description: "The color of the submit font.",
      optional: true,
    },
    labelTextColor: {
      type: "string",
      label: "Label Text Color",
      description: "The color of the label text.",
      optional: true,
    },
    submitAlignment: {
      type: "string",
      label: "Submit Alignment",
      description: "The alignment of the submit button.",
      options: [
        "left",
        "center",
        "right",
      ],
      optional: true,
    },
    submitSize: {
      type: "string",
      label: "Submit Size",
      description: "The size of the submit button.",
      optional: true,
    },
    helpTextColor: {
      type: "string",
      label: "Help Text Color",
      description: "The color of the help text.",
      optional: true,
    },
    submitColor: {
      type: "string",
      label: "Submit Color",
      description: "The color of the submit button.",
      optional: true,
    },
    legalConsentOptionsType: {
      type: "string",
      label: "Legal Consent Options Type",
      description: "The type of legal consent options.",
      options: [
        "none",
        "legitimate_interest",
        "explicit_consent_process",
        "implicit_consent_process",
      ],
      optional: true,
    },
    legalConsentOptionsObject: {
      type: "object",
      label: "Legal Consent Options Object",
      description: "The object of legal consent options. **Format: `{\"subscriptionTypeIds\": [1,2,3], \"lawfulBasis\": \"lead\", \"privacy\": \"string\"}`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information.",
      optional: true,
    },
  },
  async run({ $ }) {
    const configuration = {};
    if (
      (this.postSubmitActionType && !this.postSubmitActionValue) ||
      (!this.postSubmitActionType && this.postSubmitActionValue)
    ) {
      throw new ConfigurationError("Post Submit Action Type and Value must be provided together.");
    }

    if (this.language) {
      configuration.language = this.language;
    }
    if (this.cloneable) {
      configuration.cloneable = this.cloneable;
    }
    if (this.postSubmitActionType) {
      configuration.postSubmitAction = {
        type: this.postSubmitActionType,
        value: this.postSubmitActionValue,
      };
    }
    if (this.editable) {
      configuration.editable = this.editable;
    }
    if (this.archivable) {
      configuration.archivable = this.archivable;
    }
    if (this.recaptchaEnabled) {
      configuration.recaptchaEnabled = this.recaptchaEnabled;
    }
    if (this.notifyContactOwner) {
      configuration.notifyContactOwner = this.notifyContactOwner;
    }
    if (this.notifyRecipients) {
      configuration.notifyRecipients = parseObject(this.notifyRecipients);
    }
    if (this.createNewContactForNewEmail) {
      configuration.createNewContactForNewEmail = this.createNewContactForNewEmail;
    }
    if (this.prePopulateKnownValues) {
      configuration.prePopulateKnownValues = this.prePopulateKnownValues;
    }
    if (this.allowLinkToResetKnownValues) {
      configuration.allowLinkToResetKnownValues = this.allowLinkToResetKnownValues;
    }
    if (this.lifecycleStages) {
      configuration.lifecycleStages = parseObject(this.lifecycleStages);
    }

    const data = cleanObject({
      "formType": "hubspot",
      "name": this.name,
      "createdAt": new Date(Date.now()).toISOString(),
      "archived": this.archived,
      "fieldGroups": parseObject(this.fieldGroups),
      "displayOptions": {
        "renderRawHtml": this.renderRawHtml,
        "cssClass": this.cssClass,
        "theme": this.theme,
        "submitButtonText": this.submitButtonText,
        "style": {
          "labelTextSize": this.labelTextSize,
          "legalConsentTextColor": this.legalConsentTextColor,
          "fontFamily": this.fontFamily,
          "legalConsentTextSize": this.legalConsentTextSize,
          "backgroundWidth": this.backgroundWidth,
          "helpTextSize": this.helpTextSize,
          "submitFontColor": this.submitFontColor,
          "labelTextColor": this.labelTextColor,
          "submitAlignment": this.submitAlignment,
          "submitSize": this.submitSize,
          "helpTextColor": this.helpTextColor,
          "submitColor": this.submitColor,
        },
      },
      "legalConsentOptions": {
        "type": this.legalConsentOptionsType,
        ...(this.legalConsentOptionsObject
          ? parseObject(this.legalConsentOptionsObject)
          : {}),
      },
    });

    data.configuration = cleanObject(configuration);

    const response = await this.hubspot.createForm({
      $,
      data,
    });

    $.export("$summary", `Successfully created form with ID: ${response.id}`);

    return response;
  },
};
