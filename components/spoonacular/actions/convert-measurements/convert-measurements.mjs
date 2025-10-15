import spoonacular from "../../spoonacular.app.mjs";

export default {
  name: "Convert Measurements",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "spoonacular-convert-measurements",
  description: "Converts a measurements. [See docs here](https://spoonacular.com/food-api/docs#Convert-Amounts)",
  type: "action",
  props: {
    spoonacular,
    ingredient: {
      type: "string",
      label: "Ingredient",
      description: "The ingredient to convert measurements for. e.g flour",
    },
    sourceUnit: {
      type: "string",
      label: "Source Unit",
      description: "The source unit of the ingredient measurement. e.g cups",
    },
    targetUnit: {
      type: "string",
      label: "Target Unit",
      description: "The target unit to convert the ingredient measurement to. e.g grams",
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "The amount of the ingredient to convert. e.g 2.5",
    },
  },
  async run({ $ }) {
    const response = await this.spoonacular.convertMeasurements({
      $,
      params: {
        ingredientName: this.ingredient,
        sourceAmount: this.amount,
        sourceUnit: this.sourceUnit,
        targetUnit: this.targetUnit,
      },
    });

    if (response) {
      $.export("$summary", "Successfully converted measurements");
    }

    return response;
  },
};
