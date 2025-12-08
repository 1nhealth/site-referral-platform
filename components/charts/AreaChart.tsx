'use client';

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { chartColors, chartGradients } from '@/lib/chart-theme';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface AreaChartProps {
  data: DataPoint[];
  dataKey?: string;
  xAxisKey?: string;
  color?: 'mint' | 'vistaBlue' | 'purple';
  height?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  className?: string;
}

export function AreaChart({
  data,
  dataKey = 'value',
  xAxisKey = 'name',
  color = 'mint',
  height = 300,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  className,
}: AreaChartProps) {
  const gradient = chartGradients[color];
  const strokeColor = chartColors[color];

  const chartConfig: ChartConfig = {
    [dataKey]: {
      label: dataKey,
      color: strokeColor,
    },
  };

  return (
    <ChartContainer config={chartConfig} className={className} style={{ height }}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradient.id} x1="0" y1="0" x2="0" y2="1">
            {gradient.colors.map((stop, index) => (
              <stop
                key={index}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity}
              />
            ))}
          </linearGradient>
        </defs>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartColors.grid}
            vertical={false}
          />
        )}
        {showXAxis && (
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            dy={10}
          />
        )}
        {showYAxis && (
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            dx={-10}
          />
        )}
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="bg-bg-secondary/95 backdrop-blur-lg border border-glass-border rounded-xl shadow-xl"
            />
          }
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor}
          strokeWidth={2}
          fill={`url(#${gradient.id})`}
        />
      </RechartsAreaChart>
    </ChartContainer>
  );
}
