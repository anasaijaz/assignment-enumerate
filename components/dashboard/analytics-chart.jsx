"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Highcharts from "highcharts";
import { useAnalyticsStore } from "@/store/analytics";

export default function AnalyticsChart() {
  const {
    activeView,
    setActiveView,
    getCurrentBarData,
    transactionsData,
    filters,
  } = useAnalyticsStore();

  const chartRef = useRef(null);
  const pieChartRef = useRef(null);
  const chartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  // Use useMemo to filter transactions and prevent infinite re-renders
  const filteredTransactions = useMemo(() => {
    return transactionsData.filter((transaction) => {
      // Status filter
      if (
        filters.status !== "all" &&
        transaction.status.toLowerCase() !== filters.status
      ) {
        return false;
      }

      // Account type filter
      if (
        filters.accountType !== "all" &&
        transaction.accountType !== filters.accountType
      ) {
        return false;
      }

      // Amount range filter
      if (filters.amountRange === "positive" && transaction.amount <= 0) {
        return false;
      }
      if (filters.amountRange === "negative" && transaction.amount >= 0) {
        return false;
      }

      return true;
    });
  }, [transactionsData, filters]);

  // Generate dynamic pie chart data based on filtered transactions
  const getDynamicPieData = useCallback(() => {
    if (activeView === "monthly") {
      // Group by status for monthly view
      const statusCounts = filteredTransactions.reduce((acc, transaction) => {
        const status = transaction.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(statusCounts).reduce(
        (sum, count) => sum + count,
        0
      );

      return Object.entries(statusCounts).map(([status, count], index) => ({
        name: status,
        y: total > 0 ? Math.round((count / total) * 100) : 0,
        color:
          index === 0
            ? "hsl(var(--primary))"
            : index === 1
            ? "hsl(var(--secondary))"
            : index === 2
            ? "hsl(var(--accent))"
            : "hsl(var(--muted))",
      }));
    } else {
      // Group by account type for weekly view
      const accountCounts = filteredTransactions.reduce((acc, transaction) => {
        const type = transaction.accountType === "visa" ? "Visa" : "Mastercard";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(accountCounts).reduce(
        (sum, count) => sum + count,
        0
      );

      return Object.entries(accountCounts).map(([type, count], index) => ({
        name: type,
        y: total > 0 ? Math.round((count / total) * 100) : 0,
        color: index === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))",
      }));
    }
  }, [activeView, filteredTransactions]);

  useEffect(() => {
    // Bar Chart
    if (chartRef.current) {
      const currentData = getCurrentBarData();

      const chartOptions = {
        chart: {
          type: "column",
          backgroundColor: "transparent",
          height: null, // Let it auto-size
        },
        title: {
          text: null,
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: currentData.map((item) => item.name),
          gridLineWidth: 0,
          lineColor: "hsl(var(--border))",
          tickColor: "hsl(var(--border))",
          labels: {
            style: {
              color: "hsl(var(--muted-foreground))",
              fontSize: "11px",
            },
          },
        },
        yAxis: {
          title: {
            text: null,
          },
          gridLineColor: "hsl(var(--border))",
          lineColor: "hsl(var(--border))",
          labels: {
            style: {
              color: "hsl(var(--muted-foreground))",
              fontSize: "11px",
            },
          },
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          column: {
            borderWidth: 0,
            borderRadius: 3,
            pointPadding: 0.1,
            groupPadding: 0.1,
          },
        },
        series: [
          {
            name:
              activeView === "monthly" ? "Monthly Revenue" : "Weekly Revenue",
            data: currentData.map((item) => ({
              y: item.value,
              color: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, "hsl(var(--primary))"],
                  [1, "hsl(var(--primary) / 0.6)"],
                ],
              },
            })),
          },
        ],
        tooltip: {
          backgroundColor: "hsl(var(--popover))",
          borderColor: "hsl(var(--border))",
          style: {
            color: "hsl(var(--popover-foreground))",
          },
          formatter: function () {
            return `<b>${this.x}</b><br/>Revenue: $${this.y.toLocaleString()}`;
          },
        },
      };

      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      chartInstance.current = Highcharts.chart(chartRef.current, chartOptions);
    }

    // Pie Chart
    if (pieChartRef.current) {
      const currentPieData = getDynamicPieData();

      const pieChartOptions = {
        chart: {
          type: "pie",
          backgroundColor: "transparent",
          height: null, // Let it auto-size
        },
        title: {
          text:
            activeView === "monthly" ? "Revenue by Category" : "Sales Channels",
          style: {
            color: "hsl(var(--foreground))",
            fontSize: "14px",
            fontWeight: "600",
          },
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.percentage:.1f}%",
              style: {
                color: "hsl(var(--foreground))",
                fontSize: "11px",
              },
            },
            showInLegend: false,
            innerSize: "40%",
          },
        },
        series: [
          {
            name: "Percentage",
            data: currentPieData,
          },
        ],
        tooltip: {
          backgroundColor: "hsl(var(--popover))",
          borderColor: "hsl(var(--border))",
          style: {
            color: "hsl(var(--popover-foreground))",
          },
          pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
        },
      };

      // Destroy existing pie chart if it exists
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }

      // Create new pie chart
      pieChartInstance.current = Highcharts.chart(
        pieChartRef.current,
        pieChartOptions
      );
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
        pieChartInstance.current = null;
      }
    };
  }, [activeView, getCurrentBarData, getDynamicPieData]);

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <Card className="lg:col-span-1 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              Track your performance trends and insights.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleViewChange("monthly")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md motion-safe:transition-colors ${
                activeView === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleViewChange("weekly")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md motion-safe:transition-colors ${
                activeView === "weekly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Weekly
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        <div ref={chartRef} className="flex-1 w-full min-h-0" />
        <div ref={pieChartRef} className="flex-1 w-full min-h-0" />
      </CardContent>
    </Card>
  );
}
