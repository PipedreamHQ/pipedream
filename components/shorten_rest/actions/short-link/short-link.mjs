import app from "../../shorten_rest.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shorten_rest-short-link",
  name: "Shorten Link",
  description: "Shortens a given long URL into an alias. If the alias name is not provided, the system generates one. If the domain input is not provided, it defaults to short.fyi. [See the documentation](https://docs.shorten.rest/#tag/Alias/operation/CreateAlias)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    domainName: {
      type: "string",
      label: "Domain Name",
      description: "The domain which alias will belong to (string without `http/https` or `/`). Eg. `your.domain.com`. Defaults to `short.fyi`",
      optional: true,
    },
    aliasName: {
      type: "string",
      label: "Alias Name",
      description: "Alias (without `/` at the beginning). Eg. `aBcDe012`. Defaults to `@rnd`",
      optional: true,
    },
    destinations: {
      type: "string[]",
      label: "Destinations",
      description: "Array of objects (**DestinationModel**). Where each row should be a JSON object like this: `{\"url\": \"mydomain.com\"}`. Please read [the docs here](https://docs.shorten.rest/#section/Introduction)",
    },
  },
  methods: {
    createAlias(args = {}) {
      return this.app.post({
        path: "/aliases",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createAlias,
      domainName,
      aliasName,
      destinations,
    } = this;

    const response = await createAlias({
      $,
      params: {
        aliasName,
        domainName,
      },
      data: {
        destinations: utils.parseArray(destinations),
      },
    });

    $.export("$summary", `Successfully shortened the link to \`${response.shortUrl}\``);
    return response;
  },
};
