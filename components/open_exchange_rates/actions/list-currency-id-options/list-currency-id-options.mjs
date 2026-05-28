import { open_exchange_rates } from "../../open_exchange_rates.app.mjs";

export default {
  key: "open_exchange_rates-list-currency-id-options",
  name: "List Currency ID Options",
  description: "Retrieves available options for the Currency ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    open_exchange_rates,
  },
  async run({ $ }) {
    const options = await open_exchange_rates.propDefinitions.currencyId.options
      .call(this.open_exchange_rates, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
