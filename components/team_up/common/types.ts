import { Pipedream } from "@pipedream/types";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface HttpRequestParams extends PdAxiosRequest {
  url: string;
  data?: object;
  params?: object;
}

interface CalendarRequest {
  calendarKey: string;
}
interface EventRequest extends CalendarRequest {
  eventId: string;
}

export interface CreateEventParams extends PdAxiosRequest, CalendarRequest {
  data: object;
}
export interface DeleteEventParams extends PdAxiosRequest, EventRequest { }
export interface GetEventParams extends PdAxiosRequest, EventRequest { }
export interface ListEventsParams extends PdAxiosRequest, CalendarRequest { }
export interface UpdateEventParams extends PdAxiosRequest, EventRequest {
  data: object;
}

export interface Event {
  id: string;
  title: string;
}
