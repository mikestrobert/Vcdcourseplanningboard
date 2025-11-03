import { Course } from '../types/course';

export const INITIAL_COURSES: Course[] = [
  // Confirmed courses
  {
    id: 'vcde-707',
    code: 'VCDE-707',
    title: 'Web and UI Design',
    instructor: 'Mike Strobert',
    room: '07-1315',
    timeSlots: [
      { day: 'Tuesday', startTime: '11:00', endTime: '13:50' },
      { day: 'Thursday', startTime: '11:00', endTime: '12:50' }
    ],
    status: 'confirmed'
  },
  {
    id: 'vcde-708',
    code: 'VCDE-708',
    title: 'Typography',
    instructor: 'Anne Jordan',
    room: '07-1320',
    timeSlots: [
      { day: 'Monday', startTime: '14:00', endTime: '16:50' }
    ],
    status: 'confirmed'
  },
  {
    id: 'vcde-711',
    code: 'VCDE-711',
    title: 'Design Methodology',
    instructor: 'Dan DeLuna',
    room: '07-1425',
    timeSlots: [
      { day: 'Wednesday', startTime: '09:00', endTime: '11:50' }
    ],
    status: 'confirmed'
  },
  {
    id: 'vcde-723',
    code: 'VCDE-723',
    title: 'Interaction Design',
    instructor: 'Adam Smith',
    room: '07-1315',
    timeSlots: [
      { day: 'Thursday', startTime: '14:00', endTime: '16:50' }
    ],
    status: 'confirmed'
  },
  {
    id: 'vcde-728',
    code: 'VCDE-728',
    title: 'Motion Graphics',
    instructor: 'Peter Byrne',
    room: '07-1420',
    timeSlots: [
      { day: 'Tuesday', startTime: '09:00', endTime: '11:50' }
    ],
    status: 'confirmed'
  },
  {
    id: 'vcde-722',
    code: 'VCDE-722',
    title: 'Design Praxis I',
    instructor: 'Mike Strobert',
    room: '07-1325',
    timeSlots: [
      { day: 'Friday', startTime: '10:00', endTime: '12:50' }
    ],
    status: 'confirmed'
  },
  // Tentative courses
  {
    id: 'vcde-709',
    code: 'VCDE-709',
    title: 'Digital Design in Motion',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'tentative'
  },
  {
    id: 'vcde-717',
    code: 'VCDE-717',
    title: 'Design Systems',
    instructor: 'Anne Jordan',
    room: 'TBD',
    timeSlots: [],
    status: 'tentative'
  },
  {
    id: 'vcde-732',
    code: 'VCDE-732',
    title: 'Branding and Identity Design',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'tentative'
  },
  {
    id: 'vcde-742',
    code: 'VCDE-742',
    title: 'Information Design',
    instructor: 'Dan DeLuna',
    room: 'TBD',
    timeSlots: [],
    status: 'tentative'
  },
  // Backlog courses
  {
    id: 'vcde-701',
    code: 'VCDE-701',
    title: 'Design History Seminar',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'backlog'
  },
  {
    id: 'vcde-706',
    code: 'VCDE-706',
    title: '3D Modeling and Motion',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'backlog'
  },
  {
    id: 'vcde-712',
    code: 'VCDE-712',
    title: 'Design Studies Seminar',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'backlog'
  },
  {
    id: 'vcde-718',
    code: 'VCDE-718',
    title: 'Project Design and Implementation',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'backlog'
  },
  {
    id: 'vcde-726',
    code: 'VCDE-726',
    title: 'Design Praxis II',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'backlog'
  },
  {
    id: 'vcde-731',
    code: 'VCDE-731',
    title: '3D Visual Design',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'backlog'
  },
  {
    id: 'vcde-733',
    code: 'VCDE-733',
    title: 'Digital Media Integration',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'backlog'
  },
  {
    id: 'vcde-746',
    code: 'VCDE-746',
    title: 'Professional Practices',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'backlog'
  },
  {
    id: 'vcde-763',
    code: 'VCDE-763',
    title: 'Graphic Design Education Seminar',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'backlog'
  },
  {
    id: 'vcde-790',
    code: 'VCDE-790',
    title: 'Thesis: Research and Planning',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'backlog'
  },
  {
    id: 'vcde-799',
    code: 'VCDE-799',
    title: 'Independent Study',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'backlog'
  },
  {
    id: 'vcde-887',
    code: 'VCDE-887',
    title: 'Part-Time Co-op',
    instructor: 'TBD',
    room: 'TBD',
    timeSlots: [],
    status: 'backlog'
  },
];
