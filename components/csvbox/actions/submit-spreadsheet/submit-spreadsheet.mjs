import FormData from "form-data";
import { getFileStream } from "@pipedream/platform";
import app from "../../csvbox.app.mjs";

export default {
  key: "csvbox-submit-spreadsheet",
  name: "Submit Spreadsheet",
  description: "Submit a spreadsheet file via public URL or local file path to CSVBox for processing. [See documentation](https://help.csvbox.io/advanced-installation/rest-file-api)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    file: {
      type: "string",
      label: "File Path Or URL",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/spreadsheet.csv`).",
    },
    sheetLicenseKey: {
      propDefinition: [
        app,
        "sheetLicenseKey",
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    hasHeaders: {
      propDefinition: [
        app,
        "hasHeaders",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  methods: {
    booleanToNumber(value) {
      return value === true || value === "true" || value === "1" || value === 1
        ? 1
        : 0;
    },
  },
  async run({ $ }) {
    const {
      app,
      booleanToNumber,
      file,
      sheetLicenseKey,
      userId,
      hasHeaders,
    } = this;
    let data;

    const isUrl = file?.startsWith("http://") || file?.startsWith("https://");

    const otherFields = {
      ...(userId
        ? {
          user: {
            user_id: userId,
          },
        }
        : {}
      ),
      ...(hasHeaders
        ? {
          options: {
            has_header: booleanToNumber(hasHeaders),
          },
        }
        : {}
      ),
    };

    if (isUrl) {
      data = {
        import: {
          public_file_url: file,
          sheet_license_key: sheetLicenseKey,
          ...otherFields,
        },
      };

    } else {
      data = new FormData();
      data.append("file", await getFileStream(file));
      data.append("import", JSON.stringify({
        sheet_license_key: sheetLicenseKey,
        ...otherFields,
      }));
    }

    const response = await app.submitFile({
      $,
      headers: !isUrl
        ? {
          "Content-Type": "multipart/form-data",
        }
        : undefined,
      data,
    });

    $.export("$summary", "Successfully submitted spreadsheet");

    return response;
  },
};
