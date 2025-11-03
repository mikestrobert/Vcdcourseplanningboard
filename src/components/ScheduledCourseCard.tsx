import { useDrag } from 'react-dnd';
import { Course, FACULTY_COLORS, formatTime12Hour } from '../types/course';
import { Clock, GripVertical } from 'lucide-react';
import { CourseDetailsPopover } from './CourseDetailsPopover';

interface ScheduledCourseCardProps {
  course: Course;
  onUnschedule: (course: Course) => void;
  onEdit: (course: Course) => void;
}

export function ScheduledCourseCard({ course, onUnschedule, onEdit }: ScheduledCourseCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COURSE',
    item: course,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const colorClass = FACULTY_COLORS[course.instructor];
  
  // Get the time slot info for display
  const timeSlot = course.timeSlots[0];
  const timeDisplay = timeSlot ? `${formatTime12Hour(timeSlot.startTime)}–${formatTime12Hour(timeSlot.endTime)}` : '';

  return (
    <CourseDetailsPopover
      course={course}
      onEdit={onEdit}
      onDelete={onUnschedule}
    >
      <div
        ref={drag}
        className={`${colorClass} border-2 rounded-lg p-2 text-xs cursor-pointer transition-all hover:shadow-lg h-full overflow-hidden ${
          isDragging ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <div className="flex items-start gap-1">
          <GripVertical className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-40" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold">
              {course.code}{course.sectionNumber ? ` ${course.sectionNumber}` : ''}
            </div>
            <div className="mt-1 leading-tight line-clamp-2">{course.title}</div>
            <div className="flex items-center gap-1 mt-1 opacity-70">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{timeDisplay}</span>
            </div>
            <div className="text-xs mt-1 opacity-70 truncate">{course.instructor}</div>
            <div className="text-xs opacity-70 truncate">{course.room}</div>
          </div>
        </div>
      </div>
    </CourseDetailsPopover>
  );
}
