import { Pipedream } from "@pipedream/types";

export interface VerifyEmailParams {
  $: Pipedream;
  params: {
    email: string;
  };
}

export interface VerifyEmailResponse {
  reason: string;
  success: boolean;
}
