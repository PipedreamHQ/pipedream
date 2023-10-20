const TASK_EVENTS = [
  "TaskCreated",
  "TaskDeleted",
  "TaskTitleChanged",
  "TaskImportanceChanged",
  "TaskStatusChanged",
  "TaskDatesChanged",
  "TaskParentsAdded",
  "TaskParentsRemoved",
  "TaskResponsiblesAdded",
  "TaskResponsiblesRemoved",
  "TaskSharedsAdded",
  "TaskSharedsRemoved",
  "TaskDescriptionChanged",
  "TaskCustomFieldChanged",
  "TaskApprovalStatusChanged",
  "TaskApprovalDecisionChanged",
  "TaskApprovalDecisionReset",
];

const FOLDER_EVENTS = [
  "FolderCreated",
  "FolderDeleted",
  "FolderTitleChanged",
  "FolderParentsAdded",
  "FolderParentsRemoved",
  "FolderSharedsAdded",
  "FolderSharedsRemoved",
  "FolderDescriptionChanged",
  "FolderCommentAdded",
  "FolderCommentDeleted",
  "FolderAttachmentAdded",
  "FolderAttachmentDeleted",
  "FolderCustomFieldChanged",
  "FolderApprovalStatusChanged",
  "FolderApprovalDecisionChanged",
  "FolderApprovalDecisionReset",
];

const PROJECT_EVENTS = [
  "ProjectDatesChanged",
  "ProjectOwnersAdded",
  "ProjectOwnersRemoved",
  "ProjectStatusChanged",
];

const OTHERS_EVENTS = [
  "AttachmentAdded",
  "AttachmentDeleted",
  "CommentAdded",
  "CommentDeleted",
  "TimelogChanged",
];

export default {
  DEPLOY_LIMIT: 25,
  EVENT_TYPES: {
    TASK: TASK_EVENTS,
    FOLDER: FOLDER_EVENTS,
    PROJECT: PROJECT_EVENTS,
    OTHERS: OTHERS_EVENTS,
    ALL: [
      ...TASK_EVENTS,
      ...FOLDER_EVENTS,
      ...PROJECT_EVENTS,
      ...OTHERS_EVENTS,
    ],
  },
};
