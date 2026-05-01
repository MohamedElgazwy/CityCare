import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-center px-6 py-16 lg:px-8">
        <span className="mb-5 inline-flex w-fit items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
          منصة موثوقة لخدمات المنزل
        </span>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          رعاية احترافية لمنزلك يقدمها فنّيون محليون موثوقون.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          تساعدك CityCare على العثور على محترفين مهرة، ومقارنة جودة الخدمة، والحجز بثقة خلال دقائق.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/services" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
            تصفح الخدمات
          </Link>
          <Link href="/auth/register" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100">
            إنشاء حساب
          </Link>
        </div>
      </section>
    </main>
  );
}
