import app from "../../app/raven_tools.app";
import { defineAction } from "@pipedream/types";
import { DOCS } from "../../common/docLinks";
import {
  AddKeywordParams, RavenToolsResponse,
} from "../../common/types";

export default defineAction({
  name: "Add Keyword",
  description: `Add a keyword to a domain [See docs here](${DOCS.addKeyword})`,
  key: "raven_tools-add-keyword",
  version: "0.0.1",
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
