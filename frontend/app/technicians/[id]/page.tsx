import TechnicianDetails from '@/components/technician/TechnicianDetails';

type Props = { params: { id: string } | Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const p = await params;
  const id = Number(p.id);
  return <TechnicianDetails id={id} />;
}
