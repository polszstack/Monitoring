import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import type {
  ApiResponse,
  LoginCredentials,
  User,
  Teacher,
  ScheduleTemplate,
  CreateSchedulePayload,
  DailySheetResponse,
  DailyAttendance,
  MarkAttendancePayload,
  BulkAttendancePayload,
  AttendanceReportResponse,
  VisitorLog,
  VisitorCheckInPayload,
} from '@/types';

const API_BASE_URL = 'http://localhost:8000/backend';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.request<ApiResponse<T>>(config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // Generic HTTP methods
  async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, params });
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url });
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    return this.post<User>('/api/auth/login', credentials);
  }

  // Teachers
  async getTeachers(department?: string): Promise<ApiResponse<Teacher[]>> {
    const params = department ? { department } : undefined;
    return this.get<Teacher[]>('/api/teachers/get-teachers', params);
  }

  // Schedules
  async getTeacherSchedules(teacherId?: number, day?: string): Promise<ApiResponse<ScheduleTemplate[]>> {
    const params: any = {};
    if (teacherId) params.teacher_id = teacherId;
    if (day) params.day = day;
    return this.get<ScheduleTemplate[]>('/api/schedules/get-teacher-schedules', params);
  }

  async createSchedule(data: CreateSchedulePayload): Promise<ApiResponse<ScheduleTemplate>> {
    return this.post<ScheduleTemplate>('/api/schedules/create-schedule', data);
  }

  // Attendance
  async generateDailySheet(date?: string): Promise<ApiResponse<{ generated_count: number; date: string }>> {
    return this.post('/api/attendance/generate-daily-sheet', { date });
  }

  async getDailySheet(params?: {
    date?: string;
    teacher_id?: number;
    status?: string;
    department?: string;
  }): Promise<ApiResponse<DailySheetResponse>> {
    return this.get<DailySheetResponse>('/api/attendance/get-daily-sheet', params);
  }

  async markAttendance(data: MarkAttendancePayload): Promise<ApiResponse<DailyAttendance>> {
    return this.put<DailyAttendance>('/api/attendance/mark-attendance', data);
  }

  async bulkMarkAttendance(data: BulkAttendancePayload): Promise<ApiResponse<{ updated_count: number }>> {
    return this.put('/api/attendance/bulk-mark-attendance', data);
  }

  async getAttendanceReport(params?: {
    date_from?: string;
    date_to?: string;
    teacher_id?: number;
  }): Promise<ApiResponse<AttendanceReportResponse>> {
    return this.get<AttendanceReportResponse>('/api/attendance/get-attendance-report', params);
  }

  // Visitors
  async checkInVisitor(data: VisitorCheckInPayload): Promise<ApiResponse<VisitorLog>> {
    return this.post<VisitorLog>('/api/visitors/check-in', data);
  }

  async checkOutVisitor(visitorId?: number, badgeNumber?: string): Promise<ApiResponse<null>> {
    return this.put('/api/visitors/check-out', {
      visitor_id: visitorId,
      badge_number: badgeNumber,
    });
  }

  async getVisitors(params?: {
    date_from?: string;
    date_to?: string;
    status?: string;
  }): Promise<ApiResponse<VisitorLog[]>> {
    return this.get<VisitorLog[]>('/api/visitors/get-visitors', params);
  }
}

export const apiService = new ApiService();
export default apiService;