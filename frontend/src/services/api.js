const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function apiCall(endpoint, method = 'GET', body = null, userId = null, extraHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };
  if (userId) headers['x-user-id'] = String(userId);
  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);
  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const err = new Error(error.message || 'API Error');
    err.status = response.status;
    throw err;
  }
  return response.json();
}

export const walletAPI = {
  getByUser: (userId, role) => {
    const r = role || 'freelancer';
    return apiCall(`/wallets/user/${userId}?role=${r}`, 'GET', null, userId, { 'x-user-role': r });
  },
  fund: (userId, amount, role) => {
    const r = role || 'freelancer';
    return apiCall('/wallets/fund', 'POST', { user_id: userId, amount, role: r }, userId, { 'x-user-role': r });
  },
  tryGetByUser: async (userId, role) => {
    try {
      const r = role || 'freelancer';
      return await apiCall(`/wallets/user/${userId}?role=${r}`, 'GET', null, userId, { 'x-user-role': r });
    } catch (e) {
      if (e?.status === 404) return null;
      throw e;
    }
  },
};

export const paymentMethodsAPI = {
  getAll: (userId) => apiCall(`/payment-methods?user_id=${userId}`),
  create: (userId, data) => apiCall('/payment-methods', 'POST', { ...data, user_id: userId }, userId),
  setDefault: (id, userId) => apiCall(`/payment-methods/${id}/set-default`, 'PATCH', { user_id: userId }, userId),
  delete: (id, userId) => apiCall(`/payment-methods/${id}`, 'DELETE', null, userId),
};

export const withdrawalsAPI = {
  getAll: () => apiCall('/withdrawals'),
  getOne: (id) => apiCall(`/withdrawals/${id}`),
  create: (userId, data) => apiCall('/withdrawals', 'POST', data, userId),
  approve: (id, userId) => apiCall(`/withdrawals/${id}/approve`, 'PATCH', null, userId),
  reject: (id, userId, note) => apiCall(`/withdrawals/${id}/reject`, 'PATCH', { admin_note: note }, userId),
};

export const transactionsAPI = {
  getAll: (walletId) => apiCall(`/transactions?wallet_id=${walletId}`),
  getOne: (id) => apiCall(`/transactions/${id}`),
};

export const escrowAPI = {
  getAll: () => apiCall('/escrow'),
  getOne: (id) => apiCall(`/escrow/${id}`),
  getByProject: (projectId) => apiCall(`/escrow/project/${projectId}`),
  create: (userId, data) => apiCall('/escrow', 'POST', data, userId),
  fund: (id, userId, amount) => apiCall(`/escrow/${id}/fund`, 'POST', { amount }, userId),
  freeze: (id, userId) => apiCall(`/escrow/${id}/freeze`, 'POST', null, userId),
  close: (id, userId) => apiCall(`/escrow/${id}/close`, 'POST', null, userId),
};

export const milestonePaymentsAPI = {
  getAll: (escrowId) => apiCall(`/milestone-payments?escrow_id=${escrowId}`),
  getOne: (id) => apiCall(`/milestone-payments/${id}`),
  create: (userId, data) => apiCall('/milestone-payments', 'POST', data, userId),
  approve: (id, userId) => apiCall(`/milestone-payments/${id}/approve`, 'PATCH', null, userId),
  reject: (id, userId) => apiCall(`/milestone-payments/${id}/reject`, 'PATCH', null, userId),
  release: (id, userId) => apiCall(`/milestone-payments/${id}/release`, 'PATCH', null, userId),
};

export const invoicesAPI = {
  getAll: (userId) => apiCall(`/invoices?user_id=${userId}`),
  getOne: (id) => apiCall(`/invoices/${id}`),
  create: (data) => apiCall('/invoices', 'POST', data),
};

export const refundsAPI = {
  getAll: () => apiCall('/refunds'),
  getOne: (id) => apiCall(`/refunds/${id}`),
  create: (userId, data) => apiCall('/refunds', 'POST', data, userId),
  approve: (id, userId) => apiCall(`/refunds/${id}/approve`, 'PATCH', { admin_id: userId }, userId),
  reject: (id, userId) => apiCall(`/refunds/${id}/reject`, 'PATCH', { admin_id: userId }, userId),
};

export const currencyAPI = {
  getAll: () => apiCall('/currency'),
  getRate: (base, target) => apiCall(`/currency/rate?base=${base}&target=${target}`),
  create: (userId, data, adminKey) => apiCall('/currency', 'POST', data, userId, adminKey ? { 'x-admin-key': adminKey } : {}),
};

export const notificationsAPI = {
  getAll: (userId) => apiCall(`/notifications?recipient_id=${userId}`),
  markRead: (id) => apiCall(`/notifications/${id}/read`, 'PATCH'),
};