import { useState } from 'react';
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CourseCard } from './components/CourseCard';
import { FacultyChip } from './components/FacultyChip';
import { CalendarGrid } from './components/CalendarGrid';
import { EditCourseDialog } from './components/EditCourseDialog';
import { INITIAL_COURSES } from './data/courses';
import { Course, Faculty, DayOfWeek, TIME_SLOTS, DAYS } from './types/course';
import { Calendar, Clock, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Textarea } from './components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion';

const FACULTY: Faculty[] = ['Mike Strobert', 'Anne Jordan', 'Dan DeLuna', 'Adam Smith', 'Peter Byrne'];

// Simple available course card - only shows code and title
function AvailableCourseCard({ course }: { course: Course }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COURSE',
    item: course,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 bg-gray-50 rounded border border-gray-200 text-sm cursor-move hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <span className="font-semibold">{course.code}</span> - {course.title}
    </div>
  );
}

export default function App() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [notes, setNotes] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Generate the next section number for a specific course code
  const getNextSectionNumber = (courseCode: string, existingCourses: Course[]): string => {
    const existingSections = existingCourses
      .filter(c => c.code === courseCode && c.sectionNumber)
      .map(c => parseInt(c.sectionNumber || '0'))
      .sort((a, b) => b - a)
      .filter(section => !Number.isNaN(section));

    const nextNumber = existingSections.length > 0 ? existingSections[0] + 1 : 1;
    return nextNumber.toString().padStart(2, '0');
  };

  const createCourseInstance = (course: Course, day: DayOfWeek, time: string, existingCourses: Course[]): Course => {
    // Calculate end time (default 2 hour 50 min block - typical RIT class)
    const [startHour, startMinute] = time.split(':').map(Number);
    let endHour = startHour + 2;
    let endMinute = startMinute + 50;

    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute = endMinute % 60;
    }

    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    const sectionNumber = getNextSectionNumber(course.code, existingCourses);

    const uniqueSuffix =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const sanitizedCode = course.code.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const instanceId = `${sanitizedCode}-${sectionNumber}-${uniqueSuffix}`;

    return {
      ...course,
      id: instanceId,
      sectionNumber,
      timeSlots: [{ day, startTime: time, endTime }],
      room: course.room === 'TBD' ? '07-1315' : course.room,
    };
  };

  const handleDropCourse = (course: Course, day: DayOfWeek, time: string) => {
    const newInstance = createCourseInstance(course, day, time, courses);
    setEditingCourse(newInstance);
  };

  const handleSaveCourse = (updatedCourse: Course) => {
    setCourses(prevCourses => {
      const existingIndex = prevCourses.findIndex(c => c.id === updatedCourse.id);
      if (existingIndex >= 0) {
        return prevCourses.map(c => (c.id === updatedCourse.id ? updatedCourse : c));
      }
      return [...prevCourses, updatedCourse];
    });
  };

  const handleUnscheduleCourse = (course: Course) => {
    setCourses(prevCourses => {
      if (course.sectionNumber) {
        return prevCourses.filter(c => c.id !== course.id);
      }

      const updatedCourse: Course = {
        ...course,
        timeSlots: [],
      };

      return prevCourses.map(c => (c.id === course.id ? updatedCourse : c));
    });
  };

  // Scheduled courses are those with section numbers OR those with time slots
  const scheduledCourses = courses.filter(c => c.sectionNumber || c.timeSlots.length > 0);
  // Available courses are base courses (no section number and no time slots)
  const availableCourses = courses.filter(c => !c.sectionNumber && c.timeSlots.length === 0);
  
  // Get active faculty (those teaching scheduled courses) with course counts
  const activeFaculty = Array.from(new Set(scheduledCourses.map(c => c.instructor))).filter(Boolean) as Faculty[];
  const facultyCourseCount = (faculty: Faculty): number => {
    return scheduledCourses.filter(c => c.instructor === faculty && c.sectionNumber).length;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-gray-900 mb-2">VCD MFA Fall Semester Course Planning</h1>
            <p className="text-gray-600">
              Drag courses to schedule or click to edit
            </p>
          </div>

          <Tabs defaultValue="schedule" className="space-y-4">
            <TabsList>
              <TabsTrigger value="schedule">
                <Calendar className="w-4 h-4 mr-2" />
                Weekly Schedule
              </TabsTrigger>
              <TabsTrigger value="courses">
                <Clock className="w-4 h-4 mr-2" />
                Course Lists
              </TabsTrigger>
            </TabsList>

            {/* Weekly Schedule Grid */}
            <TabsContent value="schedule">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Calendar - 10 columns */}
                <div className="lg:col-span-10">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fall Semester Weekly Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <CalendarGrid
                          scheduledCourses={scheduledCourses}
                          onDropCourse={handleDropCourse}
                          onUnschedule={handleUnscheduleCourse}
                          onEdit={setEditingCourse}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar - 2 columns */}
                <div className="lg:col-span-2">
                  <Card>
                      <CardContent className="p-0">
                        <Accordion type="multiple" defaultValue={['faculty', 'active', 'available']} className="w-full">
                          {/* Faculty Section */}
                          <AccordionItem value="faculty">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>Faculty ({activeFaculty.length})</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <div className="space-y-2">
                                {activeFaculty.length > 0 ? (
                                  activeFaculty.map(faculty => (
                                    <FacultyChip key={faculty} name={faculty} courseCount={facultyCourseCount(faculty)} />
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">No active faculty</p>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Active Courses Section */}
                          <AccordionItem value="active">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Active Courses ({scheduledCourses.length})</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {scheduledCourses.length > 0 ? (
                                  scheduledCourses.map(course => (
                                    <CourseCard
                                      key={course.id}
                                      course={course}
                                      onEdit={setEditingCourse}
                                    />
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">No courses scheduled</p>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Available Courses Section */}
                          <AccordionItem value="available">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Available Courses ({availableCourses.length})</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {availableCourses.length > 0 ? (
                                  availableCourses.map(course => (
                                    <AvailableCourseCard
                                      key={course.id}
                                      course={course}
                                    />
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">All courses scheduled</p>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                </div>
              </div>
            </TabsContent>

            {/* Course Lists */}
            <TabsContent value="courses">
              <div className="grid grid-cols-2 gap-6">
                {/* Scheduled Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700">
                      Scheduled Courses ({scheduledCourses.length})
                    </CardTitle>
                    <p className="text-sm text-gray-600">Courses currently on the calendar</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {scheduledCourses.map(course => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          onEdit={setEditingCourse}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Available Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-700">
                      Available Courses ({availableCourses.length})
                    </CardTitle>
                    <p className="text-sm text-gray-600">Courses not yet scheduled</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {availableCourses.map(course => (
                        <div
                          key={course.id}
                          className="p-2 bg-gray-50 rounded border border-gray-200 text-sm"
                        >
                          <span className="font-semibold">{course.code}</span> - {course.title}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Edit Course Dialog */}
        <EditCourseDialog
          course={editingCourse}
          open={!!editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={handleSaveCourse}
        />
      </div>
    </DndProvider>
  );
}
