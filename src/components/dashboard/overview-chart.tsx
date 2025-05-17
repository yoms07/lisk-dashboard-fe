import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    revenue: 4000,
    sales: 2400,
    amt: 2400,
  },
  {
    revenue: 3000,
    sales: 1398,
    amt: 2210,
  },
  {
    revenue: 2000,
    sales: 9800,
    amt: 2290,
  },
  {
    revenue: 2780,
    sales: 3908,
    amt: 2000,
  },
  {
    revenue: 1890,
    sales: 4800,
    amt: 2181,
  },
  {
    revenue: 2390,
    sales: 3800,
    amt: 2500,
  },
  {
    revenue: 3490,
    sales: 4300,
    amt: 2100,
  },
];

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#82ca9d"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
