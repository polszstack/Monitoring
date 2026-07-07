import type { Request } from 'express';

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'staff';
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface Teacher {
  id: number;
  user_id: number | null;
  employee_id: string;
  department: string | null;
  position: string | null;
  contact_number: string | null;
  address: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ScheduleTemplate {
  id: number;
  teacher_id: number;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string;
  end_time: string;
  subject: string;
  room: string | null;
  grade_level: string | null;
  section: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DailyAttendance {
  id: number;
  schedule_template_id: number | null;
  teacher_id: number;
  attendance_date: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject: string;
  room: string | null;
  grade_level: string | null;
  section: string | null;
  attendance_status: 'pending' | 'present' | 'absent' | 'late' | 'excused';
  time_marked: string | null;
  remarks: string | null;
  marked_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface FacilityInventory {
  id: number;
  item_code: string;
  item_name: string;
  category: 'furniture' | 'electrical' | 'plumbing' | 'electronics' | 'structural' | 'other';
  description: string | null;
  location: string | null;
  room_number: string | null;
  quantity: number;
  condition_status: 'good' | 'fair' | 'poor' | 'broken';
  purchase_date: string | null;
  purchase_cost: number | null;
  last_maintenance_date: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface FacilityReport {
  id: number;
  report_number: string;
  facility_type: 'furniture' | 'electrical' | 'plumbing' | 'electronics' | 'structural' | 'other';
  item_name: string;
  item_description: string | null;
  location: string;
  room_number: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'reported' | 'in_progress' | 'fixed' | 'cannot_fix' | 'cancelled';
  reported_by: number;
  assigned_to: number | null;
  reported_date: Date;
  fixed_date: Date | null;
  cost_estimate: number | null;
  actual_cost: number | null;
  notes: string | null;
  image_path: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface VisitorLog {
  id: number;
  visitor_name: string;
  contact_number: string | null;
  email: string | null;
  purpose_of_visit: string;
  person_to_visit: string | null;
  department: string | null;
  check_in_time: Date;
  check_out_time: Date | null;
  id_proof_type: string | null;
  id_proof_number: string | null;
  vehicle_number: string | null;
  badge_number: string | null;
  status: 'checked_in' | 'checked_out';
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}