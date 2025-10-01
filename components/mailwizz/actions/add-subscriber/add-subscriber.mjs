import mailwizz from "../../mailwizz.app.mjs";

export default {
  key: "mailwizz-add-subscriber",
  name: "Add Subscriber",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new subscriber to a list. [See the docs here](https://api-docs.mailwizz.com/?python#create-a-subscriber)",
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
      listId,
      email,
      fname,
      lname,
    } = this;

    const response = await mailwizz.createSubscriber( {
      listId,
      data: {
        EMAIL: email,
        FNAME: fname,
        LNAME: lname,
      },
    } );

    $.export( "$summary", `Subscriber with id ${response.data.record.subscriber_uid} was successfully created!` );
    return response;
  },
};
