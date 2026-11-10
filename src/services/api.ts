import axios from 'axios';
import {
  OverviewAnalytics,
  RevenueAnalytics,
  OrdersAnalytics,
  MerchantsAnalytics,
  CustomersAnalytics,
  ServicesAnalytics,
  LocationsAnalytics,
  OrderItem,
  PricingConfig,
} from '../types';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL)
    ? `${(import.meta as any).env.VITE_API_BASE_URL}/api/v1`
    : 'http://localhost:5000/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Analytics
  getOverviewAnalytics: async (params?: Record<string, any>): Promise<OverviewAnalytics> => {
    const res = await client.get('/admin/analytics/overview', { params });
    return res.data.data;
  },

  getRevenueAnalytics: async (params?: Record<string, any>): Promise<RevenueAnalytics> => {
    const res = await client.get('/admin/analytics/revenue', { params });
    return res.data.data;
  },

  getOrdersAnalytics: async (params?: Record<string, any>): Promise<OrdersAnalytics> => {
    const res = await client.get('/admin/analytics/orders', { params });
    return res.data.data;
  },

  getMerchantsAnalytics: async (params?: Record<string, any>): Promise<MerchantsAnalytics> => {
    const res = await client.get('/admin/analytics/merchants', { params });
    return res.data.data;
  },

  getCustomersAnalytics: async (params?: Record<string, any>): Promise<CustomersAnalytics> => {
    const res = await client.get('/admin/analytics/customers', { params });
    return res.data.data;
  },

  getServicesAnalytics: async (params?: Record<string, any>): Promise<ServicesAnalytics> => {
    const res = await client.get('/admin/analytics/services', { params });
    return res.data.data;
  },

  getLocationsAnalytics: async (params?: Record<string, any>): Promise<LocationsAnalytics> => {
    const res = await client.get('/admin/analytics/locations', { params });
    return res.data.data;
  },

  // Live Orders
  getAllOrders: async (): Promise<OrderItem[]> => {
    const res = await client.get('/admin/orders');
    return res.data.data;
  },

  // Merchant Actions
  updateMerchantStatus: async (shopId: string, status: string): Promise<any> => {
    const res = await client.put(`/admin/merchants/${encodeURIComponent(shopId)}/status`, { status });
    return res.data.data;
  },

  // Customer Actions
  updateCustomerStatus: async (customerId: string, isBlocked: boolean): Promise<any> => {
    const res = await client.put(`/admin/customers/${encodeURIComponent(customerId)}/status`, { isBlocked });
    return res.data.data;
  },

  // Pricing Config
  getPricingConfig: async (): Promise<PricingConfig> => {
    const res = await client.get('/admin/pricing-config');
    return res.data.data;
  },

  savePricingConfig: async (config: PricingConfig): Promise<any> => {
    const res = await client.post('/admin/pricing-config', config);
    return res.data.data;
  },
};

export default api;
