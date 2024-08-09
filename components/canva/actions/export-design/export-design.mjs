import canva from "../../canva.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "canva-export-design",
  name: "Export Design",
  description: "Starts a new job to export a file from Canva. [See the documentation](https://www.canva.dev/docs/connect/api-reference/exports/create-design-export-job/)",
  version: "0.0.5",
  type: "action",
  props: {
    canva,
    designId: {
      propDefinition: [
        canva,
        "designId",
      ],
    },
    type: {
      type: "string",
      label: "Format Type",
      description: "The desired export format",
      reloadProps: true,
      options: constants.EXPORT_TYPES,
    },
    pages: {
      type: "integer[]",
      label: "Pages",
      description: "To specify which pages to export in a multi-page design, provide the page numbers as an array. The first page in a design is page `1`. If pages isn't specified, all the pages are exported.",
      optional: true,
    },
    waitForCompletion: {
      propDefinition: [
        canva,
        "waitForCompletion",
      ],
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.type) {
      return props;
    }
    if (this.type === "jpg") {
      props.quality = {
        type: "integer",
        label: "Quality",
        description: "Determines how compressed the exported file should be. A low `quality` value (minimum `1`) will create a file with a smaller file size, but the resulting file will have pixelated artifacts when compared to a file created with a high `quality` value (maximum `100`).",
      };
    }
    if (this.type === "mp4") {
      props.quality = {
        type: "string",
        label: "Quality",
        description: "The orientation and resolution of the exported video",
        options: constants.MP4_QUALITY,
      };
    }
    if (this.type === "pdf") {
      props.size = {
        type: "string",
        label: "Paper Size",
        description: "The paper size of the export PDF file",
        options: constants.PAPER_SIZE,
        optional: true,
      };
    }
    if (this.type === "png") {
      props.lossless = {
        type: "boolean",
        label: "Lossless",
        description: "When `true`, the PNG is compressed with a lossless compression algorithm (`false` by default)",
        optional: true,
      };
      props.asSingleImage = {
        type: "boolean",
        label: "As Single Image",
        description: "When `true`, multi-page designs are merged into a single image. When `false` (default), each page is exported as a separate image",
        optional: true,
      };
    }
    if (this.type === "pdf" || this.type === "jpg" || this.type === "png" || this.type === "gif" || this.type === "mp4") {
      props.exportQuality = {
        type: "string",
        label: "Export Quality",
        description: "Specifies the export quality of the design. A `pro` export might fail if the design contains premium elements and the calling user either hasn't purchased the elements or isn't on a Canva plan (such as Canva Pro) that has premium features.",
        options: constants.EXPORT_QUALITY,
        optional: true,
      };
      if (this.type === "jpg" || this.type === "png" || this.type === "gif") {
        props.height = {
          type: "integer",
          label: "Height",
          description: "The height in pixels of the exported image",
          optional: true,
        };
        props.width = {
          type: "integer",
          label: "Width",
          description: "The width in pixels of the exported image",
          optional: true,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    let response = await this.canva.exportDesign({
      $,
      data: {
        design_id: this.designId,
        format: {
          type: this.type,
          pages: this.pages,
          quality: this.quality,
          export_quality: this.exportQuality,
          size: this.size,
          height: this.height,
          width: this.width,
          lossless: this.lossless,
          as_single_image: this.asSingleImage,
        },
      },
    });

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      const exportId = response.job.id;
      while (response.job.status === "in_progress") {
        response = await this.canva.getDesignExportJob({
          $,
          exportId,
        });
        if (response.job.error) {
          throw new Error(response.job.error.message);
        }
        await timer(3000);
      }
    }

    $.export("$summary", `Successfully ${this.waitForCompletion
      ? "exported"
      : "started export job for"} design with ID "${this.designId}"`);
    return response;
  },
};
