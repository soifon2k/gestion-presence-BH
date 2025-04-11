
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6">
        <h1 className="text-6xl font-bold text-company-blue mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oups ! La page que vous recherchez n'existe pas.
        </p>
        <p className="text-gray-500 mb-8">
          Il semble que vous ayez suivi un lien incorrect ou que la page ait été déplacée.
        </p>
        <Button asChild className="bg-company-blue hover:bg-company-darkBlue">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
