import { ConfigurationError } from "@pipedream/platform";

import biligWorkpaper from "../../bilig_workpaper.app.mjs";

export default {
  key: "bilig_workpaper-verify-formula-readback",
  name: "Verify Formula Readback",
  description: "Write a Bilig WorkPaper forecast input cell and return verified recalculated formula output. [See the documentation](https://github.com/proompteng/bilig/tree/main/integrations/pipedream-bilig-workpaper)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    biligWorkpaper,
    sheetName: {
      propDefinition: [
        biligWorkpaper,
        "forecastSheetName",
      ],
    },
    address: {
      propDefinition: [
        biligWorkpaper,
        "forecastCell",
      ],
    },
    value: {
      propDefinition: [
        biligWorkpaper,
        "forecastValue",
      ],
    },
    valueDivisor: {
      propDefinition: [
        biligWorkpaper,
        "forecastValueDivisor",
      ],
    },
  },
  async run({ $ }) {
    const numericValue = Number(this.value) / Number(this.valueDivisor);

    if (!Number.isFinite(numericValue)) {
      throw new ConfigurationError("Value divided by Value Divisor must produce a finite number.");
    }

    const result = await this.biligWorkpaper.verifyForecastReadback({
      $,
      sheetName: this.sheetName,
      address: this.address,
      value: numericValue,
    });

    $.export("$summary", `Verified ${result.editedCell}: expected ARR ${result.before?.expectedArr} -> ${result.after?.expectedArr}`);

    return result;
  },
};
