import { useDrop, useDrag } from 'react-dnd';
import { Course, DayOfWeek, FACULTY_COLORS, TimeSlot } from '../types/course';
import { Clock, GripVertical } from 'lucide-react';
import { CourseDetailsPopover } from './CourseDetailsPopover';

interface TimeSlotCellProps {
  day: DayOfWeek;
  time: string;
  courses: Course[];
  onDropCourse: (course: Course, day: DayOfWeek, time: string) => void;
  onUnschedule: (course: Course) => void;
  onEdit: (course: Course) => void;
}

interface ScheduledCourseCardProps {
  course: Course;
  colorClass: string;
  durationHours: number;
  duration?: TimeSlot;
  onUnschedule: (course: Course) => void;
  onEdit: (course: Course) => void;
  width: string;
}

function ScheduledCourseCard({ 
  course, 
  colorClass, 
  durationHours, 
  duration, 
  onUnschedule, 
  onEdit,
  width 
}: ScheduledCourseCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COURSE',
    item: course,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <CourseDetailsPopover
      course={course}
      onEdit={onEdit}
      onDelete={onUnschedule}
    >
      <div
        ref={drag}
        className={`${colorClass} border-2 rounded p-2 text-xs cursor-pointer transition-all hover:shadow-lg relative ${
          isDragging ? 'opacity-50' : 'opacity-100'
        }`}
        style={{ 
          minHeight: `${durationHours * 3.5}rem`,
          width: width
        }}
      >
        <div className="flex items-start gap-1">
          <GripVertical className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-40" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold">
              {course.code}{course.sectionNumber ? ` ${course.sectionNumber}` : ''}
            </div>
            <div className="mt-1 leading-tight truncate">{course.title}</div>
            <div className="flex items-center gap-1 mt-1 opacity-70">
              <Clock className="w-3 h-3" />
              <span>{duration?.startTime}–{duration?.endTime}</span>
            </div>
            <div className="text-xs mt-1 opacity-70 truncate">{course.instructor}</div>
            <div className="text-xs opacity-70">{course.room}</div>
          </div>
        </div>
      </div>
    </CourseDetailsPopover>
  );
}

export function TimeSlotCell({ day, time, courses, onDropCourse, onUnschedule, onEdit }: TimeSlotCellProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'COURSE',
    drop: (item: Course) => {
      onDropCourse(item, day, time);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const coursesInSlot = courses.filter(course =>
    course.timeSlots.some(slot => {
      if (slot.day !== day) return false;
      const slotStart = parseInt(slot.startTime.split(':')[0]);
      const slotEnd = parseInt(slot.endTime.split(':')[0]);
      const currentTime = parseInt(time.split(':')[0]);
      return currentTime >= slotStart && currentTime < slotEnd;
    })
  );

  // Find courses that start at this exact time slot
  const coursesStartingHere = coursesInSlot.filter(course =>
    course.timeSlots.some(slot => slot.day === day && slot.startTime === time)
  );

  // Calculate width for each course based on overlap count
  const overlapCount = coursesStartingHere.length;
  const courseWidth = overlapCount > 1 ? `${100 / overlapCount}%` : '100%';

  return (
    <div
      ref={drop}
      className={`border border-gray-200 min-h-16 p-1 transition-colors ${
        isOver && canDrop ? 'bg-blue-50 border-blue-300' : 'bg-white'
      } ${canDrop && !isOver ? 'bg-gray-50' : ''}`}
    >
      {overlapCount > 0 && (
        <div className="flex gap-1 h-full">
          {coursesStartingHere.map(course => {
            const colorClass = FACULTY_COLORS[course.instructor];
            const duration = course.timeSlots.find(slot => slot.day === day);
            const startHour = duration ? parseInt(duration.startTime.split(':')[0]) : 0;
            const endHour = duration ? parseInt(duration.endTime.split(':')[0]) : 0;
            const durationHours = endHour - startHour;

            return (
              <ScheduledCourseCard
                key={course.id}
                course={course}
                colorClass={colorClass}
                durationHours={durationHours}
                duration={duration}
                onUnschedule={onUnschedule}
                onEdit={onEdit}
                width={courseWidth}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
