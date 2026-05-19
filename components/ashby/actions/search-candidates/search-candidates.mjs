import { ConfigurationError } from "@pipedream/platform";
import app from "../../ashby.app.mjs";

export default {
  key: "ashby-search-candidates",
  name: "Search Candidates",
  description: "Search candidates by email and/or name. Limited to 100 results. [See the documentation](https://developers.ashbyhq.com/reference/candidatesearch)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "The candidate's email address to search by",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The candidate's name to search by",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      email,
      name,
    } = this;

    if (!email && !name) {
      throw new ConfigurationError("Please provide at least one of `Email` or `Name` to search by.");
    }

    const response = await app.searchCandidates({
      $,
      data: {
        email,
        name,
      },
    });

    const count = response?.results?.length ?? 0;
    $.export("$summary", `Successfully retrieved \`${count}\` candidate(s)`);

    return response;
  },
};
