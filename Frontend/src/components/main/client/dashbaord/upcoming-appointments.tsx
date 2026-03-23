"use client";

import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getMyAppointments } from "@/services/appointments.service";
import { format, parseISO, isBefore, startOfToday } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllLawyers } from "@/services/lawyers.service";

interface AppointmentDisplay {
  id: number;
  title: string;
  lawyer: string;
  lawyerImage: string;
  date: string;
  time: string;
  status: string;
}

interface UpcomingAppointmentsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function UpcomingAppointments({ className }: UpcomingAppointmentsProps) {
  const [appointments, setAppointments] = useState<AppointmentDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const [appointmentsData, lawyers] = await Promise.all([
          getMyAppointments(),
          getAllLawyers(),
        ]);

        const today = startOfToday();

        // Filter for upcoming appointments only and sort by date
        const upcomingAppointments = appointmentsData
          .filter(
            (app) =>
              !isBefore(parseISO(app.date), today) && app.status !== "cancelled"
          )
          .sort(
            (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
          )
          .map((app) => {
            // Find the lawyer details
            const lawyer = lawyers.find((l) => l.id === app.lawyer);

            // Define a set of professional lawyer photos
            const lawyerPhotos = [
              "1560250097-0b93528c311a", // Professional man in suit
              "1573496359142-b8d87734a5a2", // Professional woman in business attire
              "1494790108377-be9c29b29330", // Professional woman smiling
              "1472099645785-5658abf4ff4e", // Professional man with glasses
              "1438761681033-6461ffad8d80", // Professional woman with laptop
              "1500648767791-00dcc994a43e", // Professional man smiling
              "1587614387466-0a72ca909e16", // Professional woman in office
              "1580489944761-15a19d654956", // Professional man in modern office
            ];

            // Get a consistent photo for each lawyer based on their ID
            const photoIndex = lawyer?.id
              ? (lawyer.id - 1) % lawyerPhotos.length
              : 0;
            const photoId = lawyerPhotos[photoIndex];

            return {
              id: app.id,
              title: app.case_type_id
                ? `Case #${app.case_type_id}`
                : "Legal Consultation",
              lawyer: lawyer?.full_name || "Unknown Lawyer",
              lawyerImage:
                lawyer?.profile_image ||
                `https://images.unsplash.com/photo-${photoId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80`,
              date: format(parseISO(app.date), "MMM d, yyyy"),
              time: app.time || "TBD",
              status: "pending",
            };
          })
          .slice(0, 5); // Show only the next 5 appointments

        setAppointments(upcomingAppointments);
      } catch (error) {
        console.error("Failed to load appointments:", error);
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointments();
  }, []);

  if (isLoading) {
    return (
      <Card
        className={className}
        style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid rgba(240, 208, 120, 0.2)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        <CardHeader
          className="pb-3"
          style={{
            borderBottom: "1px solid rgba(240, 208, 120, 0.15)",
            padding: "1.25rem",
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
            Upcoming Appointments
          </CardTitle>
          <CardDescription
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.875rem",
              fontFamily: "sans-serif",
            }}
          >
            Your scheduled consultations with our legal experts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" style={{ padding: "1.25rem" }}>
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(240, 208, 120, 0.15)",
                backgroundColor: "#232323",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={className}
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid rgba(240, 208, 120, 0.2)",
        borderRadius: "0.75rem",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      <CardHeader
        className="pb-3"
        style={{
          borderBottom: "1px solid rgba(240, 208, 120, 0.15)",
          padding: "1.25rem",
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
          Upcoming Appointments
        </CardTitle>
        <CardDescription
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.875rem",
            fontFamily: "sans-serif",
          }}
        >
          Your scheduled consultations with our legal experts
        </CardDescription>
      </CardHeader>
      <CardContent
        className="space-y-4"
        style={{
          padding: "1.25rem",
          backgroundColor: "#1A1A1A",
          maxHeight: "360px",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(240, 208, 120, 0.3) rgba(30, 30, 30, 0.1)",
          msOverflowStyle: "none",
        }}
      >
        <style jsx global>{`
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
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(240, 208, 120, 0.15)",
                backgroundColor: "#232323",
                transition: "all 0.2s ease",
                marginBottom: "0.5rem",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "rgba(240, 208, 120, 0.4)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "rgba(240, 208, 120, 0.15)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <img
                  src={appointment.lawyerImage}
                  alt={appointment.lawyer}
                  style={{
                    height: "3rem",
                    width: "3rem",
                    borderRadius: "50%",
                    border: "2px solid rgba(240, 208, 120, 0.3)",
                    objectFit: "cover",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <div>
                  <p
                    style={{
                      fontWeight: 500,
                      color: "#F0D078",
                      fontSize: "0.925rem",
                      marginBottom: "0.25rem",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {appointment.title}
                  </p>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.875rem",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {appointment.lawyer}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    color: "#F0D078",
                    fontSize: "0.875rem",
                    marginBottom: "0.25rem",
                    fontFamily: "sans-serif",
                  }}
                >
                  {appointment.date}
                </p>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.75rem",
                    fontFamily: "sans-serif",
                  }}
                >
                  {appointment.time}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <p>No upcoming appointments</p>
            <Link href="/book-appointment">
              <Button
                style={{
                  marginTop: "1rem",
                  backgroundColor: "rgba(240, 208, 120, 0.1)",
                  color: "#F0D078",
                  border: "1px solid rgba(240, 208, 120, 0.3)",
                }}
              >
                Book an Appointment
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
      {appointments.length > 0 && (
        <CardFooter
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid rgba(240, 208, 120, 0.15)",
          }}
        >
          <Link href="/my-appointments" style={{ width: "100%" }}>
            <Button
              style={{
                width: "100%",
                backgroundColor: "rgba(240, 208, 120, 0.1)",
                color: "#F0D078",
                border: "1px solid rgba(240, 208, 120, 0.3)",
              }}
            >
              View All Appointments
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
