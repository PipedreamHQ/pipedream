import app from "../../app/raven_tools.app";
import { defineAction } from "@pipedream/types";
import {
  AddKeywordParams, RavenToolsResponse,
} from "../../common/types";

const DOCS = "https://api.raventools.com/docs/#add_keyword";

export default defineAction({
  name: "Add Keyword",
  description: `Add a keyword to a domain [See docs here](${DOCS})`,
  key: "raven_tools-add-keyword",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
      description: "The domain to add the keyword to.",
    },
    keyword: {
      label: "Keyword",
      description: "The keyword to add.",
      type: "string",
    },
  },
  async run({ $ }): Promise<RavenToolsResponse> {
    const {
      domain, keyword,
    } = this;
    const params: AddKeywordParams = {
      $,
      params: {
        domain,
        keyword,
      },
    };
    const data: RavenToolsResponse = await this.app.addKeyword(params);

    if (data?.response !== "success") {
      throw new Error(
        `Something went wrong. RavenTools response: ${
          data && JSON.stringify(data)
        }`,
      );
    }

    $.export("$summary", `Successfully added keyword "${keyword}"`);
    return data;
  },
});
