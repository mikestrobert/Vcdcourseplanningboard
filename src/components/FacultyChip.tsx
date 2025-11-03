import { useDrag } from 'react-dnd';
import { Faculty, FACULTY_COLORS } from '../types/course';
import { User } from 'lucide-react';

interface FacultyChipProps {
  name: Faculty;
  courseCount?: number;
}

export function FacultyChip({ name, courseCount }: FacultyChipProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FACULTY',
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const colorClass = FACULTY_COLORS[name];

  return (
    <div
      ref={drag}
      className={`${colorClass} border-2 rounded-full px-4 py-2 cursor-move inline-flex items-center gap-2 transition-all hover:shadow-md ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <User className="w-4 h-4" />
      <span className="text-sm">{name} {courseCount !== undefined && `(${courseCount})`}</span>
    </div>
  );
}
