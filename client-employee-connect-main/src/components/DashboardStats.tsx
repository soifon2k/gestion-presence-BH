
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Hotel, Utensils, Presentation, Droplet, UserCheck, Clock } from "lucide-react";

const statsData = [
  {
    title: "Employés Présents",
    value: "42/50",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
    change: "+2 depuis hier"
  },
  {
    title: "Clients Enregistrés",
    value: "24",
    icon: Calendar,
    color: "bg-green-100 text-green-600",
    change: "+5 cette semaine"
  },
  {
    title: "Occupation Hôtel",
    value: "85%",
    icon: Hotel,
    color: "bg-purple-100 text-purple-600",
    change: "+10% depuis lundi"
  },
  {
    title: "Restaurant",
    value: "32",
    icon: Utensils,
    color: "bg-orange-100 text-orange-600",
    change: "18 réservations"
  },
  {
    title: "Taux de Présence",
    value: "92%",
    icon: UserCheck,
    color: "bg-indigo-100 text-indigo-600",
    change: "+2% ce mois"
  },
  {
    title: "Temps Moyen",
    value: "8h15",
    icon: Clock,
    color: "bg-rose-100 text-rose-600",
    change: "Présence moyenne"
  },
  {
    title: "Salles de Conférence",
    value: "2/3",
    icon: Presentation,
    color: "bg-pink-100 text-pink-600",
    change: "1 disponible"
  },
  {
    title: "Production d'Eau",
    value: "4200 L",
    icon: Droplet,
    color: "bg-sky-100 text-sky-600",
    change: "+200L aujourd'hui"
  }
];

const DashboardStats = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vue d'ensemble</h2>
        <div className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
          Aujourd'hui, {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.change}</div>
                </div>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default DashboardStats;
