import optimoroute from "../../optimoroute.app.mjs";

export default {
  key: "optimoroute-start-planning",
  name: "Start Planning",
  description: "Start planning for a given order. [See the documentation](https://optimoroute.com/api/#start-planning)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    optimoroute,
    date: {
      type: "string",
      label: "Date",
      description: "Date to be planned. YYYY-MM-DD format, for example `2013-12-20`",
    },
    orderNumbers: {
      type: "string[]",
      label: "Order Numbers",
      description: "Subset of orders on the planned date that should be included in the optimization",
      optional: true,
    },
    driverSerialNumbers: {
      type: "string[]",
      label: "Driver Serial Numbers",
      description: "Selected drivers that should be used in the optimization. By default (if useDrivers is not set or the list is empty) all available drivers for the specified date are used",
      optional: true,
    },
    balancing: {
      type: "string",
      label: "Balancing",
      description: "Route balancing settings",
      options: [
        {
          value: "OFF",
          label: "No balancing",
        },
        {
          value: "ON",
          label: "Balance routes",
        },
        {
          value: "ON_FORCE",
          label: "Balance routes and use all drivers",
        },
      ],
      optional: true,
    },
    balanceBy: {
      type: "string",
      label: "Balance By",
      description: "Balance routes by",
      options: [
        {
          value: "WT",
          label: "Working time",
        },
        {
          value: "NUM",
          label: "Number of orders per driver",
        },
      ],
      optional: true,
    },
    balancingFactor: {
      type: "string",
      label: "Balancing Factor",
      description: "Importance of balancing compared to route costs. Min: 0.0, Max: 1.0. Increasing the balancing factor will result in more balanced routes. Only applicable in combination with ON_FORCE (otherwise ignored).",
      optional: true,
    },
    startsWith: {
      type: "string",
      label: "Starts With",
      description: "Start planning from existing routes or from scratch",
      options: [
        {
          value: "EMPTY",
          label: "Ignore existing routes and start from scratch",
        },
        {
          value: "CURRENT",
          label: "Start planning with the existing routes",
        },
      ],
      optional: true,
    },
    lockType: {
      type: "string",
      label: "Lock Type",
      description: "Lock type. Applicable if startWith is set to CURRENT",
      options: [
        {
          value: "NONE",
          label: "Allow all changes to the existing routes",
        },
        {
          value: "ROUTES",
          label: "Keep planned Routes unchanged and add new Orders to unused",
        },
        {
          value: "RESOURCES",
          label: "Keep Drivers/Vehicles for planned Orders and fit in new Orders",
        },
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.optimoroute.startPlanning({
      $,
      data: {
        date: this.date,
        balancing: this.balancing,
        balanceBy: this.balanceBy,
        balancingFactor: this.balancingFactor,
        startsWith: this.startsWith,
        lockType: this.lockType,
        useDrivers: this.driverSerialNumbers
          ? this.driverSerialNumbers.map((serialNumber) => ({
            driverSerial: serialNumber,
          }))
          : undefined,
        useOrderObjects: this.orderNumbers
          ? this.orderIds.map((id) => ({
            orderNo: id,
          }))
          : undefined,
      },
    });
    $.export("$summary", `Successfully created planning ID: ${response.planningId}`);
    return response;
  },
};
