export default function FloatingBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-16 top-20 h-72 w-72 rounded-full bg-[#FDEBF4] blur-3xl" />
      <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[#E0F7FA] blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#F3E5F5] blur-3xl" />
      <div className="float-orb absolute left-1/4 top-1/4 h-8 w-8 rounded-full bg-white/70 shadow-lg" />
      <div className="float-orb-delay absolute right-1/4 top-1/2 h-10 w-10 rounded-full bg-white/60 shadow-lg" />
    </div>
  );
}
