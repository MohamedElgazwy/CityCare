import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Home() {
  return (
    <main className="px-6 py-14 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-8 lg:grid-cols-2">
        <div>
          <span className="mb-5 inline-flex w-fit items-center rounded-full border border-white/70 bg-white/60 px-4 py-1 text-sm text-slate-700 backdrop-blur">
            Trusted home services platform
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Premium home care experiences powered by verified local technicians.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            Discover experts, compare quality, and book with confidence through a refined digital experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/services"><Button>Browse Services</Button></Link>
            <Link href="/auth/register"><Button variant="secondary">Create Account</Button></Link>
          </div>
        </div>

        <Card className="relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-200/70 blur-2xl" />
          <h2 className="text-2xl font-semibold text-slate-900">Why CityCare</h2>
          <ul className="mt-5 space-y-3 text-slate-700">
            <li>• Cinematic booking flow with smooth interactions</li>
            <li>• Transparent pricing and quality-focused ratings</li>
            <li>• Role-based dashboards built for speed and clarity</li>
          </ul>
        </Card>
      </section>
    </main>
  );
}
