import { Course } from '../types/course';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Clock, MapPin, X } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface CourseDetailsPopoverProps {
  course: Course;
  children: ReactNode;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export function CourseDetailsPopover({ course, children, onEdit, onDelete }: CourseDetailsPopoverProps) {
  const [open, setOpen] = useState(false);

  const formatSchedule = () => {
    if (course.timeSlots.length === 0) return 'No schedule';
    
    // Group by days
    const days = course.timeSlots.map(slot => slot.day).join(' and ');
    const timeRange = course.timeSlots.length > 0 
      ? `${course.timeSlots[0].startTime} to ${course.timeSlots[0].endTime}`
      : '';
    
    return { days, timeRange };
  };

  const schedule = formatSchedule();
  
  // Get the color dot matching the instructor
  const getColorDot = () => {
    const colorMap: Record<string, string> = {
      'Mike Strobert': 'bg-green-500',
      'Anne Jordan': 'bg-blue-500',
      'Dan DeLuna': 'bg-purple-500',
      'Adam Smith': 'bg-orange-500',
      'Peter Byrne': 'bg-pink-500',
      'TBD': 'bg-gray-500',
    };
    return colorMap[course.instructor] || 'bg-gray-500';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-6" align="start">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`w-4 h-4 rounded-full ${getColorDot()} mt-1`} />
              <div>
                <h3 className="text-xl">
                  {course.code} {course.sectionNumber && course.sectionNumber} {course.title}
                </h3>
              </div>
            </div>
            <button 
              className="text-gray-400 hover:text-gray-600"
              title="Close"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Schedule Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-gray-900">
                  {course.timeSlots.length > 0 
                    ? new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                    : 'Not scheduled'}
                </p>
                <p className="text-gray-900">
                  {schedule.timeRange}
                </p>
                {course.timeSlots.length > 0 && (
                  <p className="text-gray-500">
                    Occurs every {schedule.days}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <p className="text-gray-900">{course.room}</p>
            </div>
          </div>

          {/* Instructor */}
          <div className="pt-2">
            <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => onEdit(course)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(course)}
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
