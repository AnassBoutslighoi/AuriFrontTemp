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

type ContentRenderer = React.ReactNode | ((props: any) => React.ReactNode)

export const ChartTooltipContent = ({
  content,
  className,
}: {
  content?: ContentRenderer
  className?: string
}) => {
  const node =
    typeof content === "function"
      ? (content as (p: any) => React.ReactNode)({})
      : content

  return <div className={className}>{node}</div>
}

// The following primitives are placeholders that accept any props so
// pages can pass props freely without type errors, even though the
// demo chart implementation renders nothing.
export const Line: React.FC<any> = () => null

export const LineChart: React.FC<any> = ({ children }) => {
  return <>{children}</>
}

export const Bar: React.FC<any> = () => null

export const BarChart: React.FC<any> = ({ children }) => {
  return <>{children}</>
}

export const XAxis: React.FC<any> = () => null

export const YAxis: React.FC<any> = () => null

export const Pie: React.FC<any> = () => null

export const PieChart: React.FC<any> = ({ children }) => {
  return <>{children}</>
}
