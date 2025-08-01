import { create } from "zustand";

export const useAnalyticsStore = create((set, get) => ({
  // Current view state
  activeView: "weekly",
  setActiveView: (view) => set({ activeView: view }),

  // Filter state
  filters: {
    status: "all", // all, paid, pending, failed
    accountType: "all", // all, visa, mastercard
    dateRange: "all", // all, week, month, quarter
    amountRange: "all", // all, positive, negative
  },
  setFilter: (filterType, value) =>
    set((state) => ({
      filters: { ...state.filters, [filterType]: value },
    })),
  resetFilters: () =>
    set({
      filters: {
        status: "all",
        accountType: "all",
        dateRange: "all",
        amountRange: "all",
      },
    }),

  // Bar chart data
  monthlyData: [
    { name: "Jan", value: 4200 },
    { name: "Feb", value: 3800 },
    { name: "Mar", value: 5100 },
    { name: "Apr", value: 4600 },
    { name: "May", value: 5400 },
    { name: "Jun", value: 4900 },
    { name: "Jul", value: 6200 },
    { name: "Aug", value: 5800 },
    { name: "Sep", value: 6700 },
    { name: "Oct", value: 6100 },
    { name: "Nov", value: 7200 },
    { name: "Dec", value: 6800 },
  ],

  weeklyData: [
    { name: "Week 1", value: 1200 },
    { name: "Week 2", value: 1800 },
    { name: "Week 3", value: 1500 },
    { name: "Week 4", value: 2100 },
  ],

  // KPI data
  kpiData: [
    {
      title: "Total Users",
      value: "24,583",
      change: "+12.5%",
      trend: "up",
      icon: "Users",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      chartColor: "blue",
      sparkline: [20, 35, 25, 45, 30, 55, 40, 65, 50, 70, 60, 75],
    },
    {
      title: "New Sign-ups",
      value: "1,247",
      change: "+8.2%",
      trend: "up",
      icon: "UserPlus",
      color: "text-green-600",
      bgColor: "bg-green-50",
      chartColor: "green",
      sparkline: [10, 15, 12, 25, 18, 30, 22, 35, 28, 40, 32, 42],
    },
    {
      title: "Revenue",
      value: "$89,425",
      change: "+15.3%",
      trend: "up",
      icon: "DollarSign",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      chartColor: "emerald",
      sparkline: [30, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 85],
    },
    {
      title: "Growth Rate",
      value: "23.8%",
      change: "-2.1%",
      trend: "down",
      icon: "TrendingUp",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      chartColor: "purple",
      sparkline: [50, 55, 45, 60, 50, 65, 55, 60, 50, 55, 45, 48],
    },
  ],

  // Transactions data
  transactionsData: [
    {
      id: "SP",
      company: "Shopify",
      amount: -18.49,
      date: "August 18",
      status: "Paid",
      account: "Visa 9487",
      accountExpiry: "Expired in 24/10",
      accountType: "visa",
    },
    {
      id: "GG",
      company: "Gacha Games",
      amount: -199.99,
      date: "June 22",
      status: "Pending",
      account: "Mastercard 1212",
      accountExpiry: "Expired in 24/10",
      accountType: "mastercard",
    },
    {
      id: "ST",
      company: "Stripe",
      amount: 20.99,
      date: "May 11",
      status: "Paid",
      account: "Visa 9487",
      accountExpiry: "Expired in 24/10",
      accountType: "visa",
    },
    {
      id: "FM",
      company: "Figma",
      amount: -15.0,
      date: "April 20",
      status: "Failed",
      account: "Visa 9487",
      accountExpiry: "Expired in 24/10",
      accountType: "visa",
    },
    {
      id: "GG",
      company: "GG Fried Chicken",
      amount: -45.05,
      date: "April 18",
      status: "Paid",
      account: "Mastercard 1212",
      accountExpiry: "Expired in 24/10",
      accountType: "mastercard",
    },
  ],

  // Computed getters
  getCurrentBarData: () => {
    const { activeView, monthlyData, weeklyData } = get();
    return activeView === "monthly" ? monthlyData : weeklyData;
  },
}));
