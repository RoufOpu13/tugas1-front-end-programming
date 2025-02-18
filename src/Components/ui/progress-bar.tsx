// Components/ui/progress-bar.tsx
export function ProgressBar({ value }: { value: number }) {
    return (
      <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
        <div 
          className="bg-blue-500 h-2.5 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    );
  }
  