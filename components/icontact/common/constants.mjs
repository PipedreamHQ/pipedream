export const STATUS_OPTIONS = [
  {
    label: "Normal - Contact can receive emails sent to them.",
    value: "normal",
  },
  {
    label: "Bounced - Contact is unreachable via email.",
    value: "bounced",
  },
  {
    label: "Do Not Contact - Contact is blocked from receiving emails.",
    value: "donotcontact",
  },
  {
    label: "Pending - Contact must confirm a subscription before receiving emails.",
    value: "pending",
  },
  {
    label: "Invitable - Contact must be sent an invitation message before receiving emails.",
    value: "invitable",
  },
  {
    label: "Deleted - Contact was deleted from your records",
    value: "deleted",
  },
];

export const MESSAGE_TYPE_OPTIONS = [
  {
    label: "Normal - An email message.",
    value: "normal",
  },
  {
    label: "Confirmation - An email that requests a contact to confirm their subscription",
    value: "confirmation",
  },
];
