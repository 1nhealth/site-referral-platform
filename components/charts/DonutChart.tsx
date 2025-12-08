'use client';

import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { statusColors } from '@/lib/chart-theme';

interface DataPoint {
  name: string;
  value: number;
  status?: string;
  color?: string;
  [key: string]: string | number | undefined;
}

interface DonutChartProps {
  data: DataPoint[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  centerLabel?: string;
  centerValue?: string | number;
  className?: string;
}

export function DonutChart({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 90,
  centerLabel,
  centerValue,
  className,
}: DonutChartProps) {
  // Build chart config from data
  const chartConfig: ChartConfig = data.reduce((config, item) => {
    config[item.name] = {
      label: item.name,
      color: item.color || statusColors[item.status || ''] || statusColors.other,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <div className="relative" style={{ height }}>
      <ChartContainer config={chartConfig} className={className} style={{ height: '100%' }}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || statusColors[entry.status || ''] || statusColors.other}
                stroke="transparent"
              />
            ))}
          </Pie>
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="bg-bg-secondary/95 backdrop-blur-lg border border-glass-border rounded-xl shadow-xl"
                hideLabel={false}
              />
            }
          />
        </PieChart>
      </ChartContainer>

      {/* Center Label */}
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue && (
            <span className="text-3xl font-bold text-text-primary">
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span className="text-sm text-text-muted">{centerLabel}</span>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-4 px-4">
        {data.slice(0, 5).map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: entry.color || statusColors[entry.status || ''] || statusColors.other,
              }}
            />
            <span className="text-xs text-text-muted">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
