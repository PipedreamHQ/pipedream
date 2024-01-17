import waiverfile from "../../waiverfile.app.mjs";

export default {
  key: "waiverfile-search-waivers",
  name: "Search Waivers",
  description: "Searches for waivers in WaiverFile based on specific criteria",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    waiverfile,
    startdate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the event (for searching waivers)",
    },
    enddate: {
      type: "string",
      label: "End Date",
      description: "The end date of the event (for searching waivers)",
    },
    fullname: {
      type: "string",
      label: "Full Name",
      description: "The full name of the person (for searching waivers)",
      optional: true,
    },
    eventtitle: {
      type: "string",
      label: "Event Title",
      description: "The title of the event (for searching waivers)",
      optional: true,
    },
    categoryname: {
      type: "string",
      label: "Category Name",
      description: "The name of the event category",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.waiverfile.searchWaivers({
      startdate: this.startdate,
      enddate: this.enddate,
      fullname: this.fullname,
      eventtitle: this.eventtitle,
      categoryname: this.categoryname,
    });
    $.export("$summary", "Successfully searched waivers");
    return response;
  },
};
