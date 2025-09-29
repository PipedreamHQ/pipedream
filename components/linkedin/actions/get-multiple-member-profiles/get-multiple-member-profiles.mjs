import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-get-multiple-member-profiles",
  name: "Get Multiple Member Profiles",
  description: "Gets multiple member profiles at once. [See the docs here](https://docs.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api#retrieve-other-members-profile)",
  version: "0.1.10",
  type: "action",
  props: {
    linkedin,
    peopleIds: {
      type: "string[]",
      label: "People Ids",
      description: "Identifiers of the members to retrieve",
    },
  },
  async run({ $ }) {
    const peopleIdsArr = this.peopleIds;

    // Generates the ids of the request with this required string format:
    // List((id:{Person ID1}),(id:{Person ID2}),(id:{Person ID3}))
    let peopleIdsList = "List(";
    peopleIdsArr.forEach((personId) =>  {
      peopleIdsList = peopleIdsList.length > 5
        ? peopleIdsList + `,(id:${personId})`
        : peopleIdsList + `(id:${personId})`;
    });
    peopleIdsList = `${peopleIdsList})`;

    const params = {
      ids: peopleIdsList,
    };

    const response = await this.linkedin.getMultipleMemberProfiles({
      $,
      params,
    });

    $.export("$summary", `Successfully retrieved ${this.peopleIds.length} member profile(s)`);

    return response;
  },
};
