export interface NavItem {
  id: 'dashboard' | 'orders' | 'merchants' | 'customers' | 'services' | 'pricing' | 'reports' | 'settings';
  label: string;
  icon: string;
  subItems?: { id: string; label: string }[];
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export interface OverviewAnalytics {
  totalOrders: number;
  totalGmv: number;
  activeMerchants: number;
  totalCustomers: number;
  prinkoutRevenue: number;
  averageOrderValue: number;
  netRevenue: number;
  repeatCustomerRate: number;
  ordersByStatus: {
    completed: number;
    inProgress: number;
    pending: number;
    cancelled: number;
  };
  topServices: {
    name: string;
    orders: number;
    pct: number;
  }[];
  orderTrend: {
    date: string;
    orders: number;
    gmv: number;
    revenue: number;
  }[];
  revenueTrend: {
    period: string;
    gmv: number;
    revenue: number;
  }[];
  keyInsights: string[];
}

export interface RevenueAnalytics {
  gmv: number;
  platformCommission: number;
  platformFees: number;
  paymentGatewayCharges: number;
  refundAmount: number;
  netPlatformEarnings: number;
  avgRevenuePerOrder: number;
  revenueTrend: {
    date: string;
    gmv: number;
    commission: number;
    fees: number;
  }[];
  revenueSummary: {
    metric: string;
    amount: number;
    change: string;
  }[];
  breakdown: {
    commission: number;
    commissionPct: number;
    platformFees: number;
    platformFeesPct: number;
  };
  keyInsights: string[];
}

export interface OrdersAnalytics {
  totalOrders: number;
  completed: number;
  completedPct: number;
  inProgress: number;
  inProgressPct: number;
  pending: number;
  pendingPct: number;
  cancelled: number;
  cancelledPct: number;
  averageOrderValue: number;
  completionRate: string;
  cancellationRate: string;
  avgPrintingTime: string;
  peakOrderTime: string;
  orderLifecycle: {
    placed: number;
    paid: number;
    printing: number;
    ready: number;
    completed: number;
  };
  recentOrders: {
    orderId: string;
    service: string;
    value: number;
    status: string;
    time: string;
    customerName: string;
  }[];
}

export interface MerchantItem {
  rank: number;
  shopId: string;
  name: string;
  ownerName: string;
  mobile: string;
  location: string;
  orders: number;
  orderValue: number;
  commission: number;
  status: 'Verified' | 'Pending' | 'Inactive';
  joinedOn: string;
  lastActive: string;
}

export interface MerchantsAnalytics {
  totalMerchants: number;
  activeMerchants: number;
  activePct: number;
  ordersPerMerchant: string;
  revenuePerMerchant: number;
  platformCommission: number;
  topMerchants: MerchantItem[];
  merchantStatus: {
    active: number;
    onboarding: number;
    inactive: number;
    blocked: number;
  };
}

export interface CustomerItem {
  id: string;
  name: string;
  mobile: string;
  location: string;
  orders: number;
  totalSpent: number;
  lastActive: string;
  status: 'Active' | 'Blocked';
  joinedOn: string;
}

export interface CustomersAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  activePct: number;
  newCustomers: number;
  repeatCustomers: number;
  repeatPct: number;
  avgOrdersPerCustomer: string;
  avgCustomerSpend: number;
  customerSegmentation: {
    oneTime: number;
    repeat: number;
    regular: number;
    power: number;
  };
  customers: CustomerItem[];
  topCustomers: CustomerItem[];
}

export interface ServicesAnalytics {
  totalOrders: number;
  totalGmv: number;
  platformRevenue: number;
  servicesBreakdown: {
    name: string;
    orders: number;
    share: number;
    gmv: number;
    growth: string;
  }[];
  popularDocumentTypes: {
    type: string;
    demand: string;
    avgPages: number;
    primaryUsers: string;
  }[];
}

export interface LocationItem {
  city: string;
  orders: number;
  gmv: number;
  merchants: number;
  revenue: number;
  share: number;
}

export interface LocationsAnalytics {
  totalOrders: number;
  totalGmv: number;
  platformRevenue: number;
  activeCitiesCount: number;
  totalAreas: number;
  activeCities: LocationItem[];
  topAreas: {
    area: string;
    city: string;
    orders: number;
    shops: number;
    growth: string;
  }[];
}

export interface OrderItem {
  orderId: string;
  shopId: string;
  shopName: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  serviceType: string;
  pages: number;
  copies: number;
  color: string;
  paperType: string;
  fileUrl?: string;
  fileName?: string;
}

export interface PricingConfig {
  commissionRate: number;
  minCommission: number;
  waiverThreshold: number;
  commissionTiers: {
    id: number;
    range: string;
    rate: string;
    min: string;
    status: string;
  }[];
  platformFeeEnabled: boolean;
  platformFeeType: string;
  platformFeeAmount: number;
  platformFeeMinOrder: number;
  platformFeeRules: {
    id: number;
    condition: string;
    fee: string;
    appliesTo: string;
    status: string;
  }[];
  serviceCategories: {
    id: string;
    name: string;
    commission: string;
    active: boolean;
  }[];
  servicePricing: {
    service: string;
    unit: string;
    priceRange: string;
    commission: string;
    status: string;
  }[];
  globalSettings: {
    defaultPricingSource: string;
    priceVisibility: string;
    allowMerchantCustomPricing: boolean;
    enforceMinPrice: boolean;
    priceRounding: string;
    currency: string;
    gstApplicable: boolean;
    gstRate: string;
    autoInvoiceGeneration: boolean;
    minOrderValue: number;
  };
}
