import anymail from "../../anymail.app.mjs";

export default {
  key: "anymail-add-to-suppression-list",
  name: "Add to Suppression List",
  description: "Stops anymail from ever emailing an address or a whole domain. [See the docs](https://developers.anymail.watch/suppressions/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    anymail,
    target: {
      type: "string",
      label: "Email or Domain",
      description: "For example `ada@example.com` or `example.com`.",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.anymail.createSuppression({
        $,
        data: {
          target: this.target,
        },
      });
      $.export("$summary", `Suppressed ${this.target}`);
      return response;
    } catch (err) {
      // 409 means it is already suppressed: that is the wanted end state, so the step must not fail.
      if (err.response?.status !== 409) throw err;
      $.export("$summary", `${this.target} was already suppressed`);
      return {
        value: this.target,
        already_suppressed: true,
      };
    }
  },
};
