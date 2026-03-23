"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { specializations } from "@/types/Lawyer";
import { registerLawyer } from "@/services/lawyers.service";
import { toast } from "react-hot-toast";
const initialFormData = {
  full_name: "",
  email: "",
  phone: "",
  specialization: "",
  bio: "",
};

export function RegisterLawyerModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const clearForm = () => {
    setFormData(initialFormData);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      clearForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("formData", formData);
      const response = await registerLawyer(formData);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      console.log("response", response);

      //   if (!response.ok) {
      //     throw new Error("Failed to register lawyer");
      //   }
      toast.success("Lawyer Registered Successfully");

      setOpen(false);
      clearForm();
      router.refresh();
    } catch (error) {
      console.error("Error registering lawyer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#B8860B] hover:bg-[#9A7209] text-black font-semibold h-9 px-4">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Lawyer
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#21201f] border-[#4d3f29]/30 text-amber-100 max-w-md">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold text-[#d4af37]">
            Register New Lawyer
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-amber-100/90">
              Full Name
            </label>
            <Input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="bg-[#353434] border-[#4d3f29]/30 text-amber-100 focus:border-[#B8860B] h-9 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-amber-100/90">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-[#353434] border-[#4d3f29]/30 text-amber-100 focus:border-[#B8860B] h-9 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-amber-100/90">
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="bg-[#353434] border-[#4d3f29]/30 text-amber-100 focus:border-[#B8860B] h-9 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-amber-100/90">
              Specialization
            </label>
            <Select
              value={formData.specialization}
              onValueChange={(value) =>
                setFormData({ ...formData, specialization: value })
              }
              required
            >
              <SelectTrigger className="bg-[#353434] border-[#4d3f29]/30 text-amber-100 focus:border-[#B8860B] h-9 text-sm">
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent className="bg-[#353434] border-[#4d3f29]/30">
                {specializations.map((spec) => (
                  <SelectItem
                    key={spec}
                    value={spec}
                    className="text-amber-100 focus:bg-[#2a251e] focus:text-[#d4af37] text-sm"
                  >
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-amber-100/90">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="bg-[#353434] border-[#4d3f29]/30 text-amber-100 focus:border-[#B8860B] min-h-[80px] text-sm resize-none"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="border-[#4d3f29]/40 text-amber-100 hover:bg-[#353434] hover:border-[#B8860B]/70 h-8 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#B8860B] hover:bg-[#9A7209] text-black font-semibold h-8 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Lawyer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
