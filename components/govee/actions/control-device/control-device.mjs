import { v4 as uuid } from "uuid";
import app from "../../govee.app.mjs";

export default {
  key: "govee-control-device",
  name: "Control Device",
  description: "Send a command to control a Govee device, such as turning it on/off, changing its brightness, or adjusting its color. [See the documentation](https://developer.govee.com/reference/control-you-devices).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    deviceId: {
      propDefinition: [
        app,
        "deviceId",
      ],
    },
    commandType: {
      reloadProps: true,
      propDefinition: [
        app,
        "commandType",
        ({ deviceId }) => ({
          deviceId,
        }),
      ],
    },
  },
  async additionalProps() {
    const {
      deviceId,
      commandType,
    } = this;

    const { data: devices } = await this.app.listDevices();
    const device = devices.find(({ device }) => device === deviceId);
    const capability = device?.capabilities?.find(({ type }) => type === commandType);
    const { parameters } = capability ?? {};

    if (parameters.dataType === "ENUM") {
      return {
        value: {
          type: "string",
          label: "Value",
          description: "The value of the command.",
          options: parameters?.options.map(({
            name: label,
            value,
          }) => ({
            label,
            value: String(value),
          })),
        },
      };
    }

    if (parameters.dataType === "INTEGER") {
      return {
        value: {
          type: "integer",
          label: "Value",
          description: `The value of the command. Min value: \`${parameters.range.min}\`, Max value: \`${parameters.range.max}\`.`,
          min: parameters.range.min,
          max: parameters.range.max,
        },
      };
    }

    if (parameters.dataType === "STRUCT") {
      return parameters.fields.reduce((acc, {
        fieldName,
        dataType,
        range,
        required,
        options,
      }) => {
        if (dataType === "INTEGER") {
          acc[fieldName] = {
            type: "integer",
            label: fieldName,
            description: `The value of the ${fieldName} field. Min value: \`${range.min}\`, Max value: \`${range.max}\`.`,
            min: range.min,
            max: range.max,
            optional: !required,
          };
        } else if (dataType === "ENUM") {
          acc[fieldName] = {
            type: "string",
            label: fieldName,
            description: `The value of the ${fieldName} field.`,
            optional: !required,
            options: options.reduce((acc, {
              name: label,
              value,
              defaultValue,
              options: nestedOptions,
            }) => {
              if (nestedOptions) {
                return acc.concat(nestedOptions.map(({
                  name: label,
                  value,
                }) => ({
                  label,
                  value: String(value),
                })));
              }
              return acc.concat({
                label,
                value: value !== undefined && String(value) || String(defaultValue),
              });
            }, []),
          };
        } else if (dataType === "Array") {
          acc[fieldName] = {
            type: "string[]",
            label: fieldName,
            description: `The value of the ${fieldName} field.`,
            optional: !required,
            options: options.map(({ value }) => String(value)),
          };
        } else {
          acc[fieldName] = {
            type: "string",
            label: fieldName,
            description: `The value of the ${fieldName} field.`,
            optional: !required,
          };
        }
        return acc;
      }, {});
    }
  },
  methods: {
    controlDevice(args = {}) {
      return this.app.post({
        path: "/device/control",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      controlDevice,
      deviceId,
      commandType,
      value,
      ...fields
    } = this;

    const { data: devices } = await app.listDevices();
    const device = devices.find(({ device }) => device === deviceId);

    const response = await controlDevice({
      $,
      data: {
        requestId: uuid(),
        payload: {
          sku: device.sku,
          device: deviceId,
          capability: {
            type: commandType,
            parameters: {
              value: value ?? fields,
            },
          },
        },
      },
    });

    $.export("$summary", "Successfully sent command to device.");
    return response;
  },
};
