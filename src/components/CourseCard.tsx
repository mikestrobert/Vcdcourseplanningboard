import { useDrag } from 'react-dnd';
import { Course, FACULTY_COLORS } from '../types/course';
import { GripVertical, Clock, MapPin, User } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
}

export function CourseCard({ course, onEdit }: CourseCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COURSE',
    item: course,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const colorClass = FACULTY_COLORS[course.instructor];
  
  const formatTimeSlots = () => {
    if (course.timeSlots.length === 0) return 'No time assigned';
    return course.timeSlots.map(slot => 
      `${slot.day.slice(0, 3)} ${slot.startTime}–${slot.endTime}`
    ).join(', ');
  };

  return (
    <div
      ref={drag}
      className={`${colorClass} border-2 rounded-lg p-3 mb-2 cursor-move transition-all hover:shadow-md ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      onClick={() => onEdit?.(course)}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 mt-1 flex-shrink-0 opacity-40" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold">
            {course.code}{course.sectionNumber ? ` ${course.sectionNumber}` : ''}
          </div>
          <div className="text-sm mt-1">{course.title}</div>
          
          <div className="flex items-center gap-1 text-xs mt-2 opacity-80">
            <User className="w-3 h-3" />
            <span>{course.instructor}</span>
          </div>
          
          {course.room !== 'TBD' && (
            <div className="flex items-center gap-1 text-xs mt-1 opacity-80">
              <MapPin className="w-3 h-3" />
              <span>{course.room}</span>
            </div>
          )}
          
          {course.timeSlots.length > 0 && (
            <div className="flex items-center gap-1 text-xs mt-1 opacity-80">
              <Clock className="w-3 h-3" />
              <span>{formatTimeSlots()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
