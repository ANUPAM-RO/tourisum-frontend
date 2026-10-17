'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import {
  MapPin,
  Clock,
  Star,
  Heart,
  Share2,
  Camera,
  Ticket,
  Sun,
  Cloud,
  Droplets,
  Plane,
  Train,
  Bus,
  Car,
  Bike,
  UtensilsCrossed,
  Bed,
  AlertTriangle,
  Languages,
  Phone,
  Hospital,
  Flame,
  Download,
  MessageSquare,
  Upload,
  X,
  Loader2,
  Check,
  Ban,
  Compass,
  Wallet,
  Sparkles,
  Navigation,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { usePlaceBySlug, useToggleFavorite } from '@/lib/hooks';
import { useAuth } from '@/context/AuthContext';
import placeService from '@/services/placeService';
import api from '@/lib/api';
import { formatRating, cn } from '@/lib/utils';
import { InteractiveMap, MapMarker } from '@/components/map';
import {
  createHotelMarkers,
  createRestaurantMarkers,
  createNearbySpotMarkers,
} from '@/lib/mapHelpers';
import SafeImage from '@/components/shared/SafeImage';
import EmptyState from '@/components/shared/EmptyState';
import { placeLocation } from '@/components/shared/PlaceCard';
import PlaceHero from '@/components/places/PlaceHero';
import FactsStrip, { type Fact } from '@/components/places/FactsStrip';
import SectionNav, { type NavSection } from '@/components/places/SectionNav';
import DetailSection from '@/components/places/DetailSection';
import MiniCard from '@/components/places/MiniCard';
import AgencyCard from '@/components/booking/AgencyCard';

const REVIEWS_PREVIEW = 4;

const inr = (n?: number) => (typeof n === 'number' && n > 0 ? `₹${n.toLocaleString('en-IN')}` : null);

const outlineBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition-colors hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800';
const primaryBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-[transform,filter] duration-200 hover:brightness-110 active:scale-[0.98]';

