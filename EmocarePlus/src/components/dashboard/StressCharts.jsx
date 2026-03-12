import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const PIE_COLORS = {
  Low: 'var(--stress-low)',
  Medium: 'var(--stress-mid)',
  High: 'var(--stress-high)',
};

const StressCharts = ({ historyData, summaryData, accentColor }) => {
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
      className="rounded-[20px] bg-surface border border-border p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-1 h-5 rounded-full"
          style={{ backgroundColor: accentColor || 'var(--primary)' }}
        />
        <h3 className="text-[16px] font-bold text-text-main">Stress Over Time</h3>
      </div>
      <p className="text-[11px] text-text-muted mb-6 ml-3">Your stress level trend for this week</p>

      {/* Area Chart */}
      {formattedHistory.length > 0 ? (
        <div style={{ width: '100%', height: 220 }} className="mb-6">
          <ResponsiveContainer>
            <AreaChart data={formattedHistory}>
              <defs>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentColor || '#5B9BD5'} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={accentColor || '#5B9BD5'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="var(--border)" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 10]} stroke="var(--border)" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                itemStyle={{ color: 'var(--text-main)', fontSize: '13px' }}
                labelStyle={{ color: 'var(--text-muted)', fontSize: '11px' }}
              />
              <Area type="monotone" dataKey="level" stroke={accentColor || '#5B9BD5'} strokeWidth={2.5} fillOpacity={1} fill="url(#colorStress)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[220px] items-center justify-center text-[13px] text-text-muted bg-surface-light rounded-[14px] mb-6">
          No stress data for this week.
        </div>
      )}

      <div className="border-t border-border my-6"></div>

      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-1 h-5 rounded-full"
          style={{ backgroundColor: accentColor || 'var(--primary)' }}
        />
        <h3 className="text-[16px] font-bold text-text-main">Stress Distribution</h3>
      </div>
      <p className="text-[11px] text-text-muted mb-6 ml-3">Low · Medium · High breakdown</p>

      {/* Pie Chart */}
      {pieData.length > 0 ? (
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} stroke="none">
                {pieData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[entry.name] || 'var(--primary)'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                itemStyle={{ color: 'var(--text-main)', fontSize: '13px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[220px] items-center justify-center text-[13px] text-text-muted bg-surface-light rounded-[14px]">
          No summary data to display.
        </div>
      )}
    </motion.div>
  );
};

export default StressCharts;