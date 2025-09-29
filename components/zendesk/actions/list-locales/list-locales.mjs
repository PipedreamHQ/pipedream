import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-locales",
  name: "List Locales",
  description: "Retrieves all locales. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/account-configuration/locales/).",
  version: "0.0.3",
  type: "action",
  props: {
    zendesk,
  },
  async run({ $: step }) {
    const { locales } = await this.zendesk.listLocales();

    step.export("$summary", `Successfully retrieved ${locales.length} locale${locales.length === 1
      ? ""
      : "s"}`);

    return locales;
  },
};
