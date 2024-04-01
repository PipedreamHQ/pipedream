import nyckel from "../../nyckel.app.mjs";

export default {
  key: "nyckel-classify-text",
  name: "Classify Text",
  description: "Classifies text data based on pre-trained classifiers in Nyckel.  [See the documentation](https://www.nyckel.com/docs#invoke-text)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    nyckel,
    functionId: nyckel.propDefinitions.functionId,
    data: nyckel.propDefinitions.data,
    classifications: nyckel.propDefinitions.classifications,
  },
  async run({ $ }) {
    const response = await this.nyckel.classifyTextData({
      functionId: this.functionId,
      data: this.data,
      classifications: this.classifications,
    });

    $.export("$summary", "Successfully classified text data");
    return response;
  },
};
