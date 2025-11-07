import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Colors for the Pie Chart
const PIE_COLORS = {
  'Low': '#52c41a', // Green
  'Medium': '#faad14', // Orange
  'High': '#f5222d', // Red
};

const StressCharts = ({ historyData, summaryData }) => {
  
  const formattedHistory = historyData.map((entry, index) => ({
    ...entry,
    level: entry.level ?? 0, // Handle null levels
    day: entry.date, // Use 'date' field from your data
  }));

  const pieData = summaryData.filter(e => e.value > 0);

  return (
    <div className="rounded-xl bg-[var(--color-surface)] p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white">Your Week in Stress</h3>
      {formattedHistory.length > 0 ? (
        <div style={{ width: '100%', height: 250 }} className="mt-6">
          <ResponsiveContainer>
            <AreaChart data={formattedHistory}>
              <defs>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#B0B0C0" />
              <YAxis domain={[0, 10]} stroke="#B0B0C0" />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-surface)', border: 'none' }}
                labelStyle={{ color: '#F5F7FA' }}
              />
              <Area
                type="monotone"
                dataKey="level"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorStress)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[250px] items-center justify-center text-[var(--color-text-muted)]">
          No stress data for this week.
        </div>
      )}
      
      <h3 className="text-xl font-bold text-white mt-8">Stress Summary</h3>
      {pieData.length > 0 ? (
        <div style={{ width: '100%', height: 250 }} className="mt-6">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-surface)', border: 'none' }}
                labelStyle={{ color: '#F5F7FA' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[250px] items-center justify-center text-[var(--color-text-muted)]">
          No summary data to display.
        </div>
      )}
    </div>
  );
};

export default StressCharts;