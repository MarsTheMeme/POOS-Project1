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

export type LoginRequest = z.infer<typeof loginSchema>;
export type AddContactRequest = z.infer<typeof addContactSchema>;
export type SearchContactsRequest = z.infer<typeof searchContactsSchema>;

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

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}
