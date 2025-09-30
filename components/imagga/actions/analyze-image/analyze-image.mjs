import { prepareAdditionalProps } from "../../common/constants.mjs";
import { prepareFile } from "../../common/utils.mjs";
import imagga from "../../imagga.app.mjs";

export default {
  key: "imagga-analyze-image",
  name: "Analyze Image",
  description: "Assign a category to a single image based on its visual content. [See the documentation](https://docs.imagga.com/?shell#categories-categorizer_id)",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    imagga,
    imageFile: {
      propDefinition: [
        imagga,
        "imageFile",
      ],
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
    });
  },
  async run({ $ }) {
    const {
      imagga,
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
      categorizerId,
      overallCount,
      separatedCount,
      imageProcessType,
      taggerId,
      ...params
    } = this;

    const file = await prepareFile({
      imageFile,
      imagga,
    });

    if (typeof extractOverallColors === "boolean") params.extract_overall_colors = +extractOverallColors;
    if (typeof extractObjectColors === "boolean") params.extract_object_colors = +extractObjectColors;
    if (typeof deterministic === "boolean") params.deterministic = +deterministic;
    if (typeof verbose === "boolean") params.verbose = +verbose;
    if (typeof decreaseParents === "boolean") params["decrease_parents"] = +decreaseParents;
    if (threshold) params.threshold = parseFloat(threshold);

    const response = await imagga.analyzeImage({
      $,
      taggerId,
      imageProcessType,
      categorizerId,
      params: {
        ...params,
        ...file,
        overall_count: overallCount,
        separated_count: separatedCount,
        language: language.toString(),
        save_index: saveIndex,
        save_id: saveId,
      },
    });

    $.export("$summary", "Image successfully assigned!");
    return response;
  },
};
