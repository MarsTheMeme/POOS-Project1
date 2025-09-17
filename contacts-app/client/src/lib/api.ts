const API_BASE = 'http://138.197.31.239/LAMPAPI';

export async function apiCall(endpoint: string, data: any) {
  const response = await fetch(`${API_BASE}/${endpoint}.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  login: (data: { login: string; password: string }) => apiCall('Login', data),
  signup: (data: { firstName: string; lastName: string; login: string; password: string }) => apiCall('Register', data),
  addContact: (data: { contact: string; userId: number }) => apiCall('AddContact', data),
  searchContacts: (data: { search: string; userId: number }) => apiCall('SearchContacts', data),
};
