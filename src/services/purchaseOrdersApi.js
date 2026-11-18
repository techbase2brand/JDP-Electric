import axios from 'axios';
import {store} from '../redux/store';
import {TIMER_API_URL, TIMER_EXTRA_HEADERS} from '../config/timerConfig';

// Same backend (and temporary ngrok URL/headers) as the real-time timer API.
const http = axios.create({
  baseURL: TIMER_API_URL,
  timeout: 15000,
  headers: {...TIMER_EXTRA_HEADERS},
});

/**
 * Purchase orders of ONE job, newest first.
 * Returns {orders, total, page, limit}. 404 = no orders. 401 sends the user to login.
 */
export const getJobOrdersForMobile = async (jobId, {page = 1, limit = 50} = {}) => {
  const token = store.getState()?.user?.token;
  try {
    const res = await http.get(`/orders/getJobOrdersForMobile/${jobId}`, {
      params: {page, limit},
      headers: {Authorization: `Bearer ${token}`},
    });
    const d = res.data?.data || {};
    // never show another job's orders
    if (d.jobId != null && String(d.jobId) !== String(jobId)) {
      return {orders: [], total: 0, page, limit};
    }
    const orders = Array.isArray(d.orders) ? d.orders : [];
    return {
      orders,
      total: Number.isFinite(d.total) ? d.total : orders.length,
      page: d.page ?? page,
      limit: d.limit ?? limit,
    };
  } catch (e) {
    if (e.response) {
      if (e.response.status === 401 && global.handleLogout) {
        global.handleLogout();
      }
      if (e.response.status === 404) {
        return {orders: [], total: 0, page, limit};
      }
      const err = new Error(e.response.data?.message || e.message || 'Something went wrong');
      err.status = e.response.status;
      throw err;
    }
    const err = new Error('No internet connection');
    err.isNetwork = true;
    throw err;
  }
};
