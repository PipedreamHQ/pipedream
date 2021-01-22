const { v4: uuidv4 } = require("uuid");

const textlocal = require("../../textlocal.app");

module.exports = {
  props: {
    db: "$.service.db",
    textlocal,
  },
  methods: {
    generateMeta() {
      throw new Error('generateMeta is not implemented')
    },
    getMaskedName({
      firstName = "",
      lastName = "",
    }) {
      const lastNameInitial = lastName.slice(0, 1).toUpperCase() || "#";
      return `${firstName} ${lastNameInitial}.`;
    },
    getMaskedNumber(number) {
      const numberAsString = Number(number).toString();
      const { length: numberLength } = numberAsString;
      return numberAsString
        .slice(numberLength - 4)
        .padStart(numberLength, "#");
    },
    processEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
  },
  async run(event) {
    await this.processEvent(event);
  },
};
