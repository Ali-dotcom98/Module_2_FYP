import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AssingmentChart = ({data}) => {
  return (
    <ResponsiveContainer>
        <BarChart 
          
          barCategoryGap="75%"   
          barGap={20}
          margin={{ left: -10  }}
          data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis  dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickMargin={20}  />
            <Tooltip
                formatter={(value) => [`${value} assignments`, "Count"]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ borderRadius: "8px", fontSize: "12px", fontFamily: "Arial" }}
                labelStyle={{ fontSize: "12px", fontWeight: "bold", color: "#111827", fontFamily:"urbanist" }}
              />

            <Bar
            dataKey="count"
            fill="#6c63ff"
            radius={[6, 6, 0, 0]}
             barSize={Math.max(20, 80 - data.length * 2)} 
            />
        </BarChart>
    </ResponsiveContainer>
  )
}

export default AssingmentChart