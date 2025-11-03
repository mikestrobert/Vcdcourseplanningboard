import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Course, DayOfWeek, TIME_SLOTS } from '../types/course';

interface DayColumnProps {
  day: DayOfWeek;
  cellHeight: number;
  onDropCourse: (course: Course, day: DayOfWeek, time: string) => void;
  children: React.ReactNode;
}

export function DayColumn({ day, cellHeight, onDropCourse, children }: DayColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'COURSE',
    drop: (item: Course, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || !columnRef.current) return;

      // Get the drop position relative to the column
      const columnRect = columnRef.current.getBoundingClientRect();
      const relativeY = offset.y - columnRect.top;

      // Calculate which time slot this corresponds to
      const slotIndex = Math.floor(relativeY / cellHeight);
      const clampedIndex = Math.max(0, Math.min(slotIndex, TIME_SLOTS.length - 1));
      const time = TIME_SLOTS[clampedIndex];

      onDropCourse(item, day, time);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        columnRef.current = node;
        drop(node);
      }}
      className={`relative transition-colors ${
        isOver && canDrop ? 'bg-blue-50/50' : ''
      }`}
    >
      {children}
    </div>
  );
}
