import React, { useState, useEffect } from 'react';
import {
  BadgePercent,
  Receipt,
  Layers,
  Settings as SettingsIcon,
  Save,
  CheckCircle2,
  Calculator,
  Plus,
  HelpCircle,
  TrendingUp,
  CreditCard,
  Percent,
  DollarSign,
  Info,
} from 'lucide-react';
import api from '../services/api';
import { PricingConfig } from '../types';

interface PricingCommissionScreenProps {
  initialSubtab?: string;
}

export const PricingCommissionScreen: React.FC<PricingCommissionScreenProps> = ({
  initialSubtab = 'rules',
}) => {
  const [activeSubtab, setActiveSubtab] = useState<'rules' | 'fees' | 'services' | 'settings'>('rules');
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Calculator state
  const [calcOrderValue, setCalcOrderValue] = useState<number>(350);

  useEffect(() => {
    if (initialSubtab === 'settings') setActiveSubtab('settings');
    else if (initialSubtab === 'fees') setActiveSubtab('fees');
    else if (initialSubtab === 'services') setActiveSubtab('services');
    else setActiveSubtab('rules');
  }, [initialSubtab]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await api.getPricingConfig();
      setConfig(res);
    } catch (err) {
      console.error('Failed to load pricing config', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    if (!config) return;
    try {
      setSaving(true);
      await api.savePricingConfig(config);
      setSuccessMessage('Pricing and commission rules successfully saved to DynamoDB.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  // Calculator calculations
  const calculateCommission = (val: number) => {
    if (!config) return { rate: 10, commission: 35, merchantEarns: 315 };
    if (val < (config.waiverThreshold || 100)) {
      return { rate: 0, commission: 0, merchantEarns: val };
    }
    const rate = config.commissionRate || 10;
    const rawComm = Math.round((val * rate) / 100);
    const comm = Math.max(rawComm, config.minCommission || 20);
    return { rate, commission: comm, merchantEarns: Math.max(0, val - comm) };
  };

  const calcResult = calculateCommission(calcOrderValue);

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Toast Notification */}
      {successMessage && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#065F46', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Subtabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { id: 'rules', label: 'Commission Rules', icon: BadgePercent },
            { id: 'fees', label: 'Platform Fees', icon: Receipt },
            { id: 'services', label: 'Service Pricing', icon: Layers },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubtab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubtab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 8,
                  backgroundColor: isActive ? '#5000F6' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  border: isActive ? '1px solid #5000F6' : '1px solid #E2E8F0',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(80,0,246,0.25)' : 'none',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Save Button */}
        <button
          disabled={saving || !config}
          onClick={handleSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 18px',
            borderRadius: 8,
            backgroundColor: '#5000F6',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: 13,
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(80,0,246,0.25)',
          }}
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#64748B' }}>
          Loading real pricing configuration from DynamoDB...
        </div>
      ) : !config ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#EF4444' }}>
          Failed to load pricing configuration.
        </div>
      ) : (
        <>
          {/* ===================== TAB 1: COMMISSION RULES ===================== */}
          {activeSubtab === 'rules' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Active Commission Rate</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#5000F6', marginTop: 6 }}>
                    {config.commissionRate}%
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Standard cut across all print shops</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Min Commission Floor</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
                    ₹{config.minCommission}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Guaranteed platform fee per paid order</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Micro-Order Waiver Threshold</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#10B981', marginTop: 6 }}>
                    &lt; ₹{config.waiverThreshold}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>0% platform cut to support tiny student prints</div>
                </div>
              </div>

              {/* Commission Rule Configuration Card */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Commission Rule Configuration
                </h3>
                <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 20px' }}>
                  Define how platform commission is automatically calculated for merchant orders.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      Commission Type
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid #E2E8F0',
                        fontSize: 13,
                        outline: 'none',
                        backgroundColor: '#F8FAFC',
                      }}
                    >
                      <option>Percentage of Order Value</option>
                      <option>Fixed Flat Rate per Order</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      Default Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      value={config.commissionRate}
                      onChange={(e) => setConfig({ ...config, commissionRate: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid #E2E8F0',
                        fontSize: 13,
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      Minimum Commission (₹)
                    </label>
                    <input
                      type="number"
                      value={config.minCommission}
                      onChange={(e) => setConfig({ ...config, minCommission: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid #E2E8F0',
                        fontSize: 13,
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Commission Tiers Table + Interactive Calculator Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                {/* Tiers Table */}
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Commission Tiers</h4>
                      <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                        Incentivize higher order volumes by adjusting tiered commission.
                      </p>
                    </div>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>#</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Order Value (₹)</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Rate</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Min Comm.</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {config.commissionTiers.map((tier) => (
                        <tr key={tier.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '10px 12px', color: '#64748B' }}>{tier.id}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0F172A' }}>{tier.range}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: '#5000F6' }}>{tier.rate}</td>
                          <td style={{ padding: '10px 12px', color: '#475569' }}>{tier.min}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 700,
                                backgroundColor: '#ECFDF5',
                                color: '#059669',
                              }}
                            >
                              {tier.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Interactive Commission Simulator */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <Calculator size={18} color="#5000F6" />
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        Commission Calculator
                      </h4>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px' }}>
                      Test live calculations for any order value.
                    </p>

                    <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                      Sample Order Value (₹)
                    </label>
                    <input
                      type="number"
                      value={calcOrderValue}
                      onChange={(e) => setCalcOrderValue(Number(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid #E2E8F0',
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#0F172A',
                        marginTop: 6,
                        marginBottom: 16,
                        outline: 'none',
                      }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                        <span>Effective Rate:</span>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>{calcResult.rate}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                        <span>Platform Commission:</span>
                        <span style={{ fontWeight: 700, color: '#5000F6' }}>₹{calcResult.commission}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                        <span>Merchant Net Payout:</span>
                        <span style={{ fontWeight: 700, color: '#10B981' }}>₹{calcResult.merchantEarns}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      marginTop: 16,
                      fontSize: 11,
                      color: '#64748B',
                      lineHeight: 1.4,
                    }}
                  >
                    Merchant settlement is executed via UPI directly after successful customer delivery.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: PLATFORM FEES ===================== */}
          {activeSubtab === 'fees' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Standard Platform Fee</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#5000F6', marginTop: 6 }}>
                    ₹{config.platformFeeAmount}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Added to eligible customer orders</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Eligible Orders Threshold</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
                    ≥ ₹{config.platformFeeMinOrder}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Orders below this pay ₹0 fee</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Fee Status</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#10B981', marginTop: 6 }}>
                    {config.platformFeeEnabled ? 'Active' : 'Disabled'}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Applied transparently at checkout</div>
                </div>
              </div>

              {/* Platform Fee Configuration */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                      Platform Fee Configuration
                    </h3>
                    <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0' }}>
                      Set the convenience fee charged to customers per print checkout.
                    </p>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={config.platformFeeEnabled}
                      onChange={(e) => setConfig({ ...config, platformFeeEnabled: e.target.checked })}
                    />
                    <span>Enable Platform Fee</span>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      Fee Type
                    </label>
                    <select
                      value={config.platformFeeType}
                      onChange={(e) => setConfig({ ...config, platformFeeType: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                    >
                      <option>Fixed Fee</option>
                      <option>Percentage</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      Fee Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={config.platformFeeAmount}
                      onChange={(e) => setConfig({ ...config, platformFeeAmount: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      Minimum Order to Apply (₹)
                    </label>
                    <input
                      type="number"
                      value={config.platformFeeMinOrder}
                      onChange={(e) => setConfig({ ...config, platformFeeMinOrder: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                    />
                  </div>
                </div>
              </div>

              {/* Rules Table & Checkout Preview */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                {/* Rules Table */}
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 12px' }}>
                    Platform Fee Rules
                  </h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>#</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Condition</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Fee</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Applies To</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {config.platformFeeRules.map((rule) => (
                        <tr key={rule.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '10px 12px', color: '#64748B' }}>{rule.id}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0F172A' }}>{rule.condition}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: '#5000F6' }}>{rule.fee}</td>
                          <td style={{ padding: '10px 12px', color: '#475569' }}>{rule.appliesTo}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, backgroundColor: '#ECFDF5', color: '#059669' }}>
                              {rule.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Checkout Bill Breakdown Simulation */}
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>
                    Customer Bill Preview
                  </h4>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px' }}>
                    Visual checkout display presented in Mobile App.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>Document Prints (15 pgs)</span>
                      <span>₹120.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5000F6', fontWeight: 600 }}>
                      <span>Platform Convenience Fee</span>
                      <span>+ ₹{config.platformFeeAmount}.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>GST (18% on platform fee)</span>
                      <span>+ ₹3.60</span>
                    </div>
                    <div style={{ height: 1, backgroundColor: '#E2E8F0', margin: '4px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 15, color: '#0F172A' }}>
                      <span>Total Amount Paid</span>
                      <span>₹{(120 + config.platformFeeAmount + 3.6).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: SERVICE PRICING ===================== */}
          {activeSubtab === 'services' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Active Print Services</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>5 Services</div>
                  <div style={{ fontSize: 11, color: '#10B981', marginTop: 4 }}>Standard prints active</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Standard A4 B&W Floor</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#5000F6', marginTop: 6 }}>₹2.00 / pg</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Competitive market pricing</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Colour Print Range</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>₹6 - ₹10</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Per single-sided A4 sheet</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Avg. Platform Share</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#10B981', marginTop: 6 }}>10%</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Unified flat rate</div>
                </div>
              </div>

              {/* Service Categories and Rates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
                {/* Left Categories List */}
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 12px' }}>
                    Service Offerings
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {config.serviceCategories.map((cat) => (
                      <div
                        key={cat.id}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 8,
                          backgroundColor: cat.active ? '#EEF2FF' : '#F8FAFC',
                          border: cat.active ? '1px solid #5000F6' : '1px solid #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: cat.active ? '#5000F6' : '#64748B' }}>
                            {cat.name}
                          </div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>Commission: {cat.commission}</div>
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '2px 6px',
                            borderRadius: 4,
                            backgroundColor: cat.active ? '#ECFDF5' : '#F1F5F9',
                            color: cat.active ? '#059669' : '#94A3B8',
                            fontWeight: 700,
                          }}
                        >
                          {cat.active ? 'Enabled' : 'Future'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Service Pricing Table */}
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 12px' }}>
                    Standard Document Rates & Ranges
                  </h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Service</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Unit</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Price Range</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Platform Cut</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {config.servicePricing.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 12px', fontWeight: 600, color: '#0F172A' }}>{item.service}</td>
                          <td style={{ padding: '12px 12px', color: '#64748B' }}>{item.unit}</td>
                          <td style={{ padding: '12px 12px', fontWeight: 700, color: '#0F172A' }}>{item.priceRange}</td>
                          <td style={{ padding: '12px 12px', fontWeight: 700, color: '#5000F6' }}>{item.commission}</td>
                          <td style={{ padding: '12px 12px', textAlign: 'right' }}>
                            <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, backgroundColor: '#ECFDF5', color: '#059669' }}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 4: SETTINGS ===================== */}
          {activeSubtab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>
                  Global Pricing & Settlement Settings
                </h3>
                <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 20px' }}>
                  Manage currency, rounding, merchant price overrides, and automated GST invoice rules.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      Default Pricing Source
                    </label>
                    <select
                      value={config.globalSettings.defaultPricingSource}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          globalSettings: { ...config.globalSettings, defaultPricingSource: e.target.value },
                        })
                      }
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                    >
                      <option>Merchant Price</option>
                      <option>Platform Global Standard</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      Price Visibility (Customer)
                    </label>
                    <select
                      value={config.globalSettings.priceVisibility}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          globalSettings: { ...config.globalSettings, priceVisibility: e.target.value },
                        })
                      }
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                    >
                      <option>Price Range (Min - Max)</option>
                      <option>Exact Shop Price</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      Currency
                    </label>
                    <input
                      type="text"
                      disabled
                      value={config.globalSettings.currency}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, backgroundColor: '#F8FAFC' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      GST Tax Rate on Platform Fees
                    </label>
                    <input
                      type="text"
                      value={config.globalSettings.gstRate}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          globalSettings: { ...config.globalSettings, gstRate: e.target.value },
                        })
                      }
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={config.globalSettings.allowMerchantCustomPricing}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          globalSettings: { ...config.globalSettings, allowMerchantCustomPricing: e.target.checked },
                        })
                      }
                    />
                    <span>Allow Merchants to configure custom page rates within range</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={config.globalSettings.autoInvoiceGeneration}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          globalSettings: { ...config.globalSettings, autoInvoiceGeneration: e.target.checked },
                        })
                      }
                    />
                    <span>Generate automated digital GST invoice on completed print delivery</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
