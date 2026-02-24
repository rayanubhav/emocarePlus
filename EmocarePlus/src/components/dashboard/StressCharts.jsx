import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const PIE_COLORS = {
  Low: '#A8D9C2',   // Soft Green
  Medium: '#F5D88A', // Warm Amber
  High: '#F0A8A8',   // Pastel Red
};

const StressCharts = ({ historyData, summaryData }) => {
  const formattedHistory = historyData.map((entry) => ({
    ...entry,
    level: entry.level ?? 0,
    day: entry.date,
  }));

  const pieData = summaryData.filter((e) => e.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[20px] bg-white border border-[#D9E6F2] p-6 shadow-[0_2px_16px_rgba(91,155,213,0.07)]"
    >
      <h3 className="text-[16px] font-bold text-[#2D3E50] mb-1">Stress Over Time</h3>
      <p className="text-[11px] text-[#7A90A4] mb-5">Your stress level trend for this week</p>

      {/* Area Chart */}
      {formattedHistory.length > 0 ? (
        <div style={{ width: '100%', height: 220 }} className="mb-6">
          <ResponsiveContainer>
            <AreaChart data={formattedHistory}>
              <defs>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B9BD5" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#5B9BD5" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#D9E6F2" tick={{ fill: '#7A90A4', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 10]} stroke="#D9E6F2" tick={{ fill: '#7A90A4', fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D9E6F2',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(91,155,213,0.1)'
                }}
                itemStyle={{ color: '#2D3E50', fontSize: '13px', fontWeight: 'bold' }}
                labelStyle={{ color: '#7A90A4', fontSize: '11px', marginBottom: '4px' }}
              />
              <Area
                type="monotone"
                dataKey="level"
                stroke="#5B9BD5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorStress)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[220px] items-center justify-center text-[13px] text-[#7A90A4] bg-[#F7FAFC] rounded-[14px] border border-[#D9E6F2] mb-6">
          No stress data for this week.
        </div>
      )}

      <div className="border-t border-[#D9E6F2] my-6"></div>

      <h3 className="text-[16px] font-bold text-[#2D3E50] mb-1">Stress Distribution</h3>
      <p className="text-[11px] text-[#7A90A4] mb-5">Low · Medium · High breakdown</p>

      {/* Donut Chart */}
      {pieData.length > 0 ? (
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                labelLine={false}
              >
                {pieData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[entry.name] || '#5B9BD5'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D9E6F2',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(91,155,213,0.1)'
                }}
                itemStyle={{ color: '#2D3E50', fontSize: '13px', fontWeight: 'bold' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', color: '#7A90A4' }} 
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[220px] items-center justify-center text-[13px] text-[#7A90A4] bg-[#F7FAFC] rounded-[14px] border border-[#D9E6F2]">
          No summary data to display.
        </div>
      )}
    </motion.div>
  );
};

export default StressCharts;