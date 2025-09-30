import spoonacular from "../../spoonacular.app.mjs";

export default {
  name: "Search Recipes",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "spoonacular-search-recipes",
  description: "Search for a recipe. [See docs here](https://spoonacular.com/food-api/docs#Search-Recipes-Complex)",
  type: "action",
  props: {
    spoonacular,
    ingredients: {
      type: "string",
      label: "Ingredients",
      description: "A comma-separated list of ingredients to search for recipes. e.g tomato, cheese",
    },
    cuisine: {
      type: "string",
      label: "Cuisine",
      description: "The cuisine of the recipes to search for. e.g italian",
      optional: true,
    },
    otherCriteria: {
      type: "string",
      label: "Other Criteria",
      description: "Any other criteria to filter the recipes",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      ingredients: this.ingredients,
    };

    if (this.cuisine) {
      params.cuisine = this.cuisine;
    }

    if (this.otherCriteria) {
      params.otherCriteria = this.otherCriteria;
    }

    const response = await this.spoonacular.searchRecipes({
      $,
      params,
    });

    if (response) {
      $.export("$summary", "Successfully retrieved recipes");
    }

    return response;
  },
};
