import {
  NOTE_IS_HTML,
  NOTE_TYPE_OPTIONS,
  OPENED_VIA_OPTIONS,
} from "../../common/constants.mjs";
import helpspot from "../../helpspot.app.mjs";

export default {
  props: {
    helpspot,
    tNote: {
      type: "string",
      label: "Note",
      description: "The note of the request",
    },
    xCategory: {
      propDefinition: [
        helpspot,
        "xCategory",
      ],
    },
    fNoteType: {
      type: "string",
      label: "Note Type",
      description: "The type of the note",
      options: NOTE_TYPE_OPTIONS,
      optional: true,
    },
    fNoteIsHTML: {
      type: "string",
      label: "Note Is HTML?",
      description: "whether the note is HTML or text",
      optional: true,
      options: NOTE_IS_HTML,
    },
    sTitle: {
      type: "string",
      label: "Subject",
      description: "The title used as email subject",
      optional: true,
    },
    xStatus: {
      propDefinition: [
        helpspot,
        "xStatus",
      ],
      optional: true,
    },
    sUserId: {
      type: "string",
      label: "User Id",
      description: "The Id of the customer",
      optional: true,
    },
    sFirstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the request creator",
      optional: true,
    },
    sLastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the request creator",
      optional: true,
    },
    sEmail: {
      type: "string",
      label: "Email",
      description: "The email of the request creator",
      optional: true,
    },
    sPhone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the request creator",
      optional: true,
    },
    fUrgent: {
      type: "boolean",
      label: "Urgent",
      description: "Whether the request is urgent or not",
      optional: true,
    },
    fOpenedVia: {
      type: "integer",
      label: "Opened Via",
      description: "Request opened via",
      options: OPENED_VIA_OPTIONS,
      optional: true,
    },
    emailFrom: {
      propDefinition: [
        helpspot,
        "emailFrom",
      ],
      optional: true,
    },
    emailCC: {
      type: "string[]",
      label: "Email CC",
      description: "A list of emails to CC on the request",
      optional: true,
    },
    emailBCC: {
      type: "string[]",
      label: "Email BCC",
      description: "A list of emails to BCC on the request",
      optional: true,
    },
    emailStaff: {
      propDefinition: [
        helpspot,
        "emailStaff",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    await this.getValidation();

    const fn = this.getFunction();
    const response = await fn({
      $,
      data: this.getData(),
    });

    $.export("$summary", this.getSummary(response));
    return response;
  },
};
