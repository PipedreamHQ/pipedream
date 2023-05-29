import { Pipedream } from "@pipedream/types";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface HttpRequestParams extends PdAxiosRequest {
  url: string;
  method?: string;
  data?: object;
  params?: object;
}

export interface SendEmailParams extends PdAxiosRequest {
  data: {
    from: string;
    to: string;
    subject: string;
    html?: string;
    text?: string;
    cc?: string[];
    bcc?: string[];
    reply_to?: string[];
  };
}

export interface SendEmailResponse {
  id: string;
}

export interface RetrieveEmailParams extends PdAxiosRequest {
  emailId: string;
}
