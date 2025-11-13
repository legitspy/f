import React, { useMemo } from 'react';
import type { Transaction } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SpendingChartProps {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d'];

const SpendingChart: React.FC<SpendingChartProps> = ({ transactions }) => {
  const spendingData = useMemo(() => {
    const spendingByCategory: { [key: string]: number } = {};
    transactions.forEach(tx => {
      if (tx.amount < 0) { // Only consider expenses
        spendingByCategory[tx.category] = (spendingByCategory[tx.category] || 0) + Math.abs(tx.amount);
      }
    });

    return Object.entries(spendingByCategory).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  if (spendingData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <p className="text-gray-400">No spending data to display.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Spending by Category (BTC)</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={spendingData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {spendingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
                borderColor: '#4B5563', // border-gray-600
                borderRadius: '0.5rem', // rounded-lg
              }}
              itemStyle={{ color: '#D1D5DB' }} // text-gray-300
              formatter={(value: number) => `${value.toFixed(8)} BTC`}
            />
            <Legend wrapperStyle={{ color: '#9CA3AF' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;