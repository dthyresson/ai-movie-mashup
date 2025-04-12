import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
  className?: string;
}

export function ErrorDisplay({ message, className = "" }: ErrorDisplayProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 ${className}`}
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
