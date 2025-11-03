import dataAxlePlatform from "../../app/data_axle_platform.app";
import { PEOPLE_PACKAGES } from "../../common/constants";

export default {
  key: "data_axle_platform-get-person-by-id",
  name: "Get Person",
  description: "Retrieve a specific person by id. [See the docs here](https://platform.data-axle.com/people/docs/search_api#ids-query)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dataAxlePlatform,
    personId: {
      propDefinition: [
        dataAxlePlatform,
        "personId",
      ],
    },
    packages: {
      propDefinition: [
        dataAxlePlatform,
        "packages",
      ],
      default: "standard_v3",
      options: PEOPLE_PACKAGES,
    },
  },
  async run({ $ }) {
    const {
      dataAxlePlatform,
      personId,
      packages,
    } = this;

    const response = await dataAxlePlatform.getPersonById({
      $,
      personId,
      params: {
        packages,
      },
    });

    $.export("$summary", `Person with Id: ${personId} was successfully fetched!`);
    return response;
  },
};
