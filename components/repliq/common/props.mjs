const url = {
  type: "string",
  label: "URL",
  description: "The url of the website you want to use.",
};
const firstName = {
  type: "string",
  label: "First Name",
  description: "The name of the person you create the process for.",
};
const lastName = {
  type: "string",
  label: "Last Name",
  description: "The last name of the person you create the process for.",
  optional: true,
};
const companyName = {
  type: "string",
  label: "Company Name",
  description: "The name of the company you create the process for.",
};
const jobTitle = {
  type: "string",
  label: "Job Title",
  description: "The Job Title of the person you create the process for.",
  optional: true,
};
const icebreaker = {
  type: "string",
  label: "Icebreaker",
  description: "Use an icebreaker as introduction for your process specific to the person you create the process for.",
  optional: true,
};
const yourCustomVariable = {
  type: "string",
  label: "Your Custom Variable",
  description: "The yourCustomVariable you use for your process.",
  optional: true,
};

export const predefinedProps = {
  ai_image: {
    firstName,
    lastName,
    jobTitle,
    companyName: {
      ...companyName,
      optional: true,
    },
    yourCustomVariable,
  },
  ai_avatar: {
    url,
    companyName: {
      ...companyName,
      optional: true,
    },
    firstName: {
      ...firstName,
      optional: true,
    },
    jobTitle,
    icebreaker,
  },
  gpt_image: {
    companyName,
    firstName: {
      ...firstName,
      optional: true,
    },
    lastName,
    jobTitle,
    competion: {
      type: "string",
      label: "Competion",
      description: "The competion of the company you create an image for.",
      optional: true,
    },
    yourCustomVariable,
  },
  icebreaker: {
    url,
    firstName,
  },
  text_to_video: {
    firstName,
    prospectImgUrl: {
      type: "string",
      label: "Prospect Img URL",
      description: "The linkedin profile url of the person you want to reach out to.",
      optional: true,
    },
    lastName,
    companyName: {
      ...companyName,
      optional: true,
    },
    jobTitle,
    icebreaker,
  },
  video_scale: {
    url,
    firstName: {
      ...firstName,
      optional: true,
    },
    lastName,
  },
};
