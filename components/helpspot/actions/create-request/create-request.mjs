import { parseObject } from "../../common/utils.mjs";
import common from "../common/request-base.mjs";

export default {
  ...common,
  key: "helpspot-create-request",
  name: "Create Request",
  description: "Creates a new user request. [See the documentation](https://support.helpspot.com/index.php?pg=kb.page&id=164#private.request.create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    getValidation() {
      if (!this.sFirstName && !this.sLastName && !this.sUserId && !this.sEmail && !this.sPhone) {
        throw new Error("You must provide at least one of the following: First Name, Last Name, User ID, Email, or Phone.");
      }
    },
    getFunction() {
      return this.helpspot.createRequest;
    },
    getData() {
      return {
        tNote: this.tNote,
        xCategory: this.xCategory,
        fNoteType: this.fNoteType && parseInt(this.fNoteType),
        fNoteIsHTML: this.fNoteIsHTML && parseInt(this.fNoteIsHTML),
        sTitle: this.sTitle,
        xStatus: this.xStatus,
        sUserId: this.sUserId,
        sFirstName: this.sFirstName,
        sLastName: this.sLastName,
        sEmail: this.sEmail,
        sPhone: this.sPhone,
        fUrgent: +this.fUrgent,
        fOpenedVia: this.fOpenedVia,
        email_from: this.emailFrom,
        email_cc: parseObject(this.emailCC)?.join(),
        email_bcc: parseObject(this.emailBCC)?.join(),
        email_staff: parseObject(this.emailStaff)?.join(),
      };
    },
    getSummary(response) {
      return `Successfully created request with Id: ${response.xRequest}`;
    },
  },
};
