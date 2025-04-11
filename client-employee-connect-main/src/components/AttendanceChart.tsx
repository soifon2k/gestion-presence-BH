
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Lun', employees: 45, clients: 22 },
  { name: 'Mar', employees: 48, clients: 28 },
  { name: 'Mer', employees: 47, clients: 30 },
  { name: 'Jeu', employees: 49, clients: 25 },
  { name: 'Ven', employees: 50, clients: 32 },
  { name: 'Sam', employees: 30, clients: 38 },
  { name: 'Dim', employees: 15, clients: 40 },
];

const AttendanceChart = () => {
  return (
    <Card className="shadow-sm col-span-full">
      <CardHeader>
        <CardTitle>Statistique de Présence Hebdomadaire</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="employees" name="Employés" fill="#2563EB" />
              <Bar dataKey="clients" name="Clients" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;
