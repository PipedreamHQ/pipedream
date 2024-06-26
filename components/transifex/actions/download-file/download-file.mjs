import fs from "fs";
import transifex from "../../transifex.app.mjs";

export default {
  key: "transifex-download-file",
  name: "Download File",
  description: "Downloads a user-specified file from the Transifex platform. [See the documentation](https://developers.transifex.com/reference/get_resource-strings-async-downloads-resource-strings-async-download-id)",
  version: "0.0.1",
  type: "action",
  props: {
    transifex,
    asyncDownloadId: {
      propDefinition: [
        transifex,
        "asyncDownloadId",
      ],
    },
  },
  methods: {
    sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    },
  },
  async run({ $ }) {
    const { data: { id: preparedDownloadId } } = await this.transifex.prepareDownload({
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
      data: {
        data: {
          "relationships": {
            "resource": {
              "data": {
                "type": "resources",
                "id": this.asyncDownloadId,
              },
            },
          },
          "type": "resource_strings_async_downloads",
        },
      },
    });

    let response = "";
    do {
      await this.sleep(5000);
      response = await this.transifex.downloadFile({
        $,
        asyncDownloadId: preparedDownloadId,
      });

    } while (response.id && response.id === preparedDownloadId);

    const filePath = `/tmp/downloaded_file_${this.asyncDownloadId}.json`;
    fs.writeFileSync(filePath, JSON.stringify(response));

    $.export("$summary", `Successfully downloaded file with asyncDownloadId: ${this.asyncDownloadId}`);
    return {
      filePath,
    };
  },
};
