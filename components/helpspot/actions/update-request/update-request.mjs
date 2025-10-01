import { parseObject } from "../../common/utils.mjs";
import common from "../common/request-base.mjs";

export default {
  ...common,
  key: "helpspot-update-request",
  name: "Update Request",
  description: "Updates an existing user request. [See the documentation](https://support.helpspot.com/index.php?pg=kb.page&id=164#private.request.update)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    xRequest: {
      propDefinition: [
        common.props.helpspot,
        "xRequest",
      ],
    },
  },
  methods: {
    getValidation() {
      return true;
    },
    getFunction() {
      return this.helpspot.updateRequest;
    },
    getData() {
      return {
        xRequest: this.xRequest,
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
    getSummary() {
      return `Successfully updated request with ID ${this.xRequest}`;
    },
  },
};
