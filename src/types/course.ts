export type Faculty = 'Mike Strobert' | 'Anne Jordan' | 'Dan DeLuna' | 'Adam Smith' | 'Peter Byrne' | 'TBD';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type CourseStatus = 'confirmed' | 'tentative' | 'backlog';

export interface TimeSlot {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: Faculty;
  room: string;
  timeSlots: TimeSlot[];
  status: CourseStatus;
  sectionNumber?: string; // e.g., "01", "02" for multiple instances
}

export const FACULTY_COLORS: Record<Faculty, string> = {
  'Mike Strobert': 'bg-green-100 border-green-300 text-green-900',
  'Anne Jordan': 'bg-blue-100 border-blue-300 text-blue-900',
  'Dan DeLuna': 'bg-purple-100 border-purple-300 text-purple-900',
  'Adam Smith': 'bg-orange-100 border-orange-300 text-orange-900',
  'Peter Byrne': 'bg-pink-100 border-pink-300 text-pink-900',
  'TBD': 'bg-gray-100 border-gray-300 text-gray-700',
};

export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00'
];

// Helper function to convert 24-hour time to 12-hour format
export function formatTime12Hour(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
