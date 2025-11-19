import sanity from "../../sanity.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "sanity-create-document",
  name: "Create Document",
  description: "Create a document in a dataset in Sanity. [See the documentation](https://www.sanity.io/docs/http-reference/actions)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    sanity,
    dataset: {
      propDefinition: [
        sanity,
        "dataset",
      ],
    },
    publishId: {
      type: "string",
      label: "Publish ID",
      description: "The publish ID of the document to create",
    },
    document: {
      type: "object",
      label: "Document",
      description: "The document to create. Must include `_type` and `_id` fields. Example: `{\"_type\":\"post\",\"_id\":\"drafts.post-123\",\"title\":\"My First Post\",\"slug\":{\"current\":\"my-first-post\"},\"body\":[{\"_type\":\"block\",\"children\":[{\"_type\":\"span\",\"text\":\"Hello world!\"}]}]}`",
    },
  },
  async run({ $ }) {
    const document = parseObject(this.document);
    if (!document._type || !document._id) {
      throw new ConfigurationError("Document must include `_type` and `_id` fields");
    }

    const response = await this.sanity.createDocument({
      $,
      dataset: this.dataset,
      data: {
        actions: [
          {
            actionType: "sanity.action.document.create",
            publishedId: this.publishId,
            document,
          },
        ],
      },
    });

    $.export("$summary", "Successfully created document");
    return response;
  },
};
