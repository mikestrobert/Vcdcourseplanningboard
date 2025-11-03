import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Course, Faculty, DayOfWeek, DAYS } from '../types/course';

interface EditCourseDialogProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
}

const FACULTY: Faculty[] = ['Mike Strobert', 'Anne Jordan', 'Dan DeLuna', 'Adam Smith', 'Peter Byrne', 'TBD'];
const ROOMS = ['07-1305', '07-1315', '07-1611', 'Other'];

export function EditCourseDialog({ course, open, onClose, onSave }: EditCourseDialogProps) {
  const [editedCourse, setEditedCourse] = useState<Course | null>(course);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:50');

  // Update local state when course changes
  useEffect(() => {
    if (course) {
      setEditedCourse(course);
      // Initialize days from time slots
      const days = course.timeSlots.map(slot => slot.day);
      setSelectedDays(days);
      // Initialize times from first slot if available
      if (course.timeSlots.length > 0) {
        setStartTime(course.timeSlots[0].startTime);
        setEndTime(course.timeSlots[0].endTime);
      } else {
        setStartTime('09:00');
        setEndTime('11:50');
      }
    }
  }, [course]);

  if (!course || !editedCourse) return null;

  const handleDayToggle = (day: DayOfWeek) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSave = () => {
    // Create time slots based on selected days
    const timeSlots = selectedDays.map(day => ({
      day,
      startTime,
      endTime,
    }));

    onSave({
      ...editedCourse,
      timeSlots,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course: {course.code}</DialogTitle>
          <DialogDescription>
            Set the schedule, instructor, and room for this course.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label>Course</Label>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              <span className="font-semibold">{editedCourse.code}</span> - {editedCourse.title}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Days</Label>
            <div className="flex flex-wrap gap-4">
              {DAYS.map(day => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={selectedDays.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <Label htmlFor={`day-${day}`} className="cursor-pointer">
                    {day.charAt(0)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Instructor</Label>
            <Select
              value={editedCourse.instructor}
              onValueChange={(value) => setEditedCourse({ ...editedCourse, instructor: value as Faculty })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FACULTY.map(faculty => (
                  <SelectItem key={faculty} value={faculty}>{faculty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Room</Label>
            <Select
              value={editedCourse.room}
              onValueChange={(value) => setEditedCourse({ ...editedCourse, room: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROOMS.map(room => (
                  <SelectItem key={room} value={room}>{room}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
