import { Pipedream } from "@pipedream/types";
import { EventBody } from "./responseSchemas";

interface PdAxiosRequest {
  $?: Pipedream;
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
  data: EventBody;
}
export interface DeleteEventParams extends PdAxiosRequest, EventRequest { }

export interface ListEventsParams extends PdAxiosRequest, CalendarRequest {
  params: {
    subcalendarId?: string[];
    query?: string;
    startDate?: string;
    endDate?: string;
    modifiedSince?: number;
  };
}
export interface UpdateEventParams extends PdAxiosRequest, EventRequest {
  data: EventBody & {
    id: string;
  };
}

export interface ListSubCalendarsParams extends PdAxiosRequest, CalendarRequest { }
