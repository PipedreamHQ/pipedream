import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import app from "../../openum.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "openum-start-signature",
  name: "Start Signature",
  description: "Initiates an electronic document delivery process to recipient(s). [See the documentation](https://api.lleida.net/dtd/openum/v1/en/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    requestId: {
      type: "string",
      label: "Request ID",
      description: "Optional reference of the request.",
      optional: true,
    },
    configId: {
      propDefinition: [
        app,
        "configId",
      ],
    },
    contractId: {
      type: "string",
      label: "Contract ID",
      description: "Client reference of the process. This reference is provided as the unique identifier for the process. If `auto_cancel` is enabled in the configuration and an existing reference is specified, the previous pending process will be automatically canceled.",
    },
    levels: {
      type: "string",
      label: "Levels",
      description: `Definition of the viewing level/order as a JSON array. Each level object supports: \`level_order\` (integer, 0 to N), \`required_signatories_to_complete_level\` (optional integer), and \`signatories\` (array of recipient objects with fields: \`phone\`, \`email\`, \`name\`, \`surname\`, \`id_number\`, \`landing_access_methods\`, \`landing_access_code\`, \`landing_information\`). The maximum is 20 recipients across all levels.

**Example**:
\`\`\`json
[
  {
    "level_order": 0,
    "signatories": [{
      "email": "user@example.com",
      "name": "John",
      "surname": "Doe",
      "phone": "+34666666666"
    }]
  }
]
\`\`\`
`,
    },
    filePaths: {
      type: "string[]",
      label: "Files",
      description: "PDF files to deliver to the recipients. Provide paths to files in the `/tmp` directory (e.g. `/tmp/contract.pdf`) or direct URLs to PDF files. Only PDF format is accepted. Maximum 20 files, 25 MB total.",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      requestId,
      configId,
      contractId,
      levels,
      filePaths,
    } = this;

    const parsedLevels = utils.parseJson(levels);

    const invalidFiles = filePaths.filter((filePath) => !utils.isPdf(filePath));
    if (invalidFiles.length) {
      throw new ConfigurationError(`Only PDF files are allowed. Invalid files: ${invalidFiles.join(", ")}`);
    }

    const files = await Promise.all(
      filePaths.map(async (filePath) => {
        const {
          stream, metadata,
        } = await getFileStreamAndMetadata(filePath);
        const content = await utils.streamToBase64Url(stream);
        return {
          filename: metadata.name,
          content,
          sign_on_landing: "Y",
        };
      }),
    );

    const response = await app.startSignature({
      $,
      data: {
        request: "START_SIGNATURE",
        ...(requestId && {
          request_id: requestId,
        }),
        user: app.getUsername(),
        signature: {
          config_id: configId,
          contract_id: contractId,
          level: parsedLevels,
          file: files,
        },
      },
    });

    $.export("$summary", `Successfully started signature process with ID \`${response.signature?.signature_id}\``);
    return response;
  },
};
