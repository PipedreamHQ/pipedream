import zerobounce from "../../zerobounce.app.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "zerobounce-file-validation",
  name: "Validate Emails in File",
  description: "Performs email validation on all the addresses contained in a provided file. [See the documentation](https://www.zerobounce.net/docs/email-validation-api-quickstart/)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zerobounce,
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The csv or txt file to validate. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.csv`)",
    },
    emailAddressColumn: {
      type: "integer",
      label: "Email Address Column",
      description: "The column index of the email address in the file. Index starts from 1.",
    },
    firstNameColumn: {
      type: "integer",
      label: "First Name Column",
      description: "The column index of the first name column. Index starts from 1.",
      optional: true,
    },
    lastNameColumn: {
      type: "integer",
      label: "Last Name Column",
      description: "The column index of the last name column. Index starts from 1.",
      optional: true,
    },
    ipAddressColumn: {
      type: "integer",
      label: "IP Address Column",
      description: "The IP Address the email signed up from. Index starts from 1",
      optional: true,
    },
    hasHeaderRow: {
      type: "boolean",
      label: "Has Header Row",
      description: "If the first row from the submitted file is a header row",
      optional: true,
    },
    removeDuplicates: {
      type: "boolean",
      label: "Remove Duplicates",
      description: "If you want the system to remove duplicate emails. Default is `true`. Please note that if we remove more than 50% of the lines because of duplicates (parameter is true), system will return a 400 bad request error as a safety net to let you know that more than 50% of the file has been modified.",
      optional: true,
    },
    returnUrl: {
      type: "string",
      label: "Return URL",
      description: "The URL will be used to call back when the validation is completed",
      optional: true,
    },
    callbackWithRerun: {
      type: "boolean",
      label: "Callback With Rerun",
      description: "Use the `$.flow.rerun` Node.js helper to rerun the step when the validation is completed. Overrides the `rerunUrl` prop. This will increase execution time and credit usage as a result. [See the documentation](https://pipedream.com/docs/code/nodejs/rerun/#flow-rerun). Not available in Pipedream Connect.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    let response, summary;
    const context = $.context;
    const run = context
      ? context.run
      : {
        runs: 1,
      };

    if (run.runs === 1) {
      let returnUrl  = this.returnUrl;
      if (context && this.callbackWithRerun) {
        ({ resume_url: returnUrl } = $.flow.rerun(600000, null, 1));
      }

      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.filePath);
      const formData = new FormData();
      formData.append("file", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
      formData.append("email_address_column", this.emailAddressColumn);
      formData.append("api_key", this.zerobounce.$auth.api_key);
      if (this.firstNameColumn) {
        formData.append("first_name_column", this.firstNameColumn);
      }
      if (this.lastNameColumn) {
        formData.append("last_name_column", this.lastNameColumn);
      }
      if (this.ipAddressColumn) {
        formData.append("ip_address_column", this.ipAddressColumn);
      }
      if (this.hasHeaderRow) {
        formData.append("has_header_row", this.hasHeaderRow
          ? "true"
          : "false");
      }
      if (this.removeDuplicates) {
        formData.append("remove_duplicate", this.removeDuplicates
          ? "true"
          : "false");
      }
      if (returnUrl) {
        formData.append("return_url", returnUrl);
      }

      response = await this.zerobounce.validateEmailsInFile({
        $,
        data: formData,
        headers: {
          ...formData.getHeaders(),
        },
      });
      summary = "Successfully sent file for validation";
    }

    if (run.callback_request) {
      response = run.callback_request.body;
      summary = "Successfully validated emails in file";
    }

    $.export("$summary", summary);
    return response;
  },
};
