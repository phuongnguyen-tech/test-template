import { useMemo } from 'react';
import { ICalendarEvent } from 'src/types/calendar';
import { endpoints, fetcher } from 'src/utils/axios';
import useSWR, { mutate } from 'swr';

const URL = endpoints.calendar;

const options = {
  revalidateIfState: false,
  revalidateOnForcus: false,
  revalidateOnReconnect: false,
};

export function useGetEvents() {
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(() => {
    const events = data?.events.map((event: ICalendarEvent) => ({
      ...event,
      textColor: event.color,
    }));

    return {
      events: (events as ICalendarEvent[]) || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.events.length,
    };
  }, [data?.events, error, isLoading, isValidating]);

  return memoizedValue;
}

export async function createEvent(eventData: ICalendarEvent) {
  // work on server

  // const data = { eventData }
  // await axios.post(URL, data)

  // work in local
  mutate(
    URL,
    (currentData: any) => {
      const events: ICalendarEvent[] = [...currentData.events, eventData];

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}

export async function updateEvent(eventData: Partial<ICalendarEvent>) {
  // work on server

  // const data = { eventData }
  // await axios.put(URL, data)

  // work in local
  mutate(
    URL,
    (currentData: any) => {
      const events: ICalendarEvent[] = currentData.events.map((event: ICalendarEvent) =>
        event.id === eventData.id ? { ...event, ...eventData } : event
      );

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}

export async function deleteEvent(eventId: string) {
  // work on server

  // const data = { eventData }
  // await axios.patch(endpoints.calendar, data)

  // work in local
  mutate(
    URL,
    (currentData: any) => {
      const events: ICalendarEvent[] = currentData.events.filter(
        (event: ICalendarEvent) => event.id !== eventId
      );

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}
