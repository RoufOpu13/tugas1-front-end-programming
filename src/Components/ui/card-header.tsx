export function CardHeader({ title, icon }: { title: string; icon?: React.ReactNode }) {
    return (
      <div className="flex items-center gap-3 border-b pb-3 mb-4">
        {icon && <div className="text-3xl text-blue-500">{icon}</div>}
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      </div>
    );
  }
  