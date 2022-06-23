import pcloud from "../../pcloud.app.mjs";

export default {
  props: {
    pcloud,
  },
  methods: {
    validateLocationId() {
      const VALID_LOCATIONS = [
        "0",
        "1",
      ];
      const locationId = this.pcloud.$auth.locationid;

      if (!VALID_LOCATIONS.includes(locationId)) {
        return "Unable to retrieve your account's Location ID - try reconnecting your pCloud account to Pipedream";
      }

      return true;
    },
    async validateInputs() {
      return true;
    },
  },
  async run({ $ }) {
    const validations = [
      this.validateLocationId(),
      await this.validateInputs(),
    ];

    const errors = validations.filter((result) => result !== true);
    if (errors.length) {
      throw new Error(errors.join("; "));
    }

    const requestMethod = this.requestMethod;
    const response = await this.pcloud._withRetries(() => requestMethod());

    $.export("$summary", this.getSummary());

    return response;
  },
};
