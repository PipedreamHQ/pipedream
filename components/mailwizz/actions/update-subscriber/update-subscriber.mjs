import mailwizz from "../../mailwizz.app.mjs";

export default {
  key: "mailwizz-update-subscriber",
  name: "Updaste Subscriber",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update a specific subscriber. [See the docs here](https://api-docs.mailwizz.com/?python#update-a-subscriber)",
  type: "action",
  props: {
    mailwizz,
    listId: {
      propDefinition: [
        mailwizz,
        "listId",
      ],
      description: "The list uid to which this customer will be added.",
    },
    subscriberId: {
      propDefinition: [
        mailwizz,
        "subscriberId",
        ( { listId } ) => ( {
          listId,
        } ),
      ],
    },
    email: {
      propDefinition: [
        mailwizz,
        "email",
      ],
    },
    fname: {
      propDefinition: [
        mailwizz,
        "fname",
      ],
      optional: true,
    },
    lname: {
      propDefinition: [
        mailwizz,
        "lname",
      ],
      optional: true,
    },
  },
  async run ( { $ } ) {
    const {
      mailwizz,
      subscriberId,
      listId,
      email,
      fname,
      lname,
    } = this;

    const response = await mailwizz.updateSubscriber( {
      listId,
      subscriberId,
      data: {
        EMAIL: email,
        FNAME: fname,
        LNAME: lname,
      },
    } );

    $.export( "$summary", `Subscriber with id ${response.data.record.subscriber_uid} was successfully updated!` );
    return response;
  },
};
