export function CartSkeleton() {
  return (
    <div className="bg-[#f0fbfb]">
      <div className="bg-[#f0fbfb]-highlight border-b border-[#008ca5]/10">
        <div className="w-full px-6 lg:px-10 xl:px-16 py-2.5">
          <div className="h-5 w-48 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="w-full px-6 lg:px-10 xl:px-16 py-8">
        <div className="h-14 bg-muted animate-pulse rounded-xl mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
