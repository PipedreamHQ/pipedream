export interface EventBody {
  subcalendar_ids: string;
  start_dt: string;
  end_dt: string;
  title?: string;
  location?: string;
}

export interface Event extends EventBody {
  id?: string;
}

export interface SubCalendar {
  id: string;
  name: string;
}

export interface ListEventsResponse {
  events: Event[];
  timestamp: number;
}

export interface UndoableOperationResponse {
  undo_id: string;
}

export interface CreateEventResponse extends UndoableOperationResponse {
  event: Event;
}
export type UpdateEventResponse = CreateEventResponse;

export type DeleteEventResponse = UndoableOperationResponse;
