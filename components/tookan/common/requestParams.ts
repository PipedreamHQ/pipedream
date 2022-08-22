import { Pipedream } from "@pipedream/types";

interface ActionRequestParams {
  $?: Pipedream;
}

interface HttpRequestParams extends ActionRequestParams {
  endpoint: string;
  data?: object;
  method?: string;
}

interface CreateAppointmentTaskParams extends ActionRequestParams {
  data?: {
    additionalOptions: object;
    customer_address: string;
    job_delivery_datetime: string;
    job_pickup_datetime: string;
    timezone: string;
    has_pickup: 0;
    has_delivery: 0;
    layout_type: 1;
  };
}

interface CreateDeliveryTask extends ActionRequestParams {
  data?: {
    additionalOptions: object;
    customer_address: string;
    job_delivery_datetime: string;
    timezone: string;
    has_pickup: 0;
    has_delivery: 1;
    layout_type: 0;
  };
}

interface CreateFieldWorkforceTask extends ActionRequestParams {
  data?: {
    additionalOptions: object;
    customer_address: string;
    job_delivery_datetime: string;
    job_pickup_datetime: string;
    timezone: string;
    has_pickup: 0;
    has_delivery: 0;
    layout_type: 2;
  };
}

interface CreatePickupTask extends ActionRequestParams {
  data?: {
    additionalOptions: object;
    job_pickup_address: string;
    job_pickup_datetime: string;
    timezone: string;
    has_pickup: 1;
    has_delivery: 0;
    layout_type: 0;
  };
}

interface CreatePickupAndDeliveryTask extends ActionRequestParams {
  data?: {
    additionalOptions: object;
    customer_address: string;
    job_delivery_datetime: string;
    job_pickup_address: string;
    job_pickup_datetime: string;
    timezone: string;
    has_pickup: 1;
    has_delivery: 1;
    layout_type: 0;
  };
}

export {
  HttpRequestParams,
  CreateAppointmentTaskParams,
  CreateDeliveryTask,
  CreateFieldWorkforceTask,
  CreatePickupTask,
  CreatePickupAndDeliveryTask,
};
