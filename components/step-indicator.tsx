interface StepIndicatorProps {
  number: number;
  text: string;
}

export default function StepIndicator({ number, text }: StepIndicatorProps) {
  return (
    <div className="flex items-center bg-background rounded-full w-full border p-2">
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-medium mr-3 text-xs">
        {number}
      </div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
