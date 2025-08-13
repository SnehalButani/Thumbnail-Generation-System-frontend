import React from "react";
import {
  CheckCircle,
  ErrorOutline,
  WarningAmber,
  Cancel,
} from "@mui/icons-material";

interface AlertMessageProps {
  message?: string;
  success?: string;
  type?: "success" | "error" | "warning" | "alert" | "info";
  onClose: () => void;
}

const alertStyles = {
  success: {
    bg: "bg-green-50",
    border: "border-green-600",
    text: "text-green-700",
    icon: <CheckCircle className="text-green-600 w-5 h-5" />,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-600",
    text: "text-red-700",
    icon: <ErrorOutline className="text-red-600 w-5 h-5" />,
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-600",
    text: "text-yellow-700",
    icon: <WarningAmber className="text-yellow-600 w-5 h-5" />,
  },
  alert: {
    bg: "bg-rose-50",
    border: "border-rose-600",
    text: "text-rose-700",
    icon: <Cancel className="text-rose-600 w-5 h-5" />,
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-600",
    text: "text-blue-700",
    icon: <CheckCircle className="text-blue-600 w-5 h-5" />,
  },
};

const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  success,
  type,
  onClose,
}) => {
  const content = message || success;
  if (!content) return null;

  const status = type || (success ? "success" : "error");
  const styles = alertStyles[status];

  return (
    <div
      className={`flex items-center gap-3 p-4 border-l-4 rounded-md shadow-sm
        ${styles.bg} ${styles.border} ${styles.text}`}
    >
      <div className="flex items-center justify-center">{styles.icon}</div>
      <div className="flex-1 text-sm font-medium">{content}</div>
      <button
        onClick={onClose}
        className="ml-4 text-xl font-bold leading-none focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
};

export default AlertMessage;
