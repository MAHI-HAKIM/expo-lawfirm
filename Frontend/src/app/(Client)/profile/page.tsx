import { Metadata } from "next";
import { getCurrentUser } from "@/services/auth.service";
import { redirect } from "next/navigation";
import {
  ProfileForm,
  UserProfile,
} from "@/components/main/client/profile/profile-form";

export const metadata: Metadata = {
  title: "Profile | ExpoLaw",
  description: "Manage your account profile and settings",
};

export default async function ProfilePage() {
  // Get current authenticated user
  const user = await getCurrentUser();

  // Redirect to sign in if not authenticated
  if (!user) {
    redirect("/signin");
  }

  // Create profile object from user data
  const profile: UserProfile = {
    id: user.id,
    fullName: user.full_name || "",
    email: user.email,
    phone: user.phone || "",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-amber-100 mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
            <ProfileForm initialProfile={profile} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-serif text-amber-100 mb-4">
              Account Security
            </h2>
            <p className="text-gray-400 mb-4">
              Protect your account by using a strong password and updating it
              regularly.
            </p>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-[#2a251e]/50 rounded-md border border-[#4d3f29]/40">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-amber-100/70">
                  Your account is secure
                </span>
              </div>

              <p className="text-sm text-gray-400">
                Last sign in: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
