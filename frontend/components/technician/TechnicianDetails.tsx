"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";

type Review = {
  id: number;
  rating: number;
  comment: string;
  booking?: { id: number };
  user?: { id: number; email: string };
};

type Technician = {
  id: number;
  name: string;
  description: string;
  phone: string;
  price: number;
  rating: number;
  photoUrl?: string;
  photo?: string;
  category?: { id: number; name: string };
  reviews?: Review[];
};

export default function TechnicianDetails({ id }: { id: number }) {
  const [tech, setTech] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api(`/technicians/${id}`)
      .then((res) => mounted && setTech(res as Technician))
      .catch(() => setTech(null))
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <p className="p-6">جارٍ التحميل...</p>;
  if (!tech) return <p className="p-6">لم يتم العثور على الفنّي.</p>;

  const photo = tech.photoUrl || tech.photo;

  const getImageSrc = () => {
    if (!photo) return null;
    if (!photo.startsWith("http") && !photo.startsWith("/") && !photo.startsWith("data:")) {
      return `data:image/jpeg;base64,${photo}`;
    }
    return photo;
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* ===== Top Section ===== */}
        <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-sm border">

          {/* Image */}
          <div className="w-full  rounded-xl overflow-hidden bg-slate-100">
            {getImageSrc() ? (
              <img
                src={getImageSrc()!}
                alt={tech.name}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {tech.name}
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                {tech.category?.name || "فنّي عام"}
              </p>

              <p className="mt-4 text-slate-600 leading-relaxed">
                {tech.description}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-6 flex items-center gap-6">
              <span className="text-lg font-semibold text-slate-800">
                ${tech.price}
              </span>

              <span className="text-yellow-500 font-medium">
                ⭐ {tech.rating}
              </span>
            </div>

            {/* Contact */}
            <p className="text-sm text-slate-500 mt-3">
              📞 {tech.phone}
            </p>

            {/* CTA */}
            <div className="mt-6">
              <Button
                className="w-full"
                onClick={async () => {
                  try {
                    await api("/bookings", {
                      method: "POST",
                      body: JSON.stringify({ technicianId: tech.id }),
                    });
                    alert("تم إرسال طلب الحجز بنجاح!");
                  } catch {
                    alert("فشل حجز الفنّي.");
                  }
                }}
              >
                احجز الآن
              </Button>
            </div>
          </div>
        </div>

        {/* ===== التقييمات Section ===== */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-semibold text-slate-800">
            التقييمات
          </h2>

          {!tech.reviews || tech.reviews.length === 0 ? (
            <p className="mt-4 text-slate-500">لا توجد تقييمات بعد.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {tech.reviews.map((r) => (
                <div
                  key={r.id}
                  className="border rounded-xl p-4 flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium text-slate-700">
                      {r.booking?.user?.email || `مستخدم`}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {r.comment}
                    </p>
                  </div>

                  <div className="text-yellow-500 font-semibold">
                    ⭐ {r.rating}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}