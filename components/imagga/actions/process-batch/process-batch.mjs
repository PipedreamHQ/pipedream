import { prepareAdditionalProps } from "../../common/constants.mjs";
import {
  delay,
  prepareBatchFile,
} from "../../common/utils.mjs";
import imagga from "../../imagga.app.mjs";

export default {
  key: "imagga-process-batch",
  name: "Process Batch of Images",
  description: "Analyzes a batch of images for categorization, tagging, or color extraction. [See the documentation](https://docs.imagga.com/)",
  version: "0.0.1",
  type: "action",
  props: {
    imagga,
    imageUrl: {
      label: "Image URLs",
      description: "The array of Image URLs to analyze.",
      type: "string[]",
      optional: true,
    },
    imageFile: {
      label: "Image File Paths",
      description:
        "The array of Image file path from [`/tmp` dir](https://pipedream.com/docs/code/nodejs/working-with-files/#the-tmp-directory) to analyze.",
      type: "string[]",
      optional: true,
    },
    callbackUrl: {
      propDefinition: [
        imagga,
        "callbackUrl",
      ],
      optional: true,
    },
    imageProcessType: {
      propDefinition: [
        imagga,
        "imageProcessType",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    return prepareAdditionalProps({
      props: imagga.propDefinitions,
      type: this.imageProcessType,
      batch: true,
    });
  },
  async run({ $ }) {
    const {
      imagga,
      imageUrl,
      imageFile,
      language = [],
      saveIndex,
      saveId,
      extractOverallColors,
      extractObjectColors,
      deterministic,
      verbose,
      threshold,
      decreaseParents,
      callbackUrl,
      categorizerId,
      overallCount,
      separatedCount,
      imageProcessType,
      ...params
    } = this;

    const file = await prepareBatchFile({
      imageUrl,
      imageFile,
      imagga,
    });

    await delay(2000);

    const response = await this.imagga.analyzeBatch({
      data: {
        callback_url: callbackUrl,
        [`/${imageProcessType}`]: file.map((item) => {
          if (typeof verbose === "boolean") item.params.verbose = +verbose;
          if (typeof decreaseParents === "boolean") item.params["decrease_parents"] = +decreaseParents;
          if (threshold) item.params.threshold = parseFloat(threshold);
          if (typeof extractOverallColors === "boolean") item.params.extract_overall_colors = +extractOverallColors;
          if (typeof extractObjectColors === "boolean") item.params.extract_object_colors = +extractObjectColors;
          if (typeof deterministic === "boolean") item.params.deterministic = +deterministic;

          item.params = {
            ...params,
            ...item.params,
            categorizer_id: categorizerId,
            language: language.toString(),
            overall_count: overallCount,
            separated_count: separatedCount,
            save_index: saveIndex,
            save_id: saveId,
          };
          return item;
        }),
      },
    });
    $.export("$summary", `Successfully submitted batch for ${imageProcessType} analysis`);
    return response;
  },
};
