'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { chartColors } from '@/lib/chart-theme';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: DataPoint[];
  dataKey?: string;
  xAxisKey?: string;
  color?: string;
  height?: number;
  layout?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  barRadius?: number;
  className?: string;
}

export function BarChart({
  data,
  dataKey = 'value',
  xAxisKey = 'name',
  color = chartColors.mint,
  height = 300,
  layout = 'horizontal',
  showGrid = true,
  barRadius = 6,
  className,
}: BarChartProps) {
  const isVertical = layout === 'vertical';

  const chartConfig: ChartConfig = {
    [dataKey]: {
      label: dataKey,
      color: color,
    },
  };

  return (
    <ChartContainer config={chartConfig} className={className} style={{ height }}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 10, right: 10, left: isVertical ? 80 : 0, bottom: 0 }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartColors.grid}
            horizontal={!isVertical}
            vertical={isVertical}
          />
        )}
        {isVertical ? (
          <>
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              width={70}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dx={-10}
            />
          </>
        )}
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="bg-bg-secondary/95 backdrop-blur-lg border border-glass-border rounded-xl shadow-xl"
              formatter={(value) => `${value}%`}
            />
          }
        />
        <Bar dataKey={dataKey} radius={barRadius}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || color}
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ChartContainer>
  );
}
