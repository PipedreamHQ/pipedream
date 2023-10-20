const BASE_URL = "https://api.proworkflow.net";
const LAST_CREATED_AT = "lastCreatedAt";
const WEBHOOK_ID = "webhookId";
const DEFAULT_LIMIT = 100;
const DEFAULT_MAX = 600;

const FILE_PROP_NAMES = [
  "attachment",
  "uploaddoc",
  "upload_file",
];

const CONTENT_TYPE_KEY_HEADER = "Content-Type";
const MULTIPART_FORM_DATA_VALUE_HEADER = "multipart/form-data";
const MULTIPART_FORM_DATA_HEADERS = {
  [CONTENT_TYPE_KEY_HEADER]: MULTIPART_FORM_DATA_VALUE_HEADER,
};

const CONTACT_TYPES = {
  CLIENT: {
    label: "Client",
    value: "client",
  },
  CONTRACTOR: {
    label: "Contractor",
    value: "contractor",
  },
  OTHER: {
    label: "Other",
    value: "other",
  },
};

const TASK_PRIORITIES = {
  VERY_HIGH: {
    label: "Very High",
    value: "1",
  },
  HIGH: {
    label: "High",
    value: "2",
  },
  MEDIUM: {
    label: "Medium",
    value: "3",
  },
  LOW: {
    label: "Low",
    value: "4",
  },
  VERY_LOW: {
    label: "Very Low",
    value: "5",
  },
};

const EVENT_NAME = {
  NEWCONTACT: "newcontact",
  NEWPENDINGCONTACT: "newpendingcontact",
  EDITCONTACT: "editcontact",
  EDITCONTACTLOCATION: "editcontactlocation",
  DELETECONTACT: "deletecontact",
  NEWCOMPANY: "newcompany",
  NEWPENDINGCOMPANY: "newpendingcompany",
  EDITCOMPANY: "editcompany",
  DELETECOMPANY: "deletecompany",
  NEWFILE: "newfile",
  DELETEFILE: "deletefile",
  NEWINVOICE: "newinvoice",
  EDITINVOICE: "editinvoice",
  DELETEINVOICE: "deleteinvoice",
  NEWMESSAGE: "newmessage",
  EDITMESSAGE: "editmessage",
  DELETEMESSAGE: "deletemessage",
  NEWPROJECT: "newproject",
  EDITPROJECT: "editproject",
  DELETEPROJECT: "deleteproject",
  COMPLETEPROJECT: "completeproject",
  REACTIVATEPROJECT: "reactivateproject",
  NEWPROJECTREQUEST: "newprojectrequest",
  EDITPROJECTREQUEST: "editprojectrequest",
  DELETEPROJECTREQUEST: "deleteprojectrequest",
  APPROVEPROJECTREQUEST: "approveprojectrequest",
  DECLINEPROJECTREQUEST: "declineprojectrequest",
  NEWQUOTE: "newquote",
  EDITQUOTE: "editquote",
  DELETEQUOTE: "deletequote",
  NEWSHAREDNOTE: "newsharednote",
  EDITSHAREDNOTE: "editsharednote",
  DELETESHAREDNOTE: "deletesharednote",
  NEWTASK: "newtask",
  EDITTASK: "edittask",
  DELETETASK: "deletetask",
  COMPLETETASK: "completetask",
  REACTIVATETASK: "reactivatetask",
  NEWTIME: "newtime",
  EDITTIME: "edittime",
  DELETETIME: "deletetime",
  STARTTIMER: "starttimer",
  STOPTIMER: "stoptimer",
};

export default {
  BASE_URL,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  WEBHOOK_ID,
  FILE_PROP_NAMES,
  CONTENT_TYPE_KEY_HEADER,
  MULTIPART_FORM_DATA_VALUE_HEADER,
  MULTIPART_FORM_DATA_HEADERS,
  CONTACT_TYPES,
  TASK_PRIORITIES,
  EVENT_NAME,
};
