import TourDetail from '@/components/tours/TourDetail';

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TourDetail slug={slug} />;
}
