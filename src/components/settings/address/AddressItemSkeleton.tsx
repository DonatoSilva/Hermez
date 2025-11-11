export default function AddressItemSkeleton() {
    return (
        <div className="w-full col-span-1 max-w-full rounded-lg bg-neutral-200/80 dark:bg-neutral-800/80 relative px-4 py-3 flex items-center justify-between transition-all duration-200 overflow-hidden animate-pulse">
            <div className="flex-1">
                <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4"></div>
            </div>
            <div className="flex flex-col items-center gap-2 ml-4 z-10">
                <div className="w-9 h-9 rounded-md bg-neutral-300 dark:bg-neutral-700"></div>
                <div className="w-9 h-9 rounded-md bg-neutral-300 dark:bg-neutral-700"></div>
                <div className="w-9 h-9 rounded-md bg-neutral-300 dark:bg-neutral-700"></div>
            </div>
        </div>
    );
}