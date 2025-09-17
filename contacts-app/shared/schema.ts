import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Access code is required"),
});

export const addContactSchema = z.object({
  contact: z.string().min(1, "Contact name is required"),
  userId: z.number().min(1, "Valid user ID is required"),
});

export const searchContactsSchema = z.object({
  search: z.string(),
  userId: z.number().min(1, "Valid user ID is required"),
});

export const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),  
  login: z.string().min(3, "User ID must be at least 3 characters").max(50, "User ID too long"),
  password: z.string().min(6, "Access code must be at least 6 characters").max(100, "Access code too long"),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type AddContactRequest = z.infer<typeof addContactSchema>;
export type SearchContactsRequest = z.infer<typeof searchContactsSchema>;
export type SignupRequest = z.infer<typeof signupSchema>;

export interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
  error: string;
}

export interface AddContactResponse {
  error: string;
}

export interface SearchContactsResponse {
  results: string[];
  error: string;
}

export interface SignupResponse {
  id: number;
  firstName: string;
  lastName: string;
  error: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}
