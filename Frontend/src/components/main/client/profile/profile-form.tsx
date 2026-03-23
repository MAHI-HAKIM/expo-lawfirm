"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile, resetPassword } from "@/services/users.service";
import { Loader2, Save, Lock, User, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { PasswordResetModal } from "@/components/main/client/profile/password-reset-modal";

export interface UserProfile {
  id: string | number;
  fullName: string;
  email: string;
  phone: string;
}

interface ProfileFormProps {
  initialProfile: UserProfile;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProfile({
        full_name: profile.fullName,
        phone: profile.phone,
      });

      if (result.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setIsLoading(true);

    try {
      const result = await resetPassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (result.success) {
        toast.success("Password reset successfully");
        setIsPasswordModalOpen(false);
      } else {
        toast.error(result.error || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-4xl font-serif text-amber-100 mb-3">
          Personal Information
        </span>
        <p className="text-gray-400 mb-4">
          Update your personal details and contact information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-amber-100">
                <User className="h-4 w-4 inline mr-2" />
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={profile.fullName}
                onChange={handleInputChange}
                className="bg-[#2a2a2a] border-[#333] text-amber-100 focus:border-[#B8860B]"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-100">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                value={profile.email}
                disabled
                className="bg-[#222] border-[#333] text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">
                Email address cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-amber-100">
                <Phone className="h-4 w-4 inline mr-2" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                className="bg-[#2a2a2a] border-[#333] text-amber-100 focus:border-[#B8860B]"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPasswordModalOpen(true)}
            className="border-amber-600/50 text-amber-200 hover:bg-amber-900/30"
          >
            <Lock className="mr-2 h-4 w-4" /> Reset Password
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#B8860B] hover:bg-[#9A7209] text-black font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>

      <PasswordResetModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handleResetPassword}
        isLoading={isLoading}
      />
    </div>
  );
}
