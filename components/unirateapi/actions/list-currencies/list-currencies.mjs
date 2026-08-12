import app from "../../unirateapi.app.mjs";

export default {
  key: "unirateapi-list-currencies",
  name: "List Currencies",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "List all currency codes supported by UniRate. [See the documentation](https://unirateapi.com/docs).",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const { app } = this;

    const response = await app.listCurrencies({
      $,
    });

    const count = response?.currencies?.length ?? 0;
    $.export("$summary", `Retrieved ${count} supported currenc${count === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};
