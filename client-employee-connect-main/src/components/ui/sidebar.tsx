
import React, { createContext, useContext, useState } from "react";
import { Menu } from "lucide-react";
import "./sidebar.css";

// Contexte pour gérer l'état du sidebar
const SidebarContext = createContext({
  open: false,
  setOpen: (open: boolean) => {},
});

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { open } = useContext(SidebarContext);
  
  return (
    <>
      <aside
        className="sidebar"
        data-state={open ? "open" : "closed"}
        style={{ width: open ? "240px" : "0px" }}
      >
        {children}
      </aside>
      {open && window.innerWidth < 768 && (
        <div 
          className="sidebar-overlay"
          onClick={() => {
            const { setOpen } = useContext(SidebarContext);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { open, setOpen } = useContext(SidebarContext);
  
  return (
    <button
      className={`sidebar-trigger ${className || ""}`}
      onClick={() => setOpen(!open)}
    >
      <Menu />
    </button>
  );
}

export function SidebarHeader({ children }: { children?: React.ReactNode }) {
  return children ? (
    <div className="sidebar-header">{children}</div>
  ) : (
    <div className="sidebar-logo">
      <div className="flex items-center justify-center text-2xl font-bold text-blue-600 bg-blue-100 p-2 rounded-full h-10 w-10">
        GP
      </div>
      <span>GestiPrésence</span>
    </div>
  );
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="sidebar-content">{children}</div>;
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return <div className="sidebar-footer">{children}</div>;
}

export function SidebarGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="sidebar-group">{children}</div>;
}

export function SidebarGroupLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="sidebar-group-label">{children}</div>;
}

export function SidebarGroupContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="sidebar-group-content">{children}</div>;
}

export function SidebarMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="sidebar-menu">{children}</div>;
}

export function SidebarMenuItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="sidebar-menu-item">{children}</div>;
}

export function SidebarMenuButton({
  children,
  active = false,
  asChild = false,
  ...props
}: {
  children: React.ReactNode;
  active?: boolean;
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement;
    return React.cloneElement(
      child,
      {
        className: `sidebar-menu-button ${child.props.className || ""}`,
        "data-active": active ? "true" : "false",
        ...props,
      },
      child.props.children
    );
  }
  
  return (
    <button
      className="sidebar-menu-button"
      data-active={active ? "true" : "false"}
      {...props}
    >
      {children}
    </button>
  );
}
