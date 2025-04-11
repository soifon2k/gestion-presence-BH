
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, User } from "lucide-react";

const Header = ({ title }: { title: string }) => {
  return (
    <header className="flex h-16 items-center gap-4 border-b px-6">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center text-2xl font-bold text-blue-600 bg-blue-100 p-2 rounded-full h-10 w-10">
          GP
        </div>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex-1" />
      <div className="hidden md:flex relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          type="search" 
          placeholder="Rechercher..." 
          className="pl-8 md:w-[300px] lg:w-[400px]" 
        />
      </div>
      <Button size="icon" variant="ghost" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
      </Button>
      <Avatar>
        <AvatarImage src="" />
        <AvatarFallback className="bg-company-blue text-white">AD</AvatarFallback>
      </Avatar>
    </header>
  );
};

export default Header;
