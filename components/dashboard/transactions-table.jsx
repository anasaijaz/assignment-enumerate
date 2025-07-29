"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Filter, X, ExternalLink } from "lucide-react";
import Image from "next/image";
import VisaPNG from "@/assets/brands/visa.png";
import MCPNG from "@/assets/brands/mastercard.png";
import { useAnalyticsStore } from "@/store/analytics";

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Badge
      variant="secondary"
      className={`${getStatusColor(status)} border-0 font-medium`}
    >
      {status}
    </Badge>
  );
};

const AccountInfo = ({ account, accountExpiry, accountType }) => {
  const VisaLogo = () => (
    <div className="w-8 h-5 relative">
      <Image src={VisaPNG} alt="Visa" fill className="object-contain" />
    </div>
  );

  const MastercardLogo = () => (
    <div className="w-8 h-5 relative">
      <Image src={MCPNG} alt="Mastercard" fill className="object-contain" />
    </div>
  );

  return (
    <div className="flex items-center gap-2.5">
      {accountType === "visa" ? <VisaLogo /> : <MastercardLogo />}
      <div className="space-y-0.5">
        <div className="text-sm font-medium text-foreground">{account}</div>
        <div className="text-xs text-muted-foreground">{accountExpiry}</div>
      </div>
    </div>
  );
};

export default function TransactionsTable() {
  const [sorting, setSorting] = useState([]);
  const { transactionsData, filters, setFilter, resetFilters } =
    useAnalyticsStore();

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

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "all"
  );

  // Filter options
  const filterOptions = {
    status: [
      { value: "all", label: "All Statuses" },
      { value: "paid", label: "Paid" },
      { value: "pending", label: "Pending" },
      { value: "failed", label: "Failed" },
    ],
    accountType: [
      { value: "all", label: "All Cards" },
      { value: "visa", label: "Visa" },
      { value: "mastercard", label: "Mastercard" },
    ],
    amountRange: [
      { value: "all", label: "All Amounts" },
      { value: "positive", label: "Positive" },
      { value: "negative", label: "Negative" },
    ],
  };

  const columns = [
    {
      accessorKey: "company",
      header: "Transactions",
      cell: ({ row }) => {
        return (
          <div className="relative flex items-center gap-3.5">
            {/* Company Info */}
            <div className="flex items-center gap-3.5 motion-safe:transition-opacity motion-safe:duration-200 group-hover/row:opacity-0">
              <Avatar className="h-8 w-8 hidden md:flex">
                <AvatarFallback className="bg-muted text-muted-foreground text-sm font-semibold">
                  {row.original.id}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <div className="text-sm font-medium text-foreground">
                  {row.getValue("company")}
                </div>
              </div>
            </div>

            {/* View Link - Absolute positioned */}
            <div className="absolute inset-0 flex items-center opacity-0 translate-x-5 motion-safe:transition-all motion-safe:duration-200 group-hover/row:opacity-100 group-hover/row:translate-x-0 motion-reduce:translate-x-0 motion-reduce:group-hover/row:opacity-100">
              <Button
                variant="link"
                onClick={() => {
                  console.log("View transaction:", row.original);
                }}
              >
                <ExternalLink className="h-4 w-4" />
                View
              </Button>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const isPositive = amount > 0;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Math.abs(amount));

        return (
          <div
            className={`text-sm font-semibold ${
              isPositive ? "text-green-600" : "text-foreground"
            }`}
          >
            {isPositive ? "+" : "-"}
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-foreground">{row.getValue("date")}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <StatusBadge status={row.getValue("status")} />;
      },
    },
    {
      accessorKey: "account",
      header: "Account",
      cell: ({ row }) => {
        return (
          <AccountInfo
            account={row.getValue("account")}
            accountExpiry={row.original.accountExpiry}
            accountType={row.original.accountType}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredTransactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start md:items-center justify-between gap-3">
          <div className="flex-1">
            <CardTitle>Transaction History</CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            {/* Active Filters in Header */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (value === "all") return null;
                  const option = filterOptions[key]?.find(
                    (opt) => opt.value === value
                  );
                  return (
                    <div
                      key={key}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/15 text-primary text-sm rounded-md border border-primary/20"
                    >
                      <span className="font-medium">{option?.label}</span>
                      <button
                        onClick={() => setFilter(key, "all")}
                        className="hover:bg-primary/25 rounded-sm p-0.5 transition-colors"
                        title={`Remove ${option?.label} filter`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="default" size="sm">
                  <Filter className="h-4 w-4" />
                  Filter
                  {hasActiveFilters && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-foreground text-primary rounded-full">
                      {Object.values(filters).filter((v) => v !== "all").length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Filters</h4>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Reset all
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Status Filter */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Status
                      </label>
                      <Select
                        value={filters.status}
                        onValueChange={(value) => setFilter("status", value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOptions.status.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Account Type Filter */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Card Type
                      </label>
                      <Select
                        value={filters.accountType}
                        onValueChange={(value) =>
                          setFilter("accountType", value)
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOptions.accountType.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Amount Range Filter */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Amount Type
                      </label>
                      <Select
                        value={filters.amountRange}
                        onValueChange={(value) =>
                          setFilter("amountRange", value)
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOptions.amountRange.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Active Filters Pills */}
                  {hasActiveFilters && (
                    <div className="pt-3 border-t border-border">
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        Active Filters:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(filters).map(([key, value]) => {
                          if (value === "all") return null;
                          const option = filterOptions[key]?.find(
                            (opt) => opt.value === value
                          );
                          return (
                            <div
                              key={key}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                            >
                              {option?.label}
                              <button
                                onClick={() => setFilter(key, "all")}
                                className="hover:bg-primary/20 rounded-sm p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>

      {/* Table Header */}
      <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-4 px-4 md:px-6 py-3 text-sm font-medium text-muted-foreground border-b border-border bg-muted/20">
        <div>Transactions</div>
        <div>Amount</div>
        <div>Date</div>
        <div>Status</div>
        <div className="hidden md:block">Account</div>
      </div>

      {/* Table Rows */}
      <div className="space-y-0">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="group/row grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-4 items-center px-4 md:px-6 py-4 hover:bg-muted/50 motion-safe:transition-colors motion-safe:duration-200 cursor-pointer border-b border-border/50 last:border-b-0"
            >
              {row.getVisibleCells().map((cell, index) => (
                <div
                  key={cell.id}
                  className={index === 4 ? "hidden md:block" : ""}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-7 text-muted-foreground">
            No transactions found.
          </div>
        )}
      </div>
    </Card>
  );
}
