import { Pipedream } from "@pipedream/types";

interface ActionRequestParams {
  $: Pipedream;
}

interface HttpRequestParams extends ActionRequestParams {
  endpoint: string;
  data?: object;
  method?: string;
}

type CreateTaskParams = ActionRequestParams & {
  data: {
    additionalOptions: object;
    timezone: string;
    has_delivery: 0 | 1;
    has_pickup: 0 | 1;
    layout_type: 0 | 1 | 2;
  };
};

interface HasDeliveryParams {
  data: {
    customer_address: string;
    job_delivery_datetime: string;
  };
}
interface HasPickupDate {
  data: {
    job_pickup_datetime: string;
  };
}

interface HasPickupAddress {
  data: {
    job_pickup_address: string;
  };
}

type CreateAppointmentTaskParams = CreateTaskParams &
  HasDeliveryParams &
  HasPickupDate & {
    data: {
      has_delivery: 0;
      has_pickup: 0;
      layout_type: 1;
    };
  };

type CreateDeliveryTaskParams = CreateTaskParams &
  HasDeliveryParams & {
    data: {
      has_delivery: 1;
      has_pickup: 0;
      layout_type: 0;
    };
  };

type CreateFieldWorkforceTaskParams = CreateTaskParams &
  HasDeliveryParams &
  HasPickupDate & {
    data: {
      has_delivery: 0;
      has_pickup: 0;
      layout_type: 2;
    };
  };

type CreatePickupTaskParams = CreateTaskParams &
  HasPickupDate &
  HasPickupAddress & {
    data: {
      has_delivery: 0;
      has_pickup: 1;
      layout_type: 0;
    };
  };

type CreatePickupAndDeliveryTaskParams = CreateTaskParams &
  HasPickupDate &
  HasDeliveryParams &
  HasPickupAddress & {
    data: {
      has_delivery: 1;
      has_pickup: 1;
      layout_type: 0;
    };
  };

export {
  HttpRequestParams,
  CreateAppointmentTaskParams,
  CreateDeliveryTaskParams,
  CreateFieldWorkforceTaskParams,
  CreatePickupAndDeliveryTaskParams,
  CreatePickupTaskParams,
};
