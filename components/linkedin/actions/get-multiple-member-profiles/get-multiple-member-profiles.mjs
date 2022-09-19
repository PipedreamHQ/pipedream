// legacy_hash_id: a_gni3Ad
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-get-multiple-member-profiles",
  name: "Get Multiple Member Profiles",
  description: "Gets multiple member profiles at once.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    people_ids: {
      type: "any",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://docs.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api#retrieve-other-members-profile

    const peopleIdsArr = this.people_ids;
    if (!this.people_ids || peopleIdsArr.length == 0) {
      throw new Error("Must provide people_ids parameter.");
    }

    //Generates the ids of the request with this required string format: List((id:{Person ID1}),(id:{Person ID2}),(id:{Person ID3}))
    var peopleIdsList = "List(";
    peopleIdsArr.forEach((person_id) =>  {
      peopleIdsList = peopleIdsList.length > 5
        ? peopleIdsList + `,(id:${person_id})`
        : peopleIdsList + `(id:${person_id})`;
    });
    peopleIdsList = `${peopleIdsList})`;

    //Sends the request
    return await axios($, {
      url: "https://api.linkedin.com/v2/people",
      headers: {
        "Authorization": `Bearer ${this.linkedin.$auth.oauth_access_token}`,
        "X-RestLi-Protocol-Version": "2.0.0",
      },
      params: {
        ids: peopleIdsList,
      },
    });
  },
};
