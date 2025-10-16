import jpFunda from "../../jp_funda.app.mjs";
import { DATE_TYPES } from "../common/constants.mjs";

export default {
  key: "jp_funda-search-listings",
  name: "Search Listings",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve data by specifying the date the securities report was published [See the documentation](https://www.jp-funda.com/docs/#%E6%9C%89%E4%BE%A1%E8%A8%BC%E5%88%B8%E5%A0%B1%E5%91%8A%E6%9B%B8%E3%81%AE%E5%85%AC%E9%96%8B%E6%97%A5%E3%82%88%E3%81%A3%E3%81%A6%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E5%8F%96%E5%BE%97)",
  type: "action",
  props: {
    jpFunda,
    dateType: {
      type: "string",
      label: "Date Period",
      description: "Select a period you want to retrieve.",
      options: DATE_TYPES,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.dateType === "date_range") {
      props.startDate = {
        type: "string",
        label: "Start Date",
        description: "Enter the first date of the period you want to specify the range.",
      };
      props.endDate = {
        type: "string",
        label: "End Date",
        description: "Enter the last date of the period you want to specify.",
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      jpFunda,
      dateType,
      startDate,
      endDate,
    } = this;

    const response = await jpFunda.searchListings({
      $,
      path: dateType,
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });

    const length = response.length;

    $.export("$summary", `${length} listing${length > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return response;
  },
};
