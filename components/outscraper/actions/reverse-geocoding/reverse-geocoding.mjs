import outscraper from "../../outscraper.app.mjs";

export default {
  key: "outscraper-reverse-geocoding",
  name: "Reverse Geocoding",
  description: "Translates geographic locations into human-readable addresses. [See the documentation](https://app.outscraper.com/api-docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    outscraper,
    location: outscraper.propDefinitions.location,
  },
  async run({ $ }) {
    const response = await this.outscraper.translateLocation({
      location: this.location,
    });
    $.export("$summary", `Successfully translated location ${this.location} into an address`);
    return response;
  },
};
