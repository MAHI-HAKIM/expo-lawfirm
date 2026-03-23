"use client";

import type React from "react";
import { Bell, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NotificationsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Notifications({ className }: NotificationsProps) {
  // In a real app, these would be fetched from your API
  const notifications = [
    {
      id: "1",
      title: "Appointment Confirmed",
      description: "Your appointment with Jane Smith has been confirmed.",
      date: "1 hour ago",
      priority: "high",
      icon: "bell",
    },
    {
      id: "2",
      title: "New Message",
      description:
        "You have a new message from Michael Johnson regarding your case.",
      date: "3 hours ago",
      priority: "medium",
      icon: "message",
    },
    {
      id: "3",
      title: "Document Uploaded",
      description: "Sarah Williams uploaded a new document for your review.",
      date: "Yesterday",
      priority: "low",
      icon: "document",
    },
    {
      id: "4",
      title: "Appointment Reminder",
      description: "Your appointment with David Clark is tomorrow at 2:00 PM.",
      date: "Yesterday",
      priority: "medium",
      icon: "calendar",
    },
    {
      id: "5",
      title: "Payment Confirmed",
      description:
        "Your payment for legal services has been processed successfully.",
      date: "2 days ago",
      priority: "low",
      icon: "payment",
    },
  ];

  // Function to get color based on priority
  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          bg: "rgba(248, 113, 113, 0.1)",
          border: "rgba(248, 113, 113, 0.3)",
          text: "#F87171",
        };
      case "medium":
        return {
          bg: "rgba(240, 208, 120, 0.1)",
          border: "rgba(240, 208, 120, 0.3)",
          text: "#F0D078",
        };
      case "low":
      default:
        return {
          bg: "rgba(74, 222, 128, 0.1)",
          border: "rgba(74, 222, 128, 0.3)",
          text: "#4ADE80",
        };
    }
  };

  // Function to get icon based on notification type
  const getIcon = (icon: string) => {
    return (
      <div
        style={{
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          backgroundColor: "rgba(240, 208, 120, 0.1)",
          marginRight: "12px",
        }}
      >
        <Bell
          style={{
            width: "16px",
            height: "16px",
            color: "#F0D078",
          }}
        />
      </div>
    );
  };

  return (
    <Card
      className={className}
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid rgba(240, 208, 120, 0.2)",
        borderRadius: "0.75rem",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        height: "100%", // Match the height of the appointments card
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        className="pb-3"
        style={{
          borderBottom: "1px solid rgba(240, 208, 120, 0.15)",
          padding: "1.25rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <CardTitle
            style={{
              color: "#F0D078",
              fontSize: "1.25rem",
              fontWeight: 600,
              fontFamily: "sans-serif",
            }}
          >
            Notifications
          </CardTitle>
          <div
            style={{
              backgroundColor: "rgba(240, 208, 120, 0.1)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell
              style={{
                width: "16px",
                height: "16px",
                color: "#F0D078",
              }}
            />
          </div>
        </div>
        <CardDescription
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.875rem",
            fontFamily: "sans-serif",
          }}
        >
          Recent updates and alerts
        </CardDescription>
      </CardHeader>
      <CardContent
        className="space-y-4"
        style={{
          padding: "1.25rem",
          backgroundColor: "#1A1A1A",
          flex: 1,
          maxHeight: "360px",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(240, 208, 120, 0.3) rgba(30, 30, 30, 0.1)", // Firefox
          msOverflowStyle: "none", // IE and Edge
        }}
      >
        <style jsx global>{`
          /* Webkit browsers custom scrollbar */
          .space-y-4::-webkit-scrollbar {
            width: 6px;
          }

          .space-y-4::-webkit-scrollbar-track {
            background: rgba(30, 30, 30, 0.1);
            border-radius: 10px;
          }

          .space-y-4::-webkit-scrollbar-thumb {
            background-color: rgba(240, 208, 120, 0.3);
            border-radius: 10px;
          }

          .space-y-4::-webkit-scrollbar-thumb:hover {
            background-color: rgba(240, 208, 120, 0.5);
          }
        `}</style>
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const priorityColors = getPriorityColors(notification.priority);

            return (
              <div
                key={notification.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  border: `1px solid ${priorityColors.border}`,
                  backgroundColor: "#232323",
                  marginBottom: "0.5rem",
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(240, 208, 120, 0.4)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(0, 0, 0, 0.2)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = priorityColors.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "4px",
                    height: "100%",
                    backgroundColor: priorityColors.text,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: "0.75rem",
                  }}
                >
                  <p
                    style={{
                      fontWeight: 600,
                      color: priorityColors.text,
                      fontSize: "0.925rem",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {notification.title}
                  </p>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {notification.date}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "sans-serif",
                    lineHeight: "1.4",
                    paddingLeft: "0.75rem",
                  }}
                >
                  {notification.description}
                </p>
              </div>
            );
          })
        ) : (
          <div
            style={{
              display: "flex",
              height: "200px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.5rem",
              border: "1px dashed rgba(240, 208, 120, 0.2)",
              backgroundColor: "#232323",
            }}
          >
            <div
              style={{
                margin: "0 auto",
                display: "flex",
                maxWidth: "420px",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontFamily: "sans-serif",
                }}
              >
                No new notifications
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
