import metaphor from "../../metaphor.app.mjs";

export default {
  key: "metaphor-get-documents-content",
  name: "Get Contents of Documents",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve contents of documents based on a list of document IDs. [See the documentation](https://docs.metaphor.systems/reference/contents). It is used to `instantly` get content for documents, given the IDs of the documents. We currently support extracts - the first 1000 tokens (~750 words) of parsed HTML for a site. **Note that each piece of content retrieved costs 1 request.** Also note that `instant` is a little bit of a lie if you are using keyword search, in which case contents might take a few seconds to retrieve.",
  type: "action",
  props: {
    metaphor,
    ids: {
      type: "string[]",
      label: "Ids",
      description: "An array of document IDs obtained from either `/search` or `/findSimilar` endpoints.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      metaphor,
      ids,
    } = this;

    const response = await metaphor.getContents({
      $,
      params: {
        ids,
      },
    });

    $.export("$summary", `${response.contents.length} content${response.contents.length > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return response;
  },
};
