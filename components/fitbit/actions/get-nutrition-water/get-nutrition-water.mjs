import fitbit from "../../fitbit.app.mjs";

export default {
  key: "fitbit-get-nutrition-water",
  name: "Get Nutrition and Water Logs",
  description: "Get nutrition and water logs for a date, including food entries, meals, water intake, and daily summaries. [See the Fitbit Web API documentation](https://dev.fitbit.com/build/reference/web-api/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    fitbit,
    date: {
      type: "string",
      label: "Date",
      description: "Date in `YYYY-MM-DD` format. Defaults to today.",
      optional: true,
    },
  },
  async run({ $ }) {
    const date = this.fitbit._getDateOrToday(this.date);
    const [
      nutritionResponse,
      waterResponse,
    ] = await Promise.all([
      this.fitbit.getNutritionLogs({
        $,
        date,
      }),
      this.fitbit.getWaterLogs({
        $,
        date,
      }),
    ]);

    $.export("$summary", `Successfully retrieved Fitbit nutrition and water logs for ${date}.`);
    return {
      date,
      nutrition: {
        summary: nutritionResponse?.summary ?? null,
        goals: nutritionResponse?.goals ?? null,
        foods: nutritionResponse?.foods ?? [],
        meals: nutritionResponse?.meals ?? [],
      },
      water: {
        summary: waterResponse?.summary ?? null,
        goal: waterResponse?.goal ?? null,
        entries: waterResponse?.water ?? [],
      },
      raw: {
        nutrition: nutritionResponse,
        water: waterResponse,
      },
    };
  },
};
