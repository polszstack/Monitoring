// User and Authentication Types
export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: 'admin' | 'teacher' | 'staff';
  teacher_id: number | null;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Teacher Types
export interface Teacher {
  id: number;
  user_id: number;
  employee_id: string;
  department: string;
  position: string;
  contact_number: string;
  address: string;
  full_name: string;
  email: string;
  username: string;
}

// Schedule Types
export interface ScheduleTemplate {
  id: number;
  teacher_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject: string;
  room: string;
  grade_level: string;
  section: string;
  teacher_name?: string;
  employee_id?: string;
  department?: string;
}

export interface CreateSchedulePayload {
  teacher_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject: string;
  room?: string;
  grade_level?: string;
  section?: string;
}

// Attendance Types
export interface DailyAttendance {
  id: number;
  schedule_template_id: number;
  teacher_id: number;
  attendance_date: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject: string;
  room: string;
  grade_level: string;
  section: string;
  attendance_status: 'pending' | 'present' | 'absent' | 'late' | 'excused';
  time_marked: string | null;
  remarks: string | null;
  marked_by: number | null;
  teacher_name?: string;
  employee_id?: string;
  department?: string;
  marked_by_name?: string;
}

export interface AttendanceStatistics {
  total_schedules: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  pending_count: number;
}

export interface DailySheetResponse {
  attendance_sheet: DailyAttendance[];
  statistics: AttendanceStatistics;
  date: string;
}

export interface MarkAttendancePayload {
  attendance_id: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

export interface BulkAttendancePayload {
  attendance_records: {
    id: number;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
  }[];
}

export interface AttendanceReport {
  teacher_id: number;
  employee_id: string;
  teacher_name: string;
  department: string;
  total_classes: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  attendance_percentage: number;
}

export interface OverallStatistics {
  total_days: number;
  total_records: number;
  total_present: number;
  total_absent: number;
}

export interface AttendanceReportResponse {
  teacher_report: AttendanceReport[];
  overall_statistics: OverallStatistics;
  date_range: {
    from: string;
    to: string;
  };
}

// Visitor Types
export interface VisitorLog {
  id: number;
  visitor_name: string;
  contact_number: string;
  email: string;
  purpose_of_visit: string;
  person_to_visit: string;
  department: string;
  check_in_time: string;
  check_out_time: string | null;
  id_proof_type: string;
  id_proof_number: string;
  vehicle_number: string;
  badge_number: string;
  status: 'checked_in' | 'checked_out';
  notes: string;
}

export interface VisitorCheckInPayload {
  visitor_name: string;
  contact_number?: string;
  email?: string;
  purpose_of_visit: string;
  person_to_visit: string;
  department?: string;
  id_proof_type?: string;
  id_proof_number?: string;
  vehicle_number?: string;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Navigation Types
export interface NavigationItem {
  name: string;
  path: string;
  icon: string;
  requiredRole?: 'admin' | 'teacher' | 'staff';
}