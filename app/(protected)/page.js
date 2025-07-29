"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import KPICards from "@/components/dashboard/kpi-cards";
import TransactionsTable from "@/components/dashboard/transactions-table";
import AnalyticsChart from "@/components/dashboard/analytics-chart";

export default function Dashboard() {
  return (
    <div className="space-y-4 md:space-y-7">
      {/* KPI Summary Cards */}
      <KPICards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-7">
        {/* Chart Panel */}
        <AnalyticsChart />

        {/* Recent Transactions Table */}
        <div className="lg:col-span-1">
          <TransactionsTable />
        </div>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>
            Current project status and technology stack information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3.5">
          <p className="text-sm text-foreground leading-relaxed">
            This dashboard showcases a comprehensive design system built with
            modern technologies. It features responsive KPI cards with
            interactive charts, advanced data tables, and a clean component
            architecture that demonstrates best practices in React development.
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed">
            The system includes persistent UI state management, professional
            data visualization, and seamless integration between various
            shadcn/ui components. All components follow consistent design
            patterns and accessibility standards.
          </p>

          <div className="flex gap-2.5 flex-wrap pt-2.5">
            {[
              "Next.js 15",
              "React",
              "TanStack Table",
              "Highcharts",
              "Tailwind CSS",
              "Shadcn/ui",
              "Zustand",
            ].map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
