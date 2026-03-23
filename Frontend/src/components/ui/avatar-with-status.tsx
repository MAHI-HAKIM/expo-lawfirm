
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppointmentStatus } from '@/types';

interface AvatarWithStatusProps {
  name: string;
  status?: AppointmentStatus;
  imageUrl?: string;
  className?: string;
}

export const AvatarWithStatus = ({ 
  name, 
  status, 
  imageUrl, 
  className
}: AvatarWithStatusProps) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const statusColors = {
    confirmed: 'bg-green-500',
    pending: 'bg-amber-500',
    completed: 'bg-blue-500',
    cancelled: 'bg-red-500',
  };

  return (
    <div className={cn("relative", className)}>
      <Avatar className="w-10 h-10 border border-gold/30">
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback className="bg-secondary text-secondary-foreground">{initials}</AvatarFallback>
      </Avatar>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};
