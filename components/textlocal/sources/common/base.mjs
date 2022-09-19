import textlocal from "../../textlocal.app.mjs";

export default {
  props: {
    textlocal,
    db: "$.service.db",
  },
  methods: {
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    /**
     * Given a person's name, return a masked version of it. The purpose of a
     * masked name is to hide personal information so that it is not exposed to
     * an unintended audience.
     *
     * Examples:
     *
     * - Input: John Doe (first name "John", last name "Doe")
     * - Output: John D.
     *
     * - Input: Jane (first name "Jane", last name not provided)
     * - Output: Jane #.
     *
     * @param {object}  nameProps Object containing the name to be masked
     * @param {string}  nameProps.firstName The first name
     * @param {string}  nameProps.lastName The last name
     * @return {string} The masked full name
     */
    getMaskedName({
      firstName = "",
      lastName = "",
    }) {
      const lastNameInitial = lastName.slice(0, 1).toUpperCase() || "#";
      return `${firstName} ${lastNameInitial}.`;
    },
    /**
     * Given a phone number, return a masked version of it. The purpose of a
     * masked number is to avoid exposing it to an unintended audience.
     *
     * Example:
     *
     * - Input: 6505551234
     * - Output: ######1234
     *
     * @param {number}  number The phone number to mask
     * @return {string} The masked phone number
     */
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
