export interface User {
  id: number
  username: string
  email: string
  full_name: string
  role: 'admin' | 'teacher' | 'staff'
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface Teacher {
  id: number
  user_id: number
  employee_id: string
  department: string | null
  position: string | null
  contact_number: string | null
  address: string | null
  full_name: string
  email: string
  username: string
  user_status: string
}

export interface ScheduleTemplate {
  id: number
  teacher_id: number
  day_of_week: string
  start_time: string
  end_time: string
  subject: string
  room: string | null
  grade_level: string | null
  section: string | null
  teacher_name?: string
  employee_id?: string
}

export interface DailyAttendance {
  id: number
  schedule_template_id: number | null
  teacher_id: number
  attendance_date: string
  day_of_week: string
  start_time: string
  end_time: string
  subject: string
  room: string | null
  grade_level: string | null
  section: string | null
  attendance_status: 'pending' | 'present' | 'absent' | 'late' | 'excused'
  time_marked: string | null
  remarks: string | null
  marked_by: number | null
  teacher_name?: string
  employee_id?: string
}

export interface FacilityInventory {
  id: number
  item_code: string
  item_name: string
  category: 'furniture' | 'electrical' | 'plumbing' | 'electronics' | 'structural' | 'other'
  description: string | null
  location: string | null
  room_number: string | null
  quantity: number
  condition_status: 'good' | 'fair' | 'poor' | 'broken'
  purchase_date: string | null
  purchase_cost: number | null
  last_maintenance_date: string | null
  notes: string | null
}

export interface FacilityReport {
  id: number
  report_number: string
  facility_type: string
  item_name: string
  item_description: string | null
  location: string
  room_number: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'reported' | 'in_progress' | 'fixed' | 'cannot_fix' | 'cancelled'
  reported_by: number
  assigned_to: number | null
  reported_date: string
  fixed_date: string | null
  cost_estimate: number | null
  actual_cost: number | null
  notes: string | null
  image_path: string | null
  is_archived?: boolean | number
  reporter_name?: string
  assignee_name?: string
}

export interface VisitorLog {
  id: number
  visitor_name: string
  contact_number: string | null
  email: string | null
  purpose_of_visit: string
  person_to_visit: string | null
  department: string | null
  check_in_time: string
  check_out_time: string | null
  id_proof_type: string | null
  id_proof_number: string | null
  vehicle_number: string | null
  badge_number: string | null
  status: 'checked_in' | 'checked_out'
  notes: string | null
  is_archived?: boolean | number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}