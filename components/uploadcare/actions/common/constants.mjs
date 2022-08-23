export default {
  STORE_TYPES: [
    {
      label: "Do not mark an uploaded file as stored and remove it after 24 hours",
      value: "0",
    },
    {
      label: "mark the uploaded file as stored",
      value: "1",
    },
    {
      label: "delegate the choice of the file storing behavior to a project-wide setting called auto-store.",
      value: "auto",
    },
  ],
};
