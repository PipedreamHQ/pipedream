import gagelist from "../../gagelist.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "gagelist-update-gage",
  name: "Update Gage",
  description: "Updates a specific gage using its ID on GageList. [See the documentation](https://gagelist.com/developer-resources/update-gage-record/)",
  version: "0.0.1",
  type: "action",
  props: {
    gagelist,
    gageId: {
      propDefinition: [
        gagelist,
        "gageId",
      ],
    },
    status: {
      propDefinition: [
        gagelist,
        "status",
      ],
      optional: true,
    },
    manufacturer: {
      propDefinition: [
        gagelist,
        "manufacturer",
      ],
    },
    lastCalibrationDate: {
      propDefinition: [
        gagelist,
        "lastCalibrationDate",
      ],
    },
    calibrationDueDate: {
      propDefinition: [
        gagelist,
        "calibrationDueDate",
      ],
    },
    controlNumber: {
      propDefinition: [
        gagelist,
        "controlNumber",
      ],
    },
    type: {
      propDefinition: [
        gagelist,
        "type",
      ],
    },
    model: {
      propDefinition: [
        gagelist,
        "model",
      ],
    },
    condition: {
      propDefinition: [
        gagelist,
        "condition",
      ],
    },
    instructions: {
      propDefinition: [
        gagelist,
        "instructions",
      ],
    },
  },
  async run({ $ }) {
    const {
      gagelist,
      gageId,
      ...fields
    } = this;

    if (!Object.keys(fields).length) {
      throw new ConfigurationError("Must update at least one field");
    }

    const response = await gagelist.updateGage({
      $,
      data: {
        Id: gageId,
        Status: this.status,
        Manufacturer: this.manufacturer,
        LastCalibrationDate: this.lastCalibrationDate,
        CalibrationDueDate: this.calibrationDueDate,
        ControlNumber: this.controlNumber,
        Type: this.type,
        Model: this.model,
        ConditionAquired: this.condition,
        CalibrationInstructions: this.instructions,
      },
    });
    $.export("$summary", `Successfully updated gage with ID: ${gageId}`);
    return response;
  },
};
