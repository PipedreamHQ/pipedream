import utils from "../../common/utils.mjs";
import app from "../../docmosis.app.mjs";
import { writeFileSync  } from "fs";

export default {
  key: "docmosis-generate-document",
  name: "Generate Document",
  description: "Generates a document by merging data with a Docmosis template. [See the documentation](https://resources.docmosis.com/Documentation/Cloud/DWS4/Cloud-Web-Services-Guide-DWS4.pdf)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    templateName: {
      propDefinition: [
        app,
        "templateName",
      ],
    },
    data: {
      propDefinition: [
        app,
        "data",
      ],
    },
    outputName: {
      propDefinition: [
        app,
        "outputName",
      ],
    },
    outputFormat: {
      propDefinition: [
        app,
        "outputFormat",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    render(args = {}) {
      return this.app.post({
        path: "/render",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      render,
      templateName,
      outputName,
      data,
      outputFormat,
    } = this;
    const downloadedFilepath = `/tmp/${outputName}`;

    const response = await render({
      $,
      responseType: "arraybuffer",
      data: {
        templateName,
        data: utils.parseProp(data),
        outputName,
        outputFormat,
      },
    });

    writeFileSync(downloadedFilepath, response);

    $.export("$summary", `Successfully generated document with name \`${outputName}\``);

    return [
      outputName,
      downloadedFilepath,
    ];
  },
};
