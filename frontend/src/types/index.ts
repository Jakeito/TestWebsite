export interface User {
  id: number;
  email: string;
  username: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ResumeSection {
  id: number;
  section_type: string;
  title: string;
  subtitle?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CarBuildEntry {
  id: number;
  title: string;
  description: string;
  date: string;
  category?: string;
  cost?: number;
  image_urls?: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmissionForm {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactSubmission extends ContactSubmissionForm {
  id: number;
  is_read: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
