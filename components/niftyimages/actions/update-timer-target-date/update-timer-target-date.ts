import niftyimages from "../../app/niftyimages.app";
import { defineAction } from "@pipedream/types";
import { UpdateTimerTargetDateParams } from "../../common/types";

export default defineAction({
  name: "Update Timer Target Date",
  description:
    "Create or update a Data Store Record [See docs here](https://api.niftyimages.com/)",
  key: "niftyimages-update-timer-target-date",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    niftyimages,
    timerApiKey: {
      label: "Timer API Key",
      description:
        `The API Key for the Timer you want to update.
        \\
        To find this, choose a timer image, click on **More Options**, scroll to **Target Date Automation** and click on **"Show API Key"**.`,
      type: "string",
    },
    timerImageUrl: {
      label: "Timer Image URL",
      description: "URL of the image to update.",
      type: "string",
    },
    targetDate: {
      label: "Target Date",
      description: "Date/Time of the new Target Date for the timer.",
      type: "string",
    },
    format: {
      label: "Date Format",
      description:
        "The format of the `TargetDate` property, if it's not in **ISO 8601** format *(e.g. 2016-03-12T12:00Z)*.",
      type: "string",
      optional: true,
    },
    isUtc: {
      label: "Is UTC",
      description:
        "If TRUE, NiftyImages will adjust the `TargetDate` to the Timezone you setup when creating the timer. If FALSE, the `TargetDate` will not be adjusted.",
      type: "boolean",
      optional: true,
    },
    addHours: {
      label: "Add Hours",
      description: "Number of hours to add to the `TargetDate` parameter.",
      type: "integer",
      optional: true,
    },
    addDays: {
      label: "Add Days",
      description: "Number of days to add to the `TargetDate` parameter.",
      type: "integer",
      optional: true,
    },
    addMonths: {
      label: "Add Months",
      description: "Number of months to add to the `TargetDate` parameter.",
      type: "integer",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const params: UpdateTimerTargetDateParams = {
      $,
      apiKey: this.timerApiKey,
      data: {
        TimerImageUrl: this.timerImageUrl,
        TargetDate: this.targetDate,
        Format: this.format,
        IsUtc: this.isUtc,
        AddHours: this.addHours,
        AddDays: this.addDays,
        AddMonths: this.addMonths,
      },
    };

    const response: object = await this.niftyimages.updateTimerTargetDate(params);

    $.export("$summary", "Updated timer target date successfully");

    return response;
  },
});