function InfoTile({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-stone-50 p-4 dark:bg-stone-800/50">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm dark:bg-stone-900 dark:text-orange-400">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 text-sm">
        <h4 className="mb-0.5 font-semibold text-stone-900 dark:text-white">{title}</h4>
        <div className="space-y-0.5 text-stone-600 dark:text-stone-400">{children}</div>
      </div>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-white">{children}</h3>;
}

export default function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data: placeData, isLoading } = usePlaceBySlug(slug);
  const place = placeData?.data;
  const { isFavorite, toggle } = useToggleFavorite();

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const downloadItinerary = () => {
    if (!place) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Helper to add text with wrapping
    const addWrappedText = (text: string, x: number, yPos: number, maxWidth: number, lineHeight: number = 7) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, yPos);
      return yPos + lines.length * lineHeight;
    };

    // Title
    doc.setFontSize(24);
    doc.setTextColor(234, 88, 12); // Orange-600 (brand accent)
    y = addWrappedText(place.name, margin, y, pageWidth - margin * 2, 12);
    y += 5;

    // Location & Rating
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const location = placeLocation(place);
    y = addWrappedText(`Location: ${location}`, margin, y, pageWidth - margin * 2);
    y = addWrappedText(`Rating: ${formatRating(place.rating)}/5`, margin, y, pageWidth - margin * 2);
    y += 10;

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Description
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('About', margin, y);
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    y = addWrappedText(place.description || '', margin, y, pageWidth - margin * 2);
    y += 10;

    // Quick Info
    if (place.entryFee || place.openingTime || place.bestTimeToVisit) {
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Quick Info', margin, y);
      y += 8;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      if (place.entryFee) y = addWrappedText(`Entry Fee: ${place.entryFee}`, margin, y, pageWidth - margin * 2);
      if (place.openingTime && place.closingTime) y = addWrappedText(`Timings: ${place.openingTime} - ${place.closingTime}`, margin, y, pageWidth - margin * 2);
      if (place.bestTimeToVisit) y = addWrappedText(`Best Time to Visit: ${place.bestTimeToVisit}`, margin, y, pageWidth - margin * 2);
      y += 10;
    }

    // Highlights
    if (place.highlights && place.highlights.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Highlights', margin, y);
      y += 8;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      place.highlights.forEach((h: string) => {
        y = addWrappedText(`• ${h}`, margin, y, pageWidth - margin * 2);
      });
      y += 10;
    }

    // Transportation
    if (place.transportation) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('How to Reach', margin, y);
      y += 8;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      if (place.transportation.byFlight?.nearestAirport) {
        y = addWrappedText(`By Flight: ${place.transportation.byFlight.nearestAirport} (${place.transportation.byFlight.distance})`, margin, y, pageWidth - margin * 2);
      }
      if (place.transportation.byTrain?.nearestStation) {
        y = addWrappedText(`By Train: ${place.transportation.byTrain.nearestStation} (${place.transportation.byTrain.distance})`, margin, y, pageWidth - margin * 2);
      }
      if (place.transportation.byBus?.busStand) {
        y = addWrappedText(`By Bus: ${place.transportation.byBus.busStand}`, margin, y, pageWidth - margin * 2);
      }
      y += 10;
    }

    // Safety & Emergency
    if (place.emergencyNumbers) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Safety & Emergency', margin, y);
      y += 8;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      if (place.emergencyNumbers.police) y = addWrappedText(`Police: ${place.emergencyNumbers.police}`, margin, y, pageWidth - margin * 2);
      if (place.emergencyNumbers.ambulance) y = addWrappedText(`Ambulance: ${place.emergencyNumbers.ambulance}`, margin, y, pageWidth - margin * 2);
      y += 10;
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by India Tourism Guide', margin, doc.internal.pageSize.getHeight() - 10);

    doc.save(`${place.slug}-itinerary.pdf`);
    toast.success('Itinerary downloaded successfully!');
  };

  const sharePlace = async () => {
    if (!place) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: place.name, text: place.description?.slice(0, 120), url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch (err) {
      // User dismissed the native share sheet — nothing to report.
      if ((err as Error)?.name !== 'AbortError') toast.error('Could not share this page');
    }
  };

  const openReviewDialog = () => {
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      router.push('/auth/login');
      return;
    }
    setReviewDialogOpen(true);
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e: any) => {
      const files = Array.from(e.target.files) as File[];
      if (!files.length) return;
      setUploadingPhotos(true);
      try {
        const fd = new FormData();
        files.forEach((f) => fd.append('images', f));
        const res = await api.post('/upload/multiple', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data.success) {
          const urls = res.data.data.map((img: any) => img.url);
          setReviewPhotos((prev) => [...prev, ...urls]);
        }
      } catch {
        toast.error('Photo upload failed');
      } finally {
        setUploadingPhotos(false);
      }
    };
    input.click();
  };

  const removeReviewPhoto = (index: number) => {
    setReviewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const resetReviewForm = () => {
    setReviewRating(0);
    setHoverRating(0);
    setReviewComment('');
    setReviewPhotos([]);
  };

  const handleSubmitReview = async () => {
    if (!place) return;
    if (reviewRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Please write about your experience');
      return;
    }
    setSubmittingReview(true);
    try {
      await placeService.addReview(place._id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
        photos: reviewPhotos,
      });
      toast.success('Thanks for sharing your experience!');
      setReviewDialogOpen(false);
      resetReviewForm();
      queryClient.invalidateQueries({ queryKey: ['place', slug] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const mapMarkers: MapMarker[] = [];

  if (place) {
    if (place.location?.latitude && place.location?.longitude) {
      mapMarkers.push({
        id: place._id,
        name: place.name,
        lat: place.location.latitude,
        lng: place.location.longitude,
        type: 'place',
        description: place.description?.substring(0, 100),
        extraInfo: {
          ...(place.entryFee && { 'Entry Fee': place.entryFee }),
          ...(place.rating && { Rating: `${place.rating}/5` }),
        },
      });
    }

    if (place.nearbySpots?.length) {
      mapMarkers.push(...createNearbySpotMarkers(place.nearbySpots));
    }

    if (place.hotels?.length) {
      mapMarkers.push(...createHotelMarkers(place.hotels));
    }

    if (place.restaurants?.length) {
      mapMarkers.push(...createRestaurantMarkers(place.restaurants));
    }
  }

  const mapCenter: [number, number] = place?.location?.latitude && place?.location?.longitude
    ? [place.location.latitude, place.location.longitude]
    : [20.5937, 78.9629];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950" aria-busy="true">
        <div className="h-[72svh] min-h-[540px] max-h-[780px] animate-pulse bg-stone-300 dark:bg-stone-800" />
        <div className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-24 animate-pulse rounded-2xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-6 lg:col-span-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-white dark:bg-stone-900" />
            ))}
          </div>
          <div className="hidden h-80 animate-pulse rounded-2xl bg-white dark:bg-stone-900 lg:block" />
        </div>
        <span className="sr-only">Loading place details...</span>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 pt-16 dark:bg-stone-950 lg:pt-[68px]">
        <EmptyState
          icon={MapPin}
          title="Place not found"
          description="This destination may have moved or is no longer listed."
          className="max-w-lg"
          action={
            <Link
              href="/places"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 dark:bg-white dark:text-stone-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to places
            </Link>
          }
        />
      </div>
    );
  }

  const favorite = isFavorite(place._id);
  const isFree = !place.entryFee || place.entryFee.toLowerCase().includes('free');
  const timings = place.openingTime && place.closingTime ? `${place.openingTime} – ${place.closingTime}` : place.openingTime || 'Open all day';
  const reviews = place.reviews ?? [];
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, REVIEWS_PREVIEW);

  const nearbySpots = (place.nearbySpots ?? []).filter((s) => s.place && typeof s.place === 'object' && s.place.slug);
  const hotels = (place.hotels ?? []).filter((h) => h && typeof h === 'object' && h.slug);
  const restaurants = (place.restaurants ?? []).filter((r) => r && typeof r === 'object' && r.slug);

  const transport = place.transportation;
  const hasTransport = !!(
    transport?.byFlight?.nearestAirport ||
    transport?.byTrain?.nearestStation ||
    transport?.byBus?.busStand ||
    transport?.privateCab ||
    transport?.bikeRental
  );
  const hasWeather = !!(place.weather?.summer || place.weather?.winter || place.weather?.monsoon);
  const costTiers = [
    { key: 'budget', label: 'Budget', note: 'Hostels, local food, shared transport', data: place.estimatedCost?.budget },
    { key: 'standard', label: 'Standard', note: '3★ hotels, cafés, private cabs', data: place.estimatedCost?.standard },
    { key: 'luxury', label: 'Luxury', note: 'Premium stays and fine dining', data: place.estimatedCost?.luxury },
  ].filter((t) => t.data?.total);
  const emergency = place.emergencyNumbers;
  const hasEmergency = !!(emergency?.police || emergency?.ambulance || emergency?.fire || place.localLanguage);
  const dos = place.travelTips?.dos ?? [];
  const donts = place.travelTips?.donts ?? [];
  const hasTips = (place.thingsToKnow?.length ?? 0) > 0 || dos.length > 0 || donts.length > 0 || hasEmergency;
  const hasStayEat = hotels.length > 0 || restaurants.length > 0 || (place.localFoods?.length ?? 0) > 0;

  const facts: Fact[] = [
    {
      icon: Star,
      label: 'Rating',
      value: (
        <>
          {formatRating(place.rating)}
          <span className="font-normal text-stone-500"> / 5 · {reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
        </>
      ),
    },
    { icon: Sun, label: 'Best time', value: place.bestTimeToVisit || 'Year-round' },
    { icon: Clock, label: 'Timings', value: timings },
    { icon: Ticket, label: 'Entry fee', value: isFree ? 'Free' : place.entryFee, tone: isFree ? 'success' : 'default' },
    { icon: Camera, label: 'Photography', value: place.photography !== false ? 'Allowed' : 'Not allowed' },
  ];

  const sections: NavSection[] = [
    { id: 'overview', label: 'Overview' },
    hasTips && { id: 'tips', label: 'Know before you go' },
    hasWeather && { id: 'weather', label: 'Weather' },
    hasTransport && { id: 'getting-there', label: 'Getting there' },
    costTiers.length > 0 && { id: 'budget', label: 'Budget' },
    nearbySpots.length > 0 && { id: 'nearby', label: 'Nearby' },
    hasStayEat && { id: 'stay-eat', label: 'Stay & eat' },
    place.videos?.length > 0 && { id: 'videos', label: 'Videos' },
    mapMarkers.length > 0 && { id: 'map', label: 'Map' },
    place.faqs?.length > 0 && { id: 'faqs', label: 'FAQs' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
  ].filter(Boolean) as NavSection[];

  return (
    <div className="bg-stone-50 dark:bg-stone-950">
      <PlaceHero
        key={place._id}
        place={place}
        favorite={favorite}
        onToggleFavorite={() => toggle(place._id)}
        onShare={sharePlace}
      />

      <FactsStrip facts={facts} />

      {/* Mobile quick actions (desktop has the sidebar card) */}
      <div className="mx-auto mt-4 grid max-w-7xl grid-cols-3 gap-2 px-4 sm:px-6 lg:hidden">
        <button type="button" onClick={() => toggle(place._id)} className={cn(outlineBtn, 'px-2')} aria-pressed={favorite}>
          <Heart className={cn('h-4 w-4', favorite && 'fill-rose-500 text-rose-500')} />
          {favorite ? 'Saved' : 'Save'}
        </button>
        <button type="button" onClick={openReviewDialog} className={cn(outlineBtn, 'px-2')}>
          <MessageSquare className="h-4 w-4" />
          Review
        </button>
        <button type="button" onClick={downloadItinerary} className={cn(primaryBtn, 'px-2 py-2.5')}>
          <Download className="h-4 w-4" />
          Itinerary
        </button>
      </div>

      {/* Spacer, not a wrapper: the nav must be a direct child of the page so it can stick. */}
      <div className="h-6 md:h-8" />
      <SectionNav sections={sections} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main column */}
          <div className="min-w-0 space-y-6 lg:col-span-2">
            {/* Overview */}
            <DetailSection id="overview" eyebrow="Overview" title={<>About {place.name}</>}>
              <p className="whitespace-pre-line text-base leading-relaxed text-stone-600 dark:text-stone-300">{place.description}</p>
              {place.history && (
                <div className="mt-8">
                  <SubHeading>History</SubHeading>
                  <p className="whitespace-pre-line leading-relaxed text-stone-600 dark:text-stone-300">{place.history}</p>
                </div>
              )}
              {place.highlights && place.highlights.length > 0 && (
                <div className="mt-8">
                  <SubHeading>Highlights</SubHeading>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {place.highlights.map((highlight: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 rounded-xl bg-stone-50 p-3 dark:bg-stone-800/50">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                        <span className="text-sm text-stone-700 dark:text-stone-300">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </DetailSection>

            {/* Know before you go */}
            {hasTips && (
              <DetailSection id="tips" eyebrow="Plan ahead" title="Know before you go">
                {place.thingsToKnow && place.thingsToKnow.length > 0 && (
                  <ol className="space-y-3">
                    {place.thingsToKnow.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/60 p-3.5 dark:border-orange-900/40 dark:bg-orange-950/20">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-xs font-semibold text-white">
                          {index + 1}
                        </span>
                        <span className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">{tip}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {(dos.length > 0 || donts.length > 0) && (
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {dos.length > 0 && (
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                        <h4 className="mb-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">Do</h4>
                        <ul className="space-y-2">
                          {dos.map((d, i) => (
                            <li key={i} className="flex gap-2 text-sm text-stone-700 dark:text-stone-300">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {donts.length > 0 && (
                      <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
                        <h4 className="mb-3 text-sm font-semibold text-rose-700 dark:text-rose-400">Don&apos;t</h4>
                        <ul className="space-y-2">
                          {donts.map((d, i) => (
                            <li key={i} className="flex gap-2 text-sm text-stone-700 dark:text-stone-300">
                              <Ban className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {hasEmergency && (
                  <div className="mt-8">
                    <SubHeading>
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Safety &amp; emergency
                      </span>
                    </SubHeading>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { icon: Phone, label: 'Police', value: emergency?.police, tel: true },
                        { icon: Hospital, label: 'Ambulance', value: emergency?.ambulance, tel: true },
                        { icon: Flame, label: 'Fire', value: emergency?.fire, tel: true },
                        { icon: Languages, label: 'Language', value: place.localLanguage, tel: false },
                      ]
                        .filter((c) => c.value)
                        .map(({ icon: Icon, label, value, tel }) => {
                          const content = (
                            <>
                              <Icon className="h-4 w-4 text-orange-500" />
                              <span className="mt-2 block text-xs uppercase tracking-wider text-stone-500">{label}</span>
                              <span className="block truncate font-semibold text-stone-900 dark:text-white">{value}</span>
                            </>
                          );
                          return tel ? (
                            <a
                              key={label}
                              href={`tel:${String(value).replace(/\s+/g, '')}`}
                              className="rounded-xl bg-stone-50 p-3.5 text-sm transition-colors hover:bg-orange-50 dark:bg-stone-800/50 dark:hover:bg-orange-950/30"
                            >
                              {content}
                            </a>
                          ) : (
                            <div key={label} className="rounded-xl bg-stone-50 p-3.5 text-sm dark:bg-stone-800/50">{content}</div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </DetailSection>
            )}

            {/* Weather */}
            {hasWeather && (
              <DetailSection id="weather" eyebrow="Seasons" title="Weather through the year">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { icon: Sun, label: 'Summer', text: place.weather.summer, color: 'text-amber-500' },
                    { icon: Cloud, label: 'Winter', text: place.weather.winter, color: 'text-sky-500' },
                    { icon: Droplets, label: 'Monsoon', text: place.weather.monsoon, color: 'text-cyan-500' },
                  ]
                    .filter((w) => w.text)
                    .map(({ icon: Icon, label, text, color }) => (
                      <div key={label} className="rounded-xl bg-stone-50 p-5 dark:bg-stone-800/50">
                        <Icon className={cn('mb-3 h-7 w-7', color)} />
                        <h4 className="mb-1 font-semibold text-stone-900 dark:text-white">{label}</h4>
                        <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">{text}</p>
                      </div>
                    ))}
                </div>
              </DetailSection>
            )}

            {/* Getting there */}
            {hasTransport && transport && (
              <DetailSection id="getting-there" eyebrow="Travel" title="How to reach">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {transport.byFlight?.nearestAirport && (
                    <InfoTile icon={Plane} title="By flight">
                      <p>{transport.byFlight.nearestAirport}{transport.byFlight.distance && ` · ${transport.byFlight.distance}`}</p>
                      {transport.byFlight.cabCost && <p className="text-stone-500">Cab: {transport.byFlight.cabCost}</p>}
                    </InfoTile>
                  )}
                  {transport.byTrain?.nearestStation && (
                    <InfoTile icon={Train} title="By train">
                      <p>{transport.byTrain.nearestStation}{transport.byTrain.distance && ` · ${transport.byTrain.distance}`}</p>
                      {transport.byTrain.taxiFare && <p className="text-stone-500">Taxi/Auto: {transport.byTrain.taxiFare}</p>}
                    </InfoTile>
                  )}
                  {transport.byBus?.busStand && (
                    <InfoTile icon={Bus} title="By bus">
                      <p>{transport.byBus.busStand}</p>
                      {transport.byBus.autoFare && <p className="text-stone-500">Auto/Taxi: {transport.byBus.autoFare}</p>}
                    </InfoTile>
                  )}
                  {transport.privateCab && (
                    <InfoTile icon={Car} title="Private cab">
                      <p>{transport.privateCab}</p>
                    </InfoTile>
                  )}
                  {transport.bikeRental && (
                    <InfoTile icon={Bike} title="Bike rental">
                      <p>{transport.bikeRental}</p>
                    </InfoTile>
                  )}
                </div>
              </DetailSection>
            )}

            {/* Budget */}
            {costTiers.length > 0 && (
              <DetailSection
                id="budget"
                eyebrow="Budget"
                title="Estimated cost per day"
                action={
                  <button type="button" onClick={downloadItinerary} className={outlineBtn}>
                    <Download className="h-4 w-4" />
                    Download itinerary
                  </button>
                }
              >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {costTiers.map((tier, i) => {
                    const d = tier.data!;
                    const breakdown = [
                      ['Hotel', d.hotel],
                      ['Food', d.food],
                      ['Travel', d.travel],
                      ['Tickets', d.tickets],
                      ['Shopping', d.shopping],
                    ].filter(([, v]) => v);
                    const featured = i === 1 || costTiers.length === 1;
                    return (
                      <div
                        key={tier.key}
                        className={cn(
                          'flex flex-col rounded-2xl border p-5',
                          featured
                            ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-rose-50 dark:border-orange-900/50 dark:from-orange-950/30 dark:to-rose-950/20'
                            : 'border-stone-200/80 bg-stone-50/60 dark:border-stone-800 dark:bg-stone-800/40'
                        )}
                      >
                        <p className="flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-white">
                          <Wallet className="h-4 w-4 text-orange-500" />
                          {tier.label}
                        </p>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{tier.note}</p>
                        <p className="mt-4 font-display text-3xl font-semibold tracking-tight text-stone-900 dark:text-white">
                          {d.total}
                          <span className="ml-1 font-sans text-sm font-normal text-stone-500">/day</span>
                        </p>
                        {breakdown.length > 0 && (
                          <dl className="mt-4 space-y-1.5 border-t border-stone-200/70 pt-4 text-sm dark:border-stone-700">
                            {breakdown.map(([k, v]) => (
                              <div key={k} className="flex justify-between gap-3">
                                <dt className="text-stone-500 dark:text-stone-400">{k}</dt>
                                <dd className="text-right font-medium text-stone-800 dark:text-stone-200">{v}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                      </div>
                    );
                  })}
                </div>
              </DetailSection>
            )}

            {/* Nearby spots */}
            {nearbySpots.length > 0 && (
              <DetailSection id="nearby" eyebrow="Around here" title="Nearby spots">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {nearbySpots.map((spot, i) => (
                    <MiniCard
                      key={spot.place._id || spot.place.slug}
                      index={i}
                      href={`/places/${spot.place.slug}`}
                      image={spot.place.images?.[0]}
                      title={spot.place.name}
                      badge={spot.category || spot.place.category?.[0]}
                      meta={
                        <>
                          {spot.distance && (
                            <span className="flex items-center gap-1.5"><Navigation className="h-3.5 w-3.5 text-orange-500" />{spot.distance}</span>
                          )}
                          {spot.travelTime && (
                            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-orange-500" />{spot.travelTime}</span>
                          )}
                          {spot.entryFee && (
                            <span className="flex items-center gap-1.5"><Ticket className="h-3.5 w-3.5 text-orange-500" />{spot.entryFee}</span>
                          )}
                        </>
                      }
                    />
                  ))}
                </div>
              </DetailSection>
            )}

            {/* Stay & eat */}
            {hasStayEat && (
              <DetailSection id="stay-eat" eyebrow="Stay & eat" title="Where to stay and eat">
                {hotels.length > 0 && (
                  <div>
                    <SubHeading>
                      <span className="flex items-center gap-2"><Bed className="h-5 w-5 text-orange-500" />Hotels</span>
                    </SubHeading>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {hotels.map((hotel, i) => (
                        <MiniCard
                          key={hotel._id}
                          index={i}
                          href={`/hotels/${hotel.slug}`}
                          image={hotel.images?.[0]}
                          title={hotel.name}
                          badge={
                            hotel.starRating > 0 ? (
                              <>
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {hotel.starRating}-star
                              </>
                            ) : undefined
                          }
                          subtitle={hotel.distance || hotel.address ? <span className="line-clamp-1">{hotel.distance || hotel.address}</span> : undefined}
                          meta={
                            inr(hotel.pricePerNight) ? (
                              <span>
                                <span className="font-semibold text-stone-900 dark:text-white">{inr(hotel.pricePerNight)}</span>
                                <span className="text-stone-500"> / night</span>
                              </span>
                            ) : undefined
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {restaurants.length > 0 && (
                  <div className={cn(hotels.length > 0 && 'mt-10')}>
                    <SubHeading>
                      <span className="flex items-center gap-2"><UtensilsCrossed className="h-5 w-5 text-orange-500" />Restaurants</span>
                    </SubHeading>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {restaurants.map((r, i) => (
                        <MiniCard
                          key={r._id}
                          index={i}
                          href={`/restaurants/${r.slug}`}
                          image={r.images?.[0]}
                          title={r.name}
                          badge={
                            r.rating > 0 ? (
                              <>
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {formatRating(r.rating)}
                              </>
                            ) : undefined
                          }
                          subtitle={r.cuisine?.length ? <span className="line-clamp-1">{r.cuisine.join(' · ')}</span> : undefined}
                          meta={
                            <>
                              {inr(r.averageCost) && (
                                <span>
                                  <span className="font-semibold text-stone-900 dark:text-white">{inr(r.averageCost)}</span>
                                  <span className="text-stone-500"> avg</span>
                                </span>
                              )}
                              {r.vegNonVeg && (
                                <span
                                  className={cn(
                                    'rounded-full px-2 py-0.5 text-xs font-medium',
                                    r.vegNonVeg === 'veg'
                                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                      : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                                  )}
                                >
                                  {r.vegNonVeg === 'veg' ? 'Pure veg' : r.vegNonVeg === 'non-veg' ? 'Non-veg' : 'Veg & non-veg'}
                                </span>
                              )}
                            </>
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {place.localFoods && place.localFoods.length > 0 && (
                  <div className={cn((hotels.length > 0 || restaurants.length > 0) && 'mt-10')}>
                    <SubHeading>Local foods to try</SubHeading>
                    <div className="flex flex-wrap gap-2">
                      {place.localFoods.map((food: string) => (
                        <span
                          key={food}
                          className="rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-sm font-medium text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-300"
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </DetailSection>
            )}

            {/* Videos */}
            {place.videos && place.videos.length > 0 && (
              <DetailSection id="videos" eyebrow="Watch" title="Videos">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {place.videos.map((video: string, index: number) => (
                    <div key={index} className="overflow-hidden rounded-xl bg-stone-900">
                      <iframe
                        src={video}
                        className="aspect-video w-full"
                        allowFullScreen
                        loading="lazy"
                        title={`${place.name} video ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </DetailSection>
            )}

            {/* Map */}
            {mapMarkers.length > 0 && (
              <DetailSection id="map" eyebrow="Explore" title="On the map">
                <p className="-mt-3 mb-5 text-sm text-stone-500 dark:text-stone-400">
                  {mapMarkers.length} location{mapMarkers.length !== 1 ? 's' : ''} including nearby spots, hotels &amp; restaurants
                </p>
                <div className="overflow-hidden rounded-xl">
                  <InteractiveMap
                    center={mapCenter}
                    zoom={12}
                    markers={mapMarkers}
                    height="440px"
                    showLegend={true}
                  />
                </div>
              </DetailSection>
            )}

            {/* FAQs */}
            {place.faqs && place.faqs.length > 0 && (
              <DetailSection id="faqs" eyebrow="Questions" title="Frequently asked">
                <Accordion>
                  {place.faqs.map((faq: { question: string; answer: string }, index: number) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-stone-200 dark:border-stone-800">
                      <AccordionTrigger className="py-4 text-base font-semibold text-stone-900 hover:no-underline dark:text-white">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="leading-relaxed text-stone-600 dark:text-stone-400">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </DetailSection>
            )}

            {/* Reviews */}
            <DetailSection
              id="reviews"
              eyebrow="Traveller stories"
              title="Reviews"
              action={
                <button type="button" onClick={openReviewDialog} className={primaryBtn}>
                  <MessageSquare className="h-4 w-4" />
                  Write a review
                </button>
              }
            >
              {reviews.length > 0 ? (
                <>
                  <div className="mb-6 flex items-center gap-4 rounded-xl bg-stone-50 p-4 dark:bg-stone-800/50">
                    <p className="font-display text-4xl font-semibold text-stone-900 dark:text-white">{formatRating(place.rating)}</p>
                    <div>
                      <div className="flex gap-0.5" aria-hidden>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn('h-4 w-4', s <= Math.round(Number(place.rating) || 0) ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-600')}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                        Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <ul className="divide-y divide-stone-100 dark:divide-stone-800">
                    {visibleReviews.map((review, index) => (
                      <li key={index} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                        {review.user?.avatar ? (
                          <SafeImage src={review.user.avatar} width={96} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                        ) : (
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 font-semibold text-white">
                            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold text-stone-900 dark:text-white">{review.user?.name || 'Anonymous'}</h4>
                              <p className="text-xs text-stone-500">
                                {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              {review.rating}
                            </span>
                          </div>
                          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-stone-600 dark:text-stone-300">{review.comment}</p>
                          {review.photos && review.photos.length > 0 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto">
                              {review.photos.map((photo: string, i: number) => (
                                <a key={i} href={photo} target="_blank" rel="noopener noreferrer" className="shrink-0 overflow-hidden rounded-lg">
                                  <SafeImage src={photo} width={200} alt={`Photo ${i + 1} from ${review.user?.name || 'a traveller'}`} className="h-20 w-20 object-cover" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {reviews.length > REVIEWS_PREVIEW && (
                    <button
                      type="button"
                      onClick={() => setShowAllReviews((v) => !v)}
                      className={cn(outlineBtn, 'mt-6 w-full')}
                    >
                      {showAllReviews ? 'Show fewer reviews' : `Show all ${reviews.length} reviews`}
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center rounded-xl border border-dashed border-stone-300 px-6 py-10 text-center dark:border-stone-700">
                  <MessageSquare className="mb-3 h-8 w-8 text-orange-400" />
                  <p className="font-semibold text-stone-900 dark:text-white">No reviews yet</p>
                  <p className="mt-1 text-sm text-stone-500">Be the first to share your experience!</p>
                </div>
              )}
            </DetailSection>

            <AgencyCard destination={place.name} className="lg:hidden" />
          </div>

          {/* Sidebar summary (desktop) */}
          <aside className="hidden lg:block">
            <AgencyCard destination={place.name} className="mb-4" />
            <div className="sticky top-[140px] space-y-4">
              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xl shadow-stone-900/5 dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Entry fee</p>
                    <p className={cn('mt-1 font-display text-3xl font-semibold tracking-tight', isFree ? 'text-emerald-600' : 'text-stone-900 dark:text-white')}>
                      {isFree ? 'Free' : place.entryFee}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {formatRating(place.rating)}
                  </span>
                </div>

                <dl className="mt-5 space-y-3 border-t border-stone-100 pt-5 text-sm dark:border-stone-800">
                  {[
                    { icon: Clock, label: 'Timings', value: timings },
                    { icon: Sun, label: 'Best time', value: place.bestTimeToVisit || 'Year-round' },
                    { icon: MapPin, label: 'Location', value: placeLocation(place) },
                    { icon: Languages, label: 'Language', value: place.localLanguage },
                  ]
                    .filter((r) => r.value)
                    .map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                        <dt className="w-20 shrink-0 text-stone-500">{label}</dt>
                        <dd className="min-w-0 font-medium text-stone-900 dark:text-white">{value}</dd>
                      </div>
                    ))}
                  {costTiers[0] && (
                    <div className="flex items-start gap-3">
                      <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                      <dt className="w-20 shrink-0 text-stone-500">Budget</dt>
                      <dd className="min-w-0 font-medium text-stone-900 dark:text-white">
                        from {costTiers[0].data!.total}/day
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-6 space-y-2">
                  <button type="button" onClick={downloadItinerary} className={cn(primaryBtn, 'w-full')}>
                    <Download className="h-4 w-4" />
                    Download itinerary
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => toggle(place._id)} className={outlineBtn} aria-pressed={favorite}>
                      <Heart className={cn('h-4 w-4', favorite && 'fill-rose-500 text-rose-500')} />
                      {favorite ? 'Saved' : 'Save'}
                    </button>
                    <button type="button" onClick={sharePlace} className={outlineBtn}>
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                  <button type="button" onClick={openReviewDialog} className={cn(outlineBtn, 'w-full')}>
                    <MessageSquare className="h-4 w-4" />
                    Write a review
                  </button>
                </div>
              </div>

              <Link
                href="/places"
                className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-300 p-4 text-sm font-medium text-stone-600 transition-colors hover:border-orange-300 hover:text-orange-600 dark:border-stone-700 dark:text-stone-400"
              >
                <Compass className="h-4 w-4" />
                Explore more destinations
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Write Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={(open) => { setReviewDialogOpen(open); if (!open) resetReviewForm(); }}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-semibold tracking-tight">Share your experience</DialogTitle>
            <DialogDescription>Tell others about your visit to {place.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Your rating</label>
              <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    aria-pressed={reviewRating === star}
                    className="rounded-md p-0.5 transition-transform duration-150 hover:scale-110"
                  >
                    <Star
                      className={cn(
                        'h-8 w-8 transition-colors',
                        star <= (hoverRating || reviewRating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-600'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="review-comment" className="mb-2 block text-sm font-medium">Your experience</label>
              <Textarea
                id="review-comment"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience, tips, or memories from your visit..."
                rows={4}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Photos</label>
              {reviewPhotos.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {reviewPhotos.map((photo, i) => (
                    <div key={i} className="relative">
                      <SafeImage src={photo} width={200} alt="" className="h-20 w-20 rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => removeReviewPhoto(i)}
                        className="absolute -right-1.5 -top-1.5 rounded-full bg-stone-900 p-1 text-white shadow transition-colors hover:bg-rose-500"
                        aria-label="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <Button type="button" variant="outline" onClick={handlePhotoUpload} disabled={uploadingPhotos}>
                {uploadingPhotos ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Add photos
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button
              type="button"
              onClick={handleSubmitReview}
              disabled={submittingReview || uploadingPhotos}
              className="border-0 bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:brightness-110"
            >
              {submittingReview ? 'Submitting...' : 'Submit review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
