import shopify from "../../shopify.app.mjs";
import { axios } from "@pipedream/platform";
import fs from "fs";
import FormData from "form-data";

export default {
  key: "shopify-bulk-import",
  name: "Bulk Import",
  description: "Execute bulk mutations by uploading a JSONL file containing mutation variables. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/bulkoperationrunmutation)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
      label: "File Path",
      description: "File path in the `/tmp` directory of a JSONL file including the variables for the mutation. Each line in the JSONL file represents one input unit. The mutation runs once on each line of the input file. [See the documentation](https://shopify.dev/docs/api/usage/bulk-operations/imports) for more information.",
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
  methods: {
    stagedUploadQuery() {
      return `
        mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
          stagedUploadsCreate(input: $input) {
            stagedTargets {
              url
              resourceUrl
              parameters {
                name
                value
              }
            }
          }
        }
      `;
    },
    bulkImportMutation() {
      return `
        mutation bulkOperationRunMutation($clientIdentifier: String, $mutation: String!, $stagedUploadPath: String!) {
          bulkOperationRunMutation(clientIdentifier: $clientIdentifier, mutation: $mutation, stagedUploadPath: $stagedUploadPath) {
            bulkOperation {
              id
              completedAt
              createdAt
              fileSize
              objectCount
              rootObjectCount
              partialDataUrl
              query
              status
              url
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
    },
  },
  async run({ $ }) {
    const filePath = this.filePath.includes("/tmp")
      ? this.filePath
      : `/tmp/${this.filePath}`;
    const filename = filePath.split("/").pop();

    // create staged upload path

    const { stagedUploadsCreate: { stagedTargets } }
      = await this.shopify._makeGraphQlRequest(this.stagedUploadQuery(), {
        input: [
          {
            resource: "BULK_MUTATION_VARIABLES",
            filename,
            mimeType: "text/jsonl",
            httpMethod: "POST",
          },
        ],
      });

    const {
      url, parameters,
    } = stagedTargets[0];

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
    form.append("file", fs.createReadStream(filePath));

    await axios($, {
      url,
      method: "POST",
      headers: form.getHeaders(),
      data: form,
    });

    // perform bulk import

    const response = await this.shopify._makeGraphQlRequest(this.bulkImportMutation(), {
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
