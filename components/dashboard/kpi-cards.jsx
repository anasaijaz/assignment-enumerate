"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserPlus,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useAnalyticsStore } from "@/store/analytics";

// Icon mapping
const iconMap = {
  Users,
  UserPlus,
  DollarSign,
  TrendingUp,
};

// Highcharts area chart component
const MiniAreaChart = ({ data, trend, color }) => {
  const gradientColor =
    color === "blue"
      ? "#3b82f6"
      : color === "green"
      ? "#10b981"
      : color === "emerald"
      ? "#059669"
      : "#8b5cf6";

  const options = {
    chart: {
      type: "areaspline",
      height: 60,
      width: 120,
      backgroundColor: "transparent",
      margin: [0, 0, 0, 0],
      spacing: [0, 0, 0, 0],
    },
    title: { text: null },
    legend: { enabled: false },
    credits: { enabled: false },
    exporting: { enabled: false },
    tooltip: { enabled: false },
    xAxis: {
      visible: false,
      categories: data.map((_, index) => index),
    },
    yAxis: {
      visible: false,
      min: Math.min(...data) * 0.8,
      max: Math.max(...data) * 1.1,
    },
    plotOptions: {
      areaspline: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, `${gradientColor}40`], // 40 in hex = 25% opacity
            [1, `${gradientColor}00`], // 00 in hex = 0% opacity
          ],
        },
        lineColor: gradientColor,
        lineWidth: 2,
        marker: { enabled: false },
        shadow: false,
        states: {
          hover: {
            lineWidth: 2,
          },
        },
      },
    },
    series: [
      {
        data: data,
        color: gradientColor,
      },
    ],
  };

  return (
    <div className="w-30 h-15">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default function KPICards() {
  const { kpiData } = useAnalyticsStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
      {kpiData.map((kpi, index) => {
        const Icon = iconMap[kpi.icon];
        const TrendIcon = kpi.trend === "up" ? ArrowUpRight : ArrowDownRight;

        return (
          <Card
            key={index}
            className="group cursor-pointer motion-safe:transition-all motion-safe:duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20 motion-safe:hover:-translate-y-1 motion-reduce:hover:shadow-md motion-reduce:hover:shadow-primary/5"
          >
            <CardHeader className="pb-2.5">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <MiniAreaChart
                  data={kpi.sparkline}
                  trend={kpi.trend}
                  color={kpi.chartColor}
                />
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground mt-3.5">
                {kpi.title}
              </CardTitle>
              <div className="text-2xl font-bold text-foreground">
                {kpi.value}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                <TrendIcon
                  className={`h-3.5 w-3.5 ${
                    kpi.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    kpi.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpi.change}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  vs last month
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
