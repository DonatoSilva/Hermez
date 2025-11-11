export default function VehicleItemSkeleton() {
  return (
    <div className="w-full rounded-md col-span-1 overflow-hidden border border-gray-200 animate-pulse">
      <div className="w-full h-20 bg-gray-300 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-400"></div>
          <div className="h-4 w-20 bg-gray-400 rounded"></div>
        </div>
        <div className="h-6 w-24 bg-gray-400 rounded"></div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-gray-300 rounded"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-gray-300"></div>
          <div className="w-10 h-10 rounded-md bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}