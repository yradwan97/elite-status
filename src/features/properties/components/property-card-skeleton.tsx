export function PropertyCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
            <div className="relative h-56 bg-gray-200 animate-pulse p-2">
                <div className="w-full h-full rounded-2xl bg-gray-300" />
                <div className="absolute top-4 left-4 h-6 w-16 bg-gray-300 rounded-md" />
                <div className="absolute top-4 right-4 w-9 h-9 bg-gray-300 rounded-full" />
            </div>

            <div className="p-5 space-y-3 animate-pulse">
                {/* Title */}
                <div className="h-5 bg-gray-200 rounded-md w-3/4" />
                <div className="h-4 bg-gray-200 rounded-md w-1/2" />

                {/* Location */}
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
                    <div className="h-4 bg-gray-200 rounded-md w-2/3" />
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 pt-1">
                    <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
                    <div className="h-4 bg-gray-200 rounded-md w-16" />
                    <div className="h-8 bg-gray-200 rounded-md w-20" />
                    <div className="h-4 bg-gray-200 rounded-md w-8" />
                </div>

                {/* Capacity */}
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
                    <div className="h-4 bg-gray-200 rounded-md w-24" />
                </div>
            </div>
        </div>
    );
}