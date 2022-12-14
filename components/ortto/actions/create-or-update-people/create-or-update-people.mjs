import app from "../../ortto.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "ortto-create-or-update-people",
  name: "Create or Update people",
  description: "Creates or updates one or more person records in Ortto’s customer data platform (CDP). [See the docs](https://help.ortto.com/developer/latest/api-reference/person/merge.html).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    people: {
      type: "string[]",
      label: "List of People",
      description: "Array of objects, where each object contains data associated with a person being created or updated in your Ortto account’s CDP. Each of these objects can contain: `fields` and `location` objects. `tags` and `unset_tags` array of strings. E.g `{ \"fields\": { \"str::first\": \"Chris\", \"str::last\": \"Smith\", \"str::email\": \"chris.smith@example.com\", \"str:cm:job-title\": \"Technician\" }, \"location\": { \"source_ip\": \"119.18.0.218\" } }`",
    },
  },
  methods: {
    getSummary(people = []) {
      const {
        created,
        merged,
      } =
        people.reduce((reduction, { status }) => {
          if (status === constants.STATUS.INVALID) {
            return reduction;
          }
          const {
            created, merged,
          } = reduction;

          const isCreated = status === constants.STATUS.CREATED;
          return {
            created: isCreated
              ? created + 1
              : created,
            merged: isCreated
              ? merged
              : merged + 1,
          };
        }, {
          created: 0,
          merged: 0,
        });

      const createdStr = utils.summaryEnd(created, "person", "people");
      const mergedStr = utils.summaryEnd(merged, "person", "people");

      return `Successfully created ${createdStr} and merged ${mergedStr}`;
    },
  },
  async run({ $: step }) {
    const response = await this.app.mergePeople({
      step,
      data: {
        people: utils.getProperties(this.people),
      },
    });

    step.export("$summary", this.getSummary(response.people));

    return response;
  },
};
