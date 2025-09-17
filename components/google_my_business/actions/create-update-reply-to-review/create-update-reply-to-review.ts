import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { UpdateReplyParams } from "../../common/requestParams";

const DOCS_LINK = "https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/updateReply";

export default defineAction({
  key: "google_my_business-create-update-reply-to-review",
  name: "Create or Update Reply to Review",
  description: `Create or update a reply to the specified review. [See the documentation](${DOCS_LINK})`,
  version: "0.0.3",
  type: "action",
  props: {
    app,
    account: {
      propDefinition: [
        app,
        "account",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
        ({ account }: { account: string; }) => ({
          account,
        }),
      ],
    },
    review: {
      propDefinition: [
        app,
        "review",
        ({
          account, location,
        }: Record<string, string>) => ({
          account,
          location,
        }),
      ],
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The body of the reply as plain text with markups. The maximum length is 4096 bytes.",
    },
  },
  async run({ $ }) {
    const {
      account, location, review, comment,
    } = this;

    const params: UpdateReplyParams = {
      $,
      account,
      location,
      review,
      data: {
        comment,
      },
    };

    const response = await this.app.updateReviewReply(params);

    $.export("$summary", "Successfully updated review");

    return response;
  },
});
