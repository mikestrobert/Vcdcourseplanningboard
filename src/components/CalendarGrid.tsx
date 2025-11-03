import { Course, DayOfWeek, DAYS, TIME_SLOTS, formatTime12Hour } from '../types/course';
import { DayColumn } from './DayColumn';
import { ScheduledCourseCard } from './ScheduledCourseCard';

interface CalendarGridProps {
  scheduledCourses: Course[];
  onDropCourse: (course: Course, day: DayOfWeek, time: string) => void;
  onUnschedule: (course: Course) => void;
  onEdit: (course: Course) => void;
}

const CELL_HEIGHT = 64; // Height per hour slot in pixels

export function CalendarGrid({ scheduledCourses, onDropCourse, onUnschedule, onEdit }: CalendarGridProps) {

  // Calculate position and dimensions for a course
  const getCourseStyle = (course: Course, day: DayOfWeek, overlappingCourses: Course[]) => {
    const slot = course.timeSlots.find(s => s.day === day);
    if (!slot) return null;

    // Calculate top position (in pixels from the start of the grid)
    const startHour = parseInt(slot.startTime.split(':')[0]);
    const startMinute = parseInt(slot.startTime.split(':')[1]);
    const startTimeValue = startHour * 60 + startMinute;
    const gridStartTime = parseInt(TIME_SLOTS[0].split(':')[0]) * 60;
    const offsetMinutes = startTimeValue - gridStartTime;
    const top = (offsetMinutes / 60) * CELL_HEIGHT;

    // Calculate height (in pixels)
    const endHour = parseInt(slot.endTime.split(':')[0]);
    const endMinute = parseInt(slot.endTime.split(':')[1]);
    const endTimeValue = endHour * 60 + endMinute;
    const durationMinutes = endTimeValue - startTimeValue;
    const height = (durationMinutes / 60) * CELL_HEIGHT;

    // Calculate width and left offset based on overlapping courses
    const courseIndex = overlappingCourses.findIndex(c => c.id === course.id);
    const totalOverlapping = overlappingCourses.length;
    const width = totalOverlapping > 1 ? `${100 / totalOverlapping}%` : '100%';
    const left = totalOverlapping > 1 ? `${(courseIndex / totalOverlapping) * 100}%` : '0';

    return { top, height, width, left };
  };

  // Detect overlapping courses for a given day
  const getOverlappingGroups = (day: DayOfWeek) => {
    const daySchedule = scheduledCourses.filter(course =>
      course.timeSlots.some(slot => slot.day === day)
    );

    const groups: Course[][] = [];
    
    daySchedule.forEach(course => {
      const slot = course.timeSlots.find(s => s.day === day);
      if (!slot) return;

      const startTimeValue = parseInt(slot.startTime.split(':')[0]) * 60 + parseInt(slot.startTime.split(':')[1]);
      const endTimeValue = parseInt(slot.endTime.split(':')[0]) * 60 + parseInt(slot.endTime.split(':')[1]);

      // Find which group(s) this course overlaps with
      let addedToGroup = false;
      for (const group of groups) {
        const overlaps = group.some(otherCourse => {
          const otherSlot = otherCourse.timeSlots.find(s => s.day === day);
          if (!otherSlot) return false;

          const otherStartValue = parseInt(otherSlot.startTime.split(':')[0]) * 60 + parseInt(otherSlot.startTime.split(':')[1]);
          const otherEndValue = parseInt(otherSlot.endTime.split(':')[0]) * 60 + parseInt(otherSlot.endTime.split(':')[1]);

          // Check if time ranges overlap
          return startTimeValue < otherEndValue && endTimeValue > otherStartValue;
        });

        if (overlaps) {
          group.push(course);
          addedToGroup = true;
          break;
        }
      }

      if (!addedToGroup) {
        groups.push([course]);
      }
    });

    return groups;
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full relative">
        {/* Grid Background */}
        <div className="grid gap-px bg-gray-300 border border-gray-300 rounded-lg overflow-hidden" style={{ gridTemplateColumns: '80px repeat(5, 1fr)' }}>
          {/* Header Row */}
          <div className="bg-gray-100 p-2 sticky top-0 z-10">
            
          </div>
          {DAYS.map(day => (
            <div key={day} className="bg-gray-100 p-3 text-center sticky top-0 z-10">
              <span className="text-gray-900 font-bold">{day}</span>
            </div>
          ))}

          {/* Time Slots Grid */}
          {TIME_SLOTS.map(time => (
            <>
              <div key={`time-${time}`} className="bg-gray-50 p-2 flex items-center justify-center text-sm text-gray-600" style={{ height: `${CELL_HEIGHT}px` }}>
                {formatTime12Hour(time)}
              </div>
              {DAYS.map(day => (
                <div
                  key={`${day}-${time}`}
                  className="border border-gray-200 bg-white"
                  style={{ height: `${CELL_HEIGHT}px` }}
                />
              ))}
            </>
          ))}
        </div>

        {/* Course Cards Overlay with Drop Zones */}
        <div className="absolute" style={{ top: `${CELL_HEIGHT + 2}px`, left: '80px', right: 0, height: `${CELL_HEIGHT * TIME_SLOTS.length}px` }}>
          <div className="grid gap-px h-full" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {/* Day columns with drop zones and course overlays */}
            {DAYS.map((day) => {
              const overlappingGroups = getOverlappingGroups(day);
              
              return (
                <DayColumn
                  key={day}
                  day={day}
                  cellHeight={CELL_HEIGHT}
                  onDropCourse={onDropCourse}
                >
                  {overlappingGroups.flatMap(group =>
                    group.map(course => {
                      const style = getCourseStyle(course, day, group);
                      if (!style) return null;

                      return (
                        <div
                          key={course.id}
                          className="absolute"
                          style={{
                            top: `${style.top}px`,
                            height: `${style.height}px`,
                            width: style.width,
                            left: style.left,
                            paddingLeft: '4px',
                            paddingRight: '4px'
                          }}
                        >
                          <ScheduledCourseCard
                            course={course}
                            onUnschedule={onUnschedule}
                            onEdit={onEdit}
                          />
                        </div>
                      );
                    })
                  )}
                </DayColumn>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
