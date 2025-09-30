import spoonacular from "../../spoonacular.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Meal Plan",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "spoonacular-create-meal-plan",
  description: "Creates a meal plan. [See docs here](https://spoonacular.com/food-api/docs#Generate-Meal-Plan)",
  type: "action",
  props: {
    spoonacular,
    numberOfMeals: {
      type: "integer",
      label: "Number of Meals",
      description: "The number of meals to generate in the meal plan",
    },
    targetCalories: {
      type: "integer",
      label: "Target Calories",
      description: "The target calories for the meal plan",
    },
    diet: {
      type: "string",
      label: "Diet",
      description: "The diet to follow for the meal plan. e.g vegetarian",
      optional: true,
    },
    exclude: {
      type: "string",
      label: "Exclude",
      description: "A comma-separated list of ingredients to exclude from the meal plan. e.g shellfish, olives",
      optional: true,
    },
    timeFrame: {
      type: "string",
      label: "Time Frame",
      description: "Either for one `day` or an entire `week`",
      optional: true,
      options: constants.MEAT_PLAN_TIME_FRAMES,
      default: constants.MEAT_PLAN_TIME_FRAMES[0],
    },
  },
  async run({ $ }) {
    const response = await this.spoonacular.createMealPlan({
      $,
      params: {
        timeFrame: this.timeFrame,
        targetCalories: this.targetCalories,
        diet: this.diet,
        exclude: this.exclude,
        numMeals: this.numberOfMeals,
      },
    });

    if (response) {
      $.export("$summary", "Successfully created meat plan");
    }

    return response;
  },
};
