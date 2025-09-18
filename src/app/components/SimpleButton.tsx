interface SimpleButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  textColor?: string;
}

export default function SimpleButton({
  label,
  onClick,
  disabled = false,
  textColor = "text-blue-600",
}: SimpleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${textColor} hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
}
