export const LIMIT = 100;

export const TYPE_OPTIONS = [
  {
    label: "Delivery - Send the email as it is certifying the delivery process.",
    value: "delivery",
  },
  {
    label: "Open Document - Send a modified version of the email with a button that redirects the user to our platform to open the **PDF** attachments. With this method, you can track when the user opens the attached files. Note: This method only supports **PDF** documents to be attached.",
    value: "open_document",
  },
  {
    label: "Open Every Document - This type works like the **Open Document** type but allows to track the opening of every **PDF** file in emails with multiple attachments.",
    value: "open_every_document",
  },
];

export const DELIVERY_TYPE_OPTIONS = [
  {
    label: "Email - The signature request is sent by email. This is the default behavior when no type is specified.",
    value: "email",
  },
  {
    label: "SMS - The signature request is sent by SMS. You must include the **phone** in the **recipients** parameter.",
    value: "sms",
  },
  {
    label: "URL - The signature request is not sent to the signer. Instead of this, the creation request will return a **url** parameter that you can open in the browser to complete the signature.",
    value: "url",
  },
];

export const SIGNING_MODE_OPTIONS = [
  {
    label: "Sequential - Each recipient receives the request once the previous recipient has completed their action.",
    value: "sequential",
  },
  {
    label: "Parallel - All recipients receive the request in parallel.",
    value: "parallel",
  },
];

export const SIGNATURE_TYPE_OPTIONS = [
  {
    label: "Simple - A simple signature request is created.",
    value: "simple",
  },
  {
    label: "Advanced - An advanced signature request is created. We capture the biometric information of the signer with the signature draw.",
    value: "advanced",
  },
  {
    label: "Smart - The system creates different type of signature depending in the user device. A simple signature is created for desktop pcs and advanced signature is created for mobile and tablet devices.",
    value: "smart",
  },
];
