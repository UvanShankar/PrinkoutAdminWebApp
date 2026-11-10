import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  Printer,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  FileText,
  User,
  Store,
} from 'lucide-react';
import api from '../services/api';
import { OrderItem } from '../types';
import { Drawer } from '../components/Drawer';

export const OrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getAllOrders();
      setOrders(res || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerMobile.includes(search) ||
      o.shopName.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return o.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusColor = (st: string) => {
    const s = st.toLowerCase();
    if (s === 'completed' || s === 'delivered') return { bg: '#ECFDF5', text: '#059669' };
    if (s === 'printing' || s === 'ready' || s === 'in_progress' || s === 'accepted') return { bg: '#EFF6FF', text: '#2563EB' };
    if (s === 'cancelled' || s === 'rejected') return { bg: '#FEF2F2', text: '#DC2626' };
    return { bg: '#FEF3C7', text: '#D97706' };
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        {/* Status Chips */}
        <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: 3, borderRadius: 8, gap: 4 }}>
          {[
            { id: 'all', label: `All Orders (${orders.length})` },
            { id: 'pending', label: 'Pending' },
            { id: 'printing', label: 'Printing' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: statusFilter === tab.id ? '#FFFFFF' : 'transparent',
                color: statusFilter === tab.id ? '#0F172A' : '#64748B',
                fontWeight: statusFilter === tab.id ? 700 : 500,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: statusFilter === tab.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '6px 12px',
              width: 280,
            }}
          >
            <Search size={14} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search order ID, shop, user, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: 12,
                color: '#0F172A',
                width: '100%',
                background: 'transparent',
              }}
            />
          </div>

          <button
            onClick={fetchOrders}
            title="Refresh Live Orders"
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 20px' }}>Order ID</th>
              <th style={{ padding: '12px 16px' }}>Print Shop</th>
              <th style={{ padding: '12px 16px' }}>Customer</th>
              <th style={{ padding: '12px 16px' }}>Specs / Service</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Timestamp</th>
              <th style={{ padding: '12px 20px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ padding: 48, textAlign: 'center', color: '#64748B' }}>
                  Loading live orders from DynamoDB...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 48, textAlign: 'center', color: '#94A3B8' }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => {
                const color = getStatusColor(ord.status);
                return (
                  <tr
                    key={ord.orderId}
                    onClick={() => setSelectedOrder(ord)}
                    style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background-color 0.1s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#5000F6', fontFamily: 'monospace' }}>
                      {ord.orderId.length > 18 ? `${ord.orderId.slice(0, 15)}...` : ord.orderId}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0F172A' }}>
                      {ord.shopName}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>
                      <div>{ord.customerName}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{ord.customerMobile}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>
                      <div>{ord.serviceType}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>
                        {ord.pages} pgs • {ord.copies} copy • {ord.color}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#0F172A' }}>
                      ₹{ord.totalPrice.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor: color.bg,
                          color: color.text,
                          textTransform: 'capitalize',
                        }}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748B', fontSize: 12 }}>
                      {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(ord);
                        }}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 6,
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#FFFFFF',
                          color: '#5000F6',
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Drawer */}
      <Drawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder?.orderId || 'Order Details'}
        subtitle={`Placed on ${selectedOrder ? new Date(selectedOrder.createdAt).toLocaleString() : ''}`}
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Status & Price Banner */}
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Total Order Value</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                  ₹{selectedOrder.totalPrice.toLocaleString()}
                </div>
              </div>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  backgroundColor: getStatusColor(selectedOrder.status).bg,
                  color: getStatusColor(selectedOrder.status).text,
                  textTransform: 'capitalize',
                }}
              >
                {selectedOrder.status}
              </span>
            </div>

            {/* Print Shop & Customer details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Fulfilling Shop:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedOrder.shopName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Customer:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedOrder.customerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Contact Phone:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedOrder.customerMobile}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Service:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedOrder.serviceType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Print Specs:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>
                  {selectedOrder.pages} Pages, {selectedOrder.copies} Copies ({selectedOrder.color})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Paper Option:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedOrder.paperType}</span>
              </div>
            </div>

            {/* Document File Card */}
            {selectedOrder.fileUrl && (
              <div
                style={{
                  padding: 14,
                  borderRadius: 8,
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={18} color="#5000F6" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                      {selectedOrder.fileName || 'Document.pdf'}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Customer Uploaded PDF</div>
                  </div>
                </div>
                <a
                  href={selectedOrder.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    backgroundColor: '#5000F6',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Download
                </a>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};
