import gagelist from "../../gagelist.app.mjs";

export default {
  key: "gagelist-create-gage",
  name: "Create Gage",
  description: "Creates a new gage on GageList. [See the documentation](https://gagelist.com/developer-resources/add-gage-record/)",
  version: "0.0.1",
  type: "action",
  props: {
    gagelist,
    status: {
      propDefinition: [
        gagelist,
        "status",
      ],
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
    const response = await this.gagelist.createGage({
      $,
      data: {
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
    $.export("$summary", "Gage successfully created");
    return response;
  },
};
