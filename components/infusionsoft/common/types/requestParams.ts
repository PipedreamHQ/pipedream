import { Pipedream } from "@pipedream/types";

interface ActionRequestParams {
  $?: Pipedream;
}

interface HttpRequestParams extends ActionRequestParams {
  endpoint?: string;
  data?: object;
  method?: string;
  url?: string;
  params?: Record<string, string | number | string[] | undefined>;
}

interface CreateOrderItemParams extends ActionRequestParams {
  orderId: number;
  data: {
    description: string;
    price: string;
    product_id: number;
    quantity: number;
  };
}

interface CreatePaymentParams extends ActionRequestParams {
  orderId: number;
  data: {
    apply_to_commissions: boolean;
    charge_now: boolean;
    credit_card_id: number;
    date: string;
    notes: string;
    payment_amount: string;
    payment_gateway_id: string;
    payment_method_type: string;
  };
}

interface AddContactToAutomationParams extends ActionRequestParams {
  automationId: string;
  sequenceId: string;
  contactIds: string[];
}

interface ApplyTagToContactsParams extends ActionRequestParams {
  tagId: string;
  contactIds: string[];
}

interface CreateAffiliateParams extends ActionRequestParams {
  code: string;
  contactId: string;
  status: string;
  name?: string;
}

interface CreateCompanyParams extends ActionRequestParams {
  companyName: string;
  email?: string;
  phoneNumber?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  locality?: string;
  region?: string;
  regionCode?: string;
  postalCode?: string;
  country?: string;
  countryCode?: string;
  notes?: string;
  customFields?: string | unknown[];
}

interface CreateContactParams extends ActionRequestParams {
  givenName?: string;
  familyName?: string;
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  companyId?: string;
  jobTitle?: string;
  ownerId?: string;
  leadsourceId?: string;
  customFields?: string | unknown[];
}

interface CreateContactNoteParams extends ActionRequestParams {
  contactId: string;
  body: string;
  userId?: string;
  title?: string;
  type?: string;
}

interface CreateOpportunityParams extends ActionRequestParams {
  opportunityTitle: string;
  contactId: string;
  stageId: string;
  userId: string;
  projectedRevenueHigh?: string;
  projectedRevenueLow?: string;
  estimatedCloseTime?: string;
  nextActionTime?: string;
  nextActionNotes?: string;
  opportunityNotes?: string;
  includeInForecast?: boolean;
  customFields?: string | unknown[];
}

interface CreateOpportunityStageParams extends ActionRequestParams {
  name: string;
  order: number;
  probability: number;
  targetNumberDays: number;
  checklistItems?: string;
}

interface CreateTaskParams extends ActionRequestParams {
  assignedToUserId: string;
  title?: string;
  contactId?: string;
  description?: string;
  dueTime?: string;
  priority?: string;
  type?: string;
  completed?: boolean;
  completionTime?: string;
  remindTimeMins?: string;
}

interface DeleteTaskParams extends ActionRequestParams {
  taskId: string;
}

interface SendEmailParams extends ActionRequestParams {
  userId: string;
  subject: string;
  contactIds: string[];
  htmlContent?: string;
  plainContent?: string;
  addressField?: string;
  attachments?: string;
}

interface SendEmailTemplateParams extends ActionRequestParams {
  templateId: string;
  userId: string;
  contactIds: string[];
  addressField?: string;
}

interface UpdateContactParams extends ActionRequestParams {
  contactId: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  jobTitle?: string;
  ownerId?: string;
  leadsourceId?: string;
  customFields?: string | unknown[];
}

interface UpdateOpportunityParams extends ActionRequestParams {
  opportunityId: string;
  opportunityTitle?: string;
  contactId?: string;
  stageId?: string;
  userId?: string;
  projectedRevenueHigh?: string;
  projectedRevenueLow?: string;
  estimatedCloseTime?: string;
  nextActionTime?: string;
  nextActionNotes?: string;
  opportunityNotes?: string;
  includeInForecast?: boolean;
  customFields?: string | unknown[];
}

interface UpdateTaskParams extends ActionRequestParams {
  taskId: string;
  assignedToUserId?: string;
  title?: string;
  contactId?: string;
  description?: string;
  dueTime?: string;
  priority?: string;
  type?: string;
  completed?: boolean;
  completionTime?: string;
  remindTimeMins?: string;
}

interface UploadFileParams extends ActionRequestParams {
  fileData: string;
  fileName: string;
  fileAssociation: string;
  contactId?: string;
  isPublic?: boolean;
}

interface GetObjectParams extends ActionRequestParams {
  id: number;
}

interface CreateHookParams {
  eventKey: string;
  hookUrl: string;
}

interface DeleteHookParams {
  key: string;
}

export {
  AddContactToAutomationParams,
  ApplyTagToContactsParams,
  CreateAffiliateParams,
  CreateCompanyParams,
  CreateContactParams,
  CreateContactNoteParams,
  CreateHookParams,
  CreateOpportunityParams,
  CreateOpportunityStageParams,
  CreateTaskParams,
  DeleteHookParams,
  DeleteTaskParams,
  CreateOrderItemParams,
  CreatePaymentParams,
  GetObjectParams,
  HttpRequestParams,
  SendEmailParams,
  SendEmailTemplateParams,
  UpdateContactParams,
  UpdateOpportunityParams,
  UpdateTaskParams,
  UploadFileParams,
};
