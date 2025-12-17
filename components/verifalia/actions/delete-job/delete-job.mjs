import verifalia from "../../verifalia.app.mjs";

export default {
  name: "Delete Email Verification Job",
  description: "Delete a previously submitted email verification job. [See the docs](https://verifalia.com/developers#email-validations-deleting) for more information",
  key: "verifalia-delete-job",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    verifalia,
    id: {
      type: "string",
      label: "Job ID",
      description: "The ID of the email verification job to delete. E.g. `e0dda878-3801-43f3-ac20-935e27dbe5a7`",
    },
  },

  async run() {
    const verifaliaClient = this.verifalia.buildVerifaliaRestClient();

    await this.verifalia.wrapVerifaliaApiInvocation(async () => {
      return await verifaliaClient
        .emailValidations
        .delete(this.id);
    });
  },
};
