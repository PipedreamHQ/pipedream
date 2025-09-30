import waiverfile from "../../waiverfile.app.mjs";

export default {
  key: "waiverfile-search-waivers",
  name: "Search Waivers",
  description: "Searches for waivers in WaiverFile based on specific keywords. [See the documentation](https://api.waiverfile.com/swagger/ui/index#!/WaiverFile/WaiverFile_SearchWaivers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    waiverfile,
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "Text used to search for waivers",
    },
  },
  async run({ $ }) {
    const response = await this.waiverfile.searchWaivers({
      $,
      params: {
        terms: this.searchTerm,
      },
    });

    const waivers = response.ArrayOfWaiver.Waiver;
    const total = !waivers
      ? 0
      : !waivers.length
        ? 1
        : waivers.length;

    $.export("$summary", `Found ${total} waiver${total === 1
      ? ""
      : "s"}`);
    return response;
  },
};
