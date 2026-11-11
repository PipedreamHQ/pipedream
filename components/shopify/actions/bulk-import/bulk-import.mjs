import shopify from "../../shopify.app.mjs";
import {
  axios, getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "shopify-bulk-import",
  name: "Run Bulk Mutation",
  description: "Runs a bulk mutation (Shopify's `bulkOperationRunMutation`) by uploading a JSONL file of per-line mutation variables, so a mutation (e.g. product/variant/metafield create or update) runs once per line across thousands of records in a single Admin GraphQL bulk operation instead of one API call per record. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/bulkoperationrunmutation)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    shopify,
    alert: {
      type: "alert",
      alertType: "info",
      content: "Use the Shopify trigger \"New Event Emitted (Instant)\" with event type `bulk_operations/finish` to receive notifications when bulk imports are completed",
    },
    mutation: {
      type: "string",
      label: "Mutation",
      description: "The mutation to be executed in bulk. [See the documentation](https://shopify.dev/docs/api/usage/bulk-operations/imports) for a list of supported mutations. Example: `mutation call($input: ProductInput!) { productCreate(input: $input) { product { id title } } }`",
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The JSONL file containing the variables for the mutation — provide a file URL (e.g. `https://example.com/mutation-variables.jsonl`) or a path to a file in the `/tmp` directory (e.g. `/tmp/mutation-variables.jsonl`). Each line in the JSONL file represents one input unit. The mutation runs once on each line of the input file. [See the documentation](https://shopify.dev/docs/api/usage/bulk-operations/imports) for more information.",
      format: "file-ref",
    },
    clientIdentifier: {
      type: "string",
      label: "Client Identifier",
      description: "An optional identifier which may be used for querying",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);

    // create staged upload path

    const {
      stagedUploadsCreate: {
        stagedTargets, userErrors: stagedUploadUserErrors,
      },
    }
      = await this.shopify.createStagedUpload({
        input: [
          {
            resource: "BULK_MUTATION_VARIABLES",
            filename: metadata.name,
            mimeType: "text/jsonl",
            httpMethod: "POST",
          },
        ],
      });

    if (stagedUploadUserErrors.length > 0) {
      throw new Error(stagedUploadUserErrors[0].message);
    }
    const [
      stagedTarget,
    ] = stagedTargets;
    if (!stagedTarget) {
      throw new Error("Shopify did not return a staged upload target for the bulk mutation file.");
    }

    const {
      url, parameters,
    } = stagedTarget;

    // upload file to staged upload path

    let stagedUploadPath;
    const form = new FormData();
    parameters.forEach(({
      name, value,
    }) => {
      form.append(name, value);
      if (name === "key") {
        stagedUploadPath = value;
      }
    });
    form.append("file", stream);

    await axios($, {
      url,
      method: "POST",
      headers: form.getHeaders(),
      data: form,
    });

    // perform bulk import

    const response = await this.shopify.runBulkMutation({
      mutation: this.mutation,
      stagedUploadPath,
      clientIdentifier: this.clientIdentifier,
    });

    if (response.bulkOperationRunMutation.userErrors.length > 0) {
      throw new Error(response.bulkOperationRunMutation.userErrors[0].message);
    }

    $.export("$summary", "Successfully completed bulk import");
    return response;
  },
};
