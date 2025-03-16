'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

interface Transaction {
  _id: string;
  amount: number;
  date: string;
}

interface MonthlyData {
  month: string;
  amount: number;
}

export default function MonthlyExpensesChart() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/transactions');
        const transactions: Transaction[] = await response.json();

        const monthlyTotals = transactions.reduce((acc: Record<string, number>, transaction) => {
          const date = new Date(transaction.date);
          const monthKey = format(date, 'MMM yyyy');
          
          if (!acc[monthKey]) {
            acc[monthKey] = 0;
          }
          acc[monthKey] += transaction.amount;
          return acc;
        }, {});

        const chartData = Object.entries(monthlyTotals).map(([month, total]) => ({
          month,
          amount: Math.abs(total),
        }));

        setMonthlyData(chartData);
        console.log(chartData);
      } catch (error) {
        console.error('Failed to fetch transaction data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}