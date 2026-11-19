import geogridapi from "../../geogridapi.app.mjs";

export default {
  key: "geogridapi-get-balance",
  name: "Get Balance",
  description: "Get the credits left on the GeoGridAPI account (`points`; 1 credit = 1 grid point) and the key mode (`live` or `test`). Free."
    + " Check it before **Run Grid**, or use **Estimate Grid** for the exact cost of a grid."
    + " [See the documentation](https://geogridapi.io/en/docs#auth)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    geogridapi,
  },
  async run({ $ }) {
    const balance = await this.geogridapi.getBalance({
      $,
    });
    $.export("$summary", `${balance.points} credits left (${balance.mode} key)`);
    return balance;
  },
};
