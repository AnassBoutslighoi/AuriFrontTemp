import type React from "react"

export const Chart = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const ChartContainer = ({
  children,
  data,
  className,
}: {
  children: React.ReactNode
  data: any[]
  className?: string
}) => {
  return <div className={className}>{children}</div>
}

export const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const ChartTooltipContent = ({
  content,
  className,
}: {
  content: any
  className?: string
}) => {
  return <div className={className}>{content}</div>
}

export const Line = () => {
  return null
}

export const LineChart = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const Bar = () => {
  return null
}

export const BarChart = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const XAxis = () => {
  return null
}

export const YAxis = () => {
  return null
}

export const Pie = () => {
  return null
}

export const PieChart = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}
