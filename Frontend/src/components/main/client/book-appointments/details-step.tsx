"use client";

import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, X, FileText, File, Upload, PenSquare } from "lucide-react";

interface DetailsStepProps {
  description: string;
  onDescriptionChange: (description: string) => void;
  documents: File[];
  onDocumentsChange: (documents: File[]) => void;
}

export function DetailsStep({
  description,
  onDescriptionChange,
  documents,
  onDocumentsChange,
}: DetailsStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      onDocumentsChange([...documents, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onDocumentsChange([...documents, ...newFiles]);

      // Reset the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    onDocumentsChange(newDocuments);
  };

  // Get file icon based on file type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-400" />;
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-400" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-5 w-5 text-green-400" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <FileText className="h-5 w-5 text-[#d4af37]" />;
      default:
        return <File className="h-5 w-5 text-amber-100/70" />;
    }
  };

  return (
    <Card className="bg-[#21201f] border-0 shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-[#2a251e] border-b border-[#4d3f29]/30">
        <CardTitle className="text-xl font-bold text-[#d4af37]">
          Case Details
        </CardTitle>
        <CardDescription className="text-amber-100/70">
          Provide information about your case and upload any relevant documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-3">
          <p className="text-2xl font-medium mb-2 text-[#d4af37] flex items-center">
            <PenSquare className="h-5 w-5 mr-2" />
            Case Description
          </p>
          <Textarea
            id="description"
            placeholder="Please provide details about your case to help our lawyer prepare for the appointment..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="min-h-36 resize-y bg-[#383838] border-[#4d3f29]/40 focus:border-[#B8860B]/70 focus:ring-[#B8860B]/20 text-amber-100 text-base p-3"
          />
          <p className="text-sm text-amber-100/60">
            Include relevant details about your legal issue, background
            information, and what you hope to achieve from the consultation.
          </p>
        </div>

        <div className="w-full h-px bg-[#4d3f29]/30 my-2"></div>

        <div className="space-y-3">
          <p className="text-2xl font-medium mb-2 text-[#d4af37] flex items-center">
            <Paperclip className="h-5 w-5 mr-2" />
            Upload Documents (Optional)
          </p>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive
                ? "bg-[#3b3022] border-[#B8860B]"
                : "border-[#4d3f29]/40 bg-[#2a251e]/50"
            } transition-colors shadow-sm`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Input
              ref={fileInputRef}
              id="documents"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <Upload className="h-8 w-8 mx-auto mb-3 text-[#d4af37]" />
            <p className="text-base mb-2 text-amber-100">
              Drag and drop files here, or{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-[#d4af37] font-medium"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </Button>
            </p>
            <p className="text-sm text-amber-100/50">
              Supported file types: PDF, DOC, DOCX, JPG, PNG (max 10MB each)
            </p>
          </div>

          {documents.length > 0 && (
            <div className="mt-4 border border-[#4d3f29]/40 rounded-lg p-4 bg-[#2a251e]/30 shadow-sm">
              <h4 className="text-base font-medium mb-3 flex items-center">
                <FileText className="h-5 w-5 text-[#d4af37] mr-2" />
                Uploaded Documents ({documents.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#353434] p-3 rounded-md border border-[#4d3f29]/40"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      {getFileIcon(doc.name)}
                      <div className="overflow-hidden">
                        <span className="text-amber-100 truncate block">
                          {doc.name}
                        </span>
                        <span className="text-sm text-amber-100/50">
                          ({(doc.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                      className="h-8 w-8 p-0 text-amber-100/70 hover:text-red-400 hover:bg-[#2a251e] rounded-full ml-2"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
