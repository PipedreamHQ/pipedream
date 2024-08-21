import fs from "fs";
import app from "../../llmwhisperer.app.mjs";

export default {
  key: "llmwhisperer-extract-text",
  name: "Extract Text",
  description: "Convert your PDF/scanned documents to text format which can be used by LLMs. [See the documentation](https://docs.unstract.com/llm_whisperer/apis/llm_whisperer_text_extraction_api)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    processingMode: {
      type: "string",
      label: "Processing Mode",
      description: "The processing mode to be used. Choose between `ocr` and `text`.",
      options: [
        "ocr",
        "text",
      ],
    },
    outputMode: {
      type: "string",
      label: "Output Mode",
      description: "The output mode to be used. Choose between `line-printer` and `text`.",
      options: [
        "line-printer",
        "text",
      ],
    },
    pageSeperator: {
      type: "string",
      label: "Page Seperator",
      description: "The string to be used as a page separator. Eg: `<<<`",
      optional: true,
    },
    forceTextProcessing: {
      type: "boolean",
      label: "Force Text Processing",
      description: "If set to true, the document will be processed as text only. If set to false, the document will be processed based on LLMWhisperer's chosed stratergy.",
      optional: true,
    },
    pagesToExtract: {
      type: "string",
      label: "Pages To Extract",
      description: "Define which pages to extract. By default all pages are extracted. You can specify which pages to extract with this parameter. Example `1-5,7,21-` will extract pages **1,2,3,4,5,7,21,22,23,24...** till the last page.",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "The time in seconds after which the request will automatically switch to async mode. If a timeout occurs then the API will return a 202 message along with `whisper-hash` which can be used later to check processing status and retrieve the text. Refer to the async operation documentation for more information",
      optional: true,
    },
    storeMetadataForHighlighting: {
      type: "boolean",
      label: "Store Metadata for Highlighting",
      description: "If set to true, metadata required for the highlighting is stored. If you do not require highlighting API, set this to false. Note that setting this to true will store your text in our servers",
      optional: true,
    },
    medianFilterSize: {
      type: "integer",
      label: "Median Filter Size",
      description: "The size of the median filter to be applied to the image. This is used to remove noise from the image. This parameter works only in on-prem version of LLMWhisperer.",
      optional: true,
    },
    gaussianBlurRadius: {
      type: "integer",
      label: "Gaussian Blur Radius",
      description: "The radius of the gaussian blur to be applied to the image. This is used to remove noise from the image. This parameter works only in on-prem version of LLMWhisperer.",
      optional: true,
    },
    ocrProvider: {
      type: "string",
      label: "OCR Provider",
      description: "The OCR provider to be used. Choose between `simple` and `advanced`. This parameter works only in on-prem version of LLMWhisperer.",
      optional: true,
      options: [
        "simple",
        "advanced",
      ],
    },
    lineSplitterTolerance: {
      type: "string",
      label: "Line Splitter Tolerance",
      description: "Factor to decide when to move text to the next line when it is above or below the baseline. The default value of `0.4` signifies 40% of the average character height.",
      optional: true,
    },
    horizontalStretchFactor: {
      type: "string",
      label: "Horizontal Stretch Factor",
      description: "Factor by which a horizontal stretch has to applied. It defaults to `1.0`. A stretch factor of `1.1` would mean at 10% stretch factor applied. Normally this factor need not be adjusted. You might want to use this parameter when multi column layouts back into each other. For example in a two column layout, the two columns get merged into one.",
      optional: true,
    },
    urlInPost: {
      type: "boolean",
      label: "URL In Post",
      description: "If set to `true`, the headers will be set to `text/plain`. If set to `false`, the headers will be set to `application/octet-stream`.",
      reloadProps: true,
      default: true,
    },
  },
  additionalProps() {
    const { urlInPost } = this;
    return {
      data: {
        type: "string",
        label: urlInPost
          ? "Document URL"
          : "Document Path",
        description: urlInPost
          ? "The URL of the document to process."
          : "Document path of the file previously downloaded in Pipedream E.g. (`/tmp/my-file.txt`). [Download a file to the `/tmp` directory](https://pipedream.com/docs/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory)",
      },
    };
  },
  methods: {
    getHeaders(urlInPost) {
      return {
        "Content-Type": urlInPost
          ? "text/plain"
          : "application/octet-stream",
      };
    },
    getData(urlInPost, data) {
      return urlInPost
        ? data
        : fs.readFileSync(data);
    },
    extractText(args = {}) {
      return this.app.post({
        path: "/whisper",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      extractText,
      getHeaders,
      getData,
      urlInPost,
      processingMode,
      outputMode,
      pageSeperator,
      forceTextProcessing,
      pagesToExtract,
      timeout,
      storeMetadataForHighlighting,
      medianFilterSize,
      gaussianBlurRadius,
      ocrProvider,
      lineSplitterTolerance,
      horizontalStretchFactor,
      data,
    } = this;

    const response = await extractText({
      $,
      headers: getHeaders(urlInPost),
      params: {
        url_in_post: urlInPost,
        processing_mode: processingMode,
        output_mode: outputMode,
        page_seperator: pageSeperator,
        force_text_processing: forceTextProcessing,
        pages_to_extract: pagesToExtract,
        timeout,
        store_metadata_for_highlighting: storeMetadataForHighlighting,
        median_filter_size: medianFilterSize,
        gaussian_blur_radius: gaussianBlurRadius,
        ocr_provider: ocrProvider,
        line_splitter_tolerance: lineSplitterTolerance,
        horizontal_stretch_factor: horizontalStretchFactor,
      },
      data: getData(urlInPost, data),
    });

    $.export("$summary", "Successfully extracted text from document.");
    return response;
  },
};
