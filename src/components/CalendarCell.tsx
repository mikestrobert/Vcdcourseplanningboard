import { useDrop } from 'react-dnd';
import { Course, DayOfWeek } from '../types/course';

interface CalendarCellProps {
  day: DayOfWeek;
  time: string;
  onDropCourse: (course: Course, day: DayOfWeek, time: string) => void;
  cellHeight: number;
}

export function CalendarCell({ day, time, onDropCourse, cellHeight }: CalendarCellProps) {
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

  return (
    <div
      ref={drop}
      className={`border border-gray-200 transition-colors ${
        isOver && canDrop ? 'bg-blue-50 border-blue-300' : 'bg-white'
      } ${canDrop && !isOver ? 'bg-gray-50' : ''}`}
      style={{ height: `${cellHeight}px` }}
    />
  );
}
