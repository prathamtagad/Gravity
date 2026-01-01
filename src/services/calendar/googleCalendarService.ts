import { TimeSlot } from "@/types/timetable"

export const initiateGoogleLogin = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1500)
  })
}

export const fetchCalendarEvents = async (): Promise<TimeSlot[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockEvents: TimeSlot[] = [
        {
          id: 'gcal-1',
          day: 'Monday',
          startTime: '10:00',
          endTime: '11:00',
          className: 'Google Cal: Team Meeting',
          location: 'Conference Room A'
        },
        {
          id: 'gcal-2',
          day: 'Wednesday', 
          startTime: '14:00',
          endTime: '15:30',
          className: 'Google Cal: Project Review',
          location: 'Online'
        }
      ]
      resolve(mockEvents)
    }, 1000)
  })
}
