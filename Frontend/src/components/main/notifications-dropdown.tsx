"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function NotificationsDropdown() {
  const [unreadCount, setUnreadCount] = useState(3)

  // In a real app, these would be fetched from your API
  const notifications = [
    {
      id: "1",
      title: "Appointment Confirmed",
      description: "Your appointment with Jane Smith has been confirmed.",
      date: "1 hour ago",
      read: false,
    },
    {
      id: "2",
      title: "New Message",
      description: "You have a new message from Michael Johnson.",
      date: "3 hours ago",
      read: false,
    },
    {
      id: "3",
      title: "Document Uploaded",
      description: "Sarah Williams uploaded a new document for your review.",
      date: "Yesterday",
      read: false,
    },
    {
      id: "4",
      title: "Appointment Reminder",
      description: "You have an appointment tomorrow at 10:00 AM.",
      date: "2 days ago",
      read: true,
    },
  ]

  const markAllAsRead = () => {
    setUnreadCount(0)
    // In a real app, you would update the read status in your API
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gold-light" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-dark shadow-md">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 border-dark-border bg-dark-card">
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel className="text-lg font-semibold text-gold-light">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-8 text-xs text-gold-light hover:text-gold"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-dark-border" />
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex cursor-pointer flex-col items-start p-3 focus:bg-dark-notification"
              >
                <div className="flex w-full items-start justify-between">
                  <div className="font-medium text-gold-light">{notification.title}</div>
                  <div className="text-xs text-dark-muted">{notification.date}</div>
                </div>
                <div className="mt-1 text-sm text-white">{notification.description}</div>
                {!notification.read && (
                  <div className="mt-2 h-2 w-2 rounded-full bg-gold shadow-sm" aria-label="Unread notification"></div>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-dark-border" />
            <DropdownMenuItem className="cursor-pointer justify-center p-2 text-center font-medium text-gold-light hover:text-gold focus:bg-dark-accent">
              View all notifications
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-4 text-center text-sm text-dark-muted">No new notifications</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
