"use client"

import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

const data = [
  { date: "2023-05-01", messages: 145 },
  { date: "2023-05-02", messages: 132 },
  { date: "2023-05-03", messages: 164 },
  { date: "2023-05-04", messages: 187 },
  { date: "2023-05-05", messages: 212 },
  { date: "2023-05-06", messages: 198 },
  { date: "2023-05-07", messages: 173 },
  { date: "2023-05-08", messages: 201 },
  { date: "2023-05-09", messages: 224 },
  { date: "2023-05-10", messages: 248 },
]

export function DashboardChart() {
  return (
    <ChartContainer className="h-full w-full" data={data}>
      <Chart>
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            const date = new Date(value)
            return `${date.getDate()}/${date.getMonth() + 1}`
          }}
        />
        <YAxis />
        <LineChart>
          <Line dataKey="messages" stroke="hsl(var(--primary))" strokeWidth={2} />
        </LineChart>
        <ChartTooltip>
          <ChartTooltipContent
            className="border-none bg-background p-2 shadow-md"
            content={({ payload }) => {
              if (!payload?.length) return null
              const data = payload[0].payload
              const date = new Date(data.date)
              const formattedDate = `${date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}`
              return (
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">{formattedDate}</p>
                  <p className="font-medium">{data.messages} messages</p>
                </div>
              )
            }}
          />
        </ChartTooltip>
      </Chart>
    </ChartContainer>
  )
}
