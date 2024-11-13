import zerobounce from "../../zerobounce.app.mjs";

export default {
  key: "zerobounce-file-validation",
  name: "Validate Emails in File",
  description: "Performs email validation on all the addresses contained in a provided file. [See the documentation](https://www.zerobounce.net/docs/email-validation-api-quickstart/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zerobounce,
    file: zerobounce.propDefinitions.file,
  },
  async run({ $ }) {
    const response = await this.zerobounce.validateEmailsInFile(this.file);
    $.export("$summary", "Successfully validated emails in file");
    return response;
  },
};
