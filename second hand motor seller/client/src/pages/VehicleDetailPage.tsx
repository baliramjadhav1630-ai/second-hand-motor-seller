import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Vehicle } from '../types/index.js';
import { apiRequest } from '../api/client.js';
import { useFavorites } from '../context/FavoritesContext.js';
import { VehicleCanvas } from '../components/3d/VehicleCanvas.js';
import { TestDriveModal } from '../components/modals/TestDriveModal.js';
import { MakeOfferModal } from '../components/modals/MakeOfferModal.js';
import { Badge } from '../components/common/Badge.js';
import {
  Heart,
  Calendar,
  DollarSign,
  Sparkles,
  ShieldCheck,
  Zap,
  Gauge,
  MapPin,
  CheckCircle2,
  Clock,
  Wrench,
  Images,
  Box,
  Share2,
  ChevronRight,
  Send,
  UserCheck
} from 'lucide-react';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaMode, setMediaMode] = useState<'3d' | 'photos'>('3d');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [customPaintColor, setCustomPaintColor] = useState('#00f0ff');

  // Modals state
  const [testDriveOpen, setTestDriveOpen] = useState(false);
  const [makeOfferOpen, setMakeOfferOpen] = useState(false);

  // Financing calculator states
  const [downPaymentPercent, setDownPaymentPercent] = useState(15);
  const [loanTermMonths, setLoanTermMonths] = useState(60);
  const interestRate = 0.059; // 5.9% APR

  // Direct inquiry form state
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const { isFavorited, toggleFavorite } = useFavorites();
  const favorited = vehicle ? isFavorited(vehicle.id) : false;

  useEffect(() => {
    async function loadVehicle() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await apiRequest<{ vehicle: Vehicle }>(`/vehicles/${id}`);
        setVehicle(res.vehicle);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load vehicle:', err);
        setError(err.message || 'Vehicle not found');
      } finally {
        setLoading(false);
      }
    }
    loadVehicle();
  }, [id]);

  // Calculate monthly payment
  const price = vehicle?.price || 0;
  const downPaymentAmount = Math.round((price * downPaymentPercent) / 100);
  const loanPrincipal = price - downPaymentAmount;
  const monthlyInterest = interestRate / 12;
  const monthlyPayment = Math.round(
    (loanPrincipal * (monthlyInterest * Math.pow(1 + monthlyInterest, loanTermMonths))) /
    (Math.pow(1 + monthlyInterest, loanTermMonths) - 1)
  );

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle || !inquiryMsg.trim()) return;

    try {
      await apiRequest('/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          vehicle_id: vehicle.id,
          name: inquiryName || 'Guest Buyer',
          email: inquiryEmail || 'buyer@example.com',
          type: 'inquiry',
          message: inquiryMsg
        })
      });
      setInquirySent(true);
      setInquiryMsg('');
    } catch (err) {
      alert('Failed to send question to seller');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs text-cyan-400 tracking-wider">RETRIEVING 3D DIGITAL TWIN...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-6 text-center">
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 max-w-md">
          <h2 className="text-xl font-bold font-display text-white mb-2">Vehicle Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">{error || 'This vehicle listing may have been moved or sold.'}</p>
          <Link to="/buy" className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const allImages = vehicle.images && vehicle.images.length > 0
    ? vehicle.images.map(img => img.url)
    : [vehicle.primary_image || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      {/* Test Drive and Make Offer Modals */}
      <TestDriveModal
        isOpen={testDriveOpen}
        onClose={() => setTestDriveOpen(false)}
        vehicle={vehicle}
      />
      <MakeOfferModal
        isOpen={makeOfferOpen}
        onClose={() => setMakeOfferOpen(false)}
        vehicle={vehicle}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link to="/" className="hover:text-cyan-400">Showroom</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/buy" className="hover:text-cyan-400">Marketplace</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-cyan-400 truncate">{vehicle.year} {vehicle.make} {vehicle.model}</span>
        </div>

        {/* 1. MASTER SPLIT HERO: 3D VIEWER + PURCHASE INFORMATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLS: 3D INTERACTIVE VIEWER & GALLERY */}
          <div className="lg:col-span-7 space-y-4">
            {/* Media Mode Toggle (3D Digital Twin vs Photo Gallery) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <button
                  onClick={() => setMediaMode('3d')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    mediaMode === '3d'
                      ? 'bg-cyan-500 text-black font-bold shadow-cyan-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Box className="w-4 h-4" />
                  <span>3D Digital Twin</span>
                </button>
                <button
                  onClick={() => setMediaMode('photos')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    mediaMode === 'photos'
                      ? 'bg-cyan-500 text-black font-bold shadow-cyan-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Images className="w-4 h-4" />
                  <span>Gallery ({allImages.length})</span>
                </button>
              </div>

              {/* Share & Favorite Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
                  title="Share vehicle link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleFavorite(vehicle.id)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-red-400 transition-colors"
                  title="Add to favorites"
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Main Stage Panel */}
            <div className="relative rounded-3xl bg-[#090d16] border border-cyan-500/25 overflow-hidden shadow-cyan-glow">
              {mediaMode === '3d' ? (
                <VehicleCanvas
                  color={customPaintColor}
                  onColorChange={(c) => setCustomPaintColor(c)}
                  modelType={vehicle.model_3d_type || 'hyper_ev'}
                  hotspots={vehicle.hotspots || []}
                  className="h-[460px] sm:h-[520px]"
                  fallbackImage={vehicle.primary_image}
                />
              ) : (
                <div className="relative h-[460px] sm:h-[520px] bg-black flex items-center justify-center">
                  <img
                    src={allImages[selectedPhotoIndex] || allImages[0]}
                    alt={`Photo ${selectedPhotoIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPhotoIndex(idx);
                    setMediaMode('photos');
                  }}
                  className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    mediaMode === 'photos' && selectedPhotoIndex === idx
                      ? 'border-cyan-400 shadow-cyan-sm scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT 5 COLS: PURCHASE DETAILS, FINANCING & ACTIONS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0c1424]/85 backdrop-blur-xl border border-cyan-500/25 shadow-cyan-glow-lg space-y-6">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" size="md" icon="certified">
                    {vehicle.condition_score}/100 Verified
                  </Badge>
                  {vehicle.fuel === 'Electric' && (
                    <Badge variant="purple" size="md" icon="ev">
                      {vehicle.specs?.battery_health || 98}% Battery
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-mono text-slate-400">VIN: {vehicle.vin.slice(0, 10)}...</span>
              </div>

              {/* Title & Trim */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                  {vehicle.year} {vehicle.make} <span className="text-cyan-400">{vehicle.model}</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">{vehicle.trim || vehicle.description}</p>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-2 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{vehicle.location}</span>
                </div>
              </div>

              {/* Price & Monthly Estimate */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Direct Purchase Price</div>
                  <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
                    ${vehicle.price.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Est. Financing</div>
                  <div className="text-lg font-bold font-mono text-cyan-400">
                    ${monthlyPayment}/mo
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">{loanTermMonths} mo • {downPaymentPercent}% down</div>
                </div>
              </div>

              {/* Primary Call-to-Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTestDriveOpen(true)}
                  className="py-3 px-4 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-bold text-xs shadow-cyan-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Request Test Drive</span>
                </button>
                <button
                  onClick={() => setMakeOfferOpen(true)}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-cyan-glow transition-all flex items-center justify-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4 stroke-[2.5]" />
                  <span>Make an Offer</span>
                </button>
              </div>

              {/* Financing Calculator Slider Accordion */}
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3 text-xs">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Interactive Payment Estimator</span>
                  <span className="text-cyan-400 font-mono">5.9% APR</span>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono mb-1">
                    <span>Down Payment ({downPaymentPercent}%)</span>
                    <span>${downPaymentAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={5}
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  {[36, 48, 60, 72].map((term) => (
                    <button
                      key={term}
                      onClick={() => setLoanTermMonths(term)}
                      className={`flex-1 py-1 rounded-lg border text-[11px] font-mono transition-colors ${
                        loanTermMonths === term
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {term}mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Seller Profile Card */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={vehicle.seller_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={vehicle.seller_name || 'Seller'}
                    className="w-11 h-11 rounded-xl object-cover border border-cyan-500/30"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      {vehicle.seller_name || 'MotorVault Ambassador'}
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {vehicle.seller_role === 'dealer' ? 'Certified Dealership Partner' : 'Verified Private Seller'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Direct contact: ${vehicle.seller_phone || '+1 (555) 234-8901'}`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-mono"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SPECIFICATIONS, CONDITION REPORT & SERVICE TIMELINE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COL 1 & 2: 150-PT REPORT & TECHNICAL SPECS */}
          <div className="lg:col-span-2 space-y-6">
            {/* Condition Report */}
            <div className="p-6 rounded-3xl bg-[#0c1322]/80 border border-cyan-500/20 shadow-glass">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/15">
                <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  150-Point Digital Inspection Audit
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-400">PASSED 100%</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 uppercase text-[10px]">High-Voltage Battery</div>
                  <div className="text-white font-bold text-sm mt-1">{vehicle.specs?.battery_health || 98}% Health Remaining</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Cell balance ±0.003V • Optimal</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 uppercase text-[10px]">Tire & Brake Wear</div>
                  <div className="text-white font-bold text-sm mt-1">92% Pad Life Remaining</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Michelin Pilot Sport 7.2mm tread</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 uppercase text-[10px]">Chassis & Frame Laser Scan</div>
                  <div className="text-white font-bold text-sm mt-1">100% Factory Geometry</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Zero structural damage or repairs</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 uppercase text-[10px]">Title & History Status</div>
                  <div className="text-white font-bold text-sm mt-1">{vehicle.title_status} Title Verified</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Zero accidents • 1-Owner</div>
                </div>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div className="p-6 rounded-3xl bg-[#0c1322]/80 border border-cyan-500/20 shadow-glass">
              <h3 className="text-base font-bold font-display text-white mb-4 pb-2 border-b border-cyan-500/15">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block">Horsepower</span>
                  <span className="text-white font-bold text-sm">{vehicle.specs?.horsepower || 450} HP</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block">0-60 MPH</span>
                  <span className="text-white font-bold text-sm">{vehicle.specs?.acceleration || 3.4} sec</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block">Top Speed</span>
                  <span className="text-white font-bold text-sm">{vehicle.specs?.top_speed || 165} MPH</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block">Drivetrain</span>
                  <span className="text-white font-bold text-sm">{vehicle.specs?.drivetrain || 'AWD'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block">Range / MPG</span>
                  <span className="text-white font-bold text-sm">{vehicle.specs?.range_or_mpg || '280 Miles'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block">Transmission</span>
                  <span className="text-white font-bold text-sm">{vehicle.transmission}</span>
                </div>
              </div>
            </div>
          </div>

          {/* COL 3: VERIFIED SERVICE TIMELINE & DIRECT QUESTION */}
          <div className="space-y-6">
            {/* Service History Timeline */}
            <div className="p-6 rounded-3xl bg-[#0c1322]/80 border border-cyan-500/20 shadow-glass">
              <h3 className="text-base font-bold font-display text-white mb-4 pb-2 border-b border-cyan-500/15 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                Service History Timeline
              </h3>
              
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {vehicle.service_records && vehicle.service_records.length > 0 ? (
                  vehicle.service_records.map((rec, i) => (
                    <div key={i} className="relative pl-7 text-xs">
                      <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-cyan-500/20 border-2 border-cyan-400" />
                      <div className="font-mono text-[11px] text-cyan-400">{rec.date} • {rec.mileage.toLocaleString()} mi</div>
                      <div className="font-bold text-white mt-0.5">{rec.service_type}</div>
                      <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">{rec.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 pl-7">
                    Pre-sale comprehensive certification passed with 100% factory fluids and components.
                  </div>
                )}
              </div>
            </div>

            {/* Inquire Directly Form */}
            <div className="p-6 rounded-3xl bg-[#0c1322]/80 border border-cyan-500/20 shadow-glass">
              <h3 className="text-sm font-bold font-display text-white mb-2">
                Ask Seller a Question
              </h3>
              {inquirySent ? (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs text-center space-y-1">
                  <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-400" />
                  <div className="font-bold">Message Delivered</div>
                  <div className="text-[11px]">The seller has received your question.</div>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="Your Email"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                  <textarea
                    rows={3}
                    required
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    placeholder="Ask about vehicle history, pricing, pickup..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
