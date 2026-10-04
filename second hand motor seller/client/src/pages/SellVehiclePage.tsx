import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, uploadImage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';
import confetti from 'canvas-confetti';
import {
  Car,
  Camera,
  CheckSquare,
  DollarSign,
  Eye,
  UploadCloud,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const DRAFT_KEY = 'motorvault_sell_draft';

export const SellVehiclePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State with localStorage persistence
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      // Step 1: Basics
      make: 'Porsche',
      model: 'Taycan 4S',
      year: 2023,
      trim: 'Performance Battery Plus',
      mileage: 14500,
      fuel: 'Electric',
      transmission: 'Automatic 2-Speed',
      body_type: 'Sedan',
      vin: 'WP0AA2Y14PSA19024',
      location: 'San Francisco, CA',
      model_3d_type: 'hyper_ev',

      // Step 2: Photos
      images: [
        { url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80', caption: 'Front 3/4 Exterior Profile' },
        { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', caption: 'Side Aero Stance' }
      ],

      // Step 3: Condition Checklist
      exterior_condition: 'Excellent - No Dents or Scratches',
      interior_condition: 'Like New - Non Smoker',
      tyre_condition: '85% Tread Remaining',
      service_history_complete: true,
      accident_free: true,
      battery_health: 98,
      condition_score: 96,

      // Step 4: Pricing & Details
      price: 88500,
      negotiable: true,
      title: '2023 Porsche Taycan 4S - Certified Single Owner',
      description: 'Exceptionally maintained 2023 Taycan 4S with Performance Battery Plus, panoramic glass roof, 20" Taycan Turbo Aero wheels, and 14-way power seats with memory. Always garaged and ceramic coated.',
      seller_contact_pref: 'email_and_phone'
    };
  });

  // Autosave draft to localStorage
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Image Upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    setError(null);

    try {
      const res = await uploadImage(file);
      setFormData((prev: any) => ({
        ...prev,
        images: [...prev.images, { url: res.url, caption: file.name }]
      }));
    } catch (err: any) {
      setError(err.message || 'Image upload failed. Using local preview.');
      // Local object URL fallback
      const localUrl = URL.createObjectURL(file);
      setFormData((prev: any) => ({
        ...prev,
        images: [...prev.images, { url: localUrl, caption: file.name }]
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: any, idx: number) => idx !== indexToRemove)
    }));
  };

  // Step Navigation Validation
  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.make || !formData.model || !formData.year || !formData.mileage) {
        setError('Please fill in make, model, year, and mileage.');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.images || formData.images.length === 0) {
        setError('Please upload or keep at least one vehicle image.');
        return false;
      }
    }
    if (step === 4) {
      if (!formData.price || formData.price <= 0) {
        setError('Please enter a valid asking price.');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Publish to Express backend
  const handlePublish = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiRequest<{ vehicleId: string; message: string }>('/vehicles', {
        method: 'POST',
        body: JSON.stringify({
          make: formData.make,
          model: formData.model,
          year: formData.year,
          trim: formData.trim,
          price: formData.price,
          mileage: formData.mileage,
          fuel: formData.fuel,
          transmission: formData.transmission,
          body_type: formData.body_type,
          vin: formData.vin,
          location: formData.location,
          condition_score: formData.condition_score,
          title_status: formData.accident_free ? 'Clean' : 'Rebuilt',
          description: formData.description,
          is_certified: 1,
          model_3d_type: formData.model_3d_type,
          images: formData.images,
          specs: {
            horsepower: formData.fuel === 'Electric' ? 522 : 440,
            top_speed: 155,
            acceleration: 3.8,
            range_or_mpg: formData.fuel === 'Electric' ? '272 Miles' : '23 MPG',
            drivetrain: 'Dual-Motor AWD',
            battery_capacity: formData.fuel === 'Electric' ? '93.4 kWh' : 'N/A',
            battery_health: formData.battery_health
          }
        })
      });

      // Clear draft on publish
      localStorage.removeItem(DRAFT_KEY);

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}

      // Redirect to newly published vehicle
      setTimeout(() => {
        navigate(`/vehicle/${res.vehicleId}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to publish vehicle listing');
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Vehicle Specs', icon: Car },
    { num: 2, label: 'Photos & Media', icon: Camera },
    { num: 3, label: 'Condition Audit', icon: CheckSquare },
    { num: 4, label: 'Pricing & Description', icon: DollarSign },
    { num: 5, label: 'Review & Publish', icon: Eye }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Wizard Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            MOTORVAULT SELLER WIZARD
          </div>
          <h1 className="text-3xl font-extrabold font-display text-white">
            List Your Motor Vehicle
          </h1>
          <p className="text-xs text-slate-400">
            Publish with instant 3D digital twin visualization and local SQLite persistence. Draft auto-saved.
          </p>
        </div>

        {/* 5-Step Progress Bar */}
        <div className="p-4 rounded-2xl bg-[#0c1322]/80 border border-cyan-500/20 backdrop-blur-xl">
          <div className="grid grid-cols-5 gap-2">
            {steps.map((s) => {
              const Icon = s.icon;
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <button
                  key={s.num}
                  onClick={() => {
                    if (s.num < currentStep) setCurrentStep(s.num);
                  }}
                  className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                      : isDone
                      ? 'text-emerald-400'
                      : 'text-slate-500 opacity-60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 text-xs font-mono font-bold ${
                      isCurrent
                        ? 'bg-cyan-400 text-black shadow-cyan-sm'
                        : isDone
                        ? 'bg-emerald-500/30 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isDone ? '✓' : s.num}
                  </div>
                  <span className="text-[11px] font-medium hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Form Body Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1424]/85 border border-cyan-500/25 shadow-glass backdrop-blur-xl">
          {/* STEP 1: VEHICLE SPECIFICATIONS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-bold font-display text-white pb-3 border-b border-cyan-500/15 flex items-center gap-2">
                <Car className="w-5 h-5 text-cyan-400" />
                Step 1: Vehicle Specifications & Identification
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Make / Brand</label>
                  <input
                    type="text"
                    required
                    value={formData.make}
                    onChange={(e) => updateField('make', e.target.value)}
                    placeholder="e.g. Porsche, Tesla, BMW"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => updateField('model', e.target.value)}
                    placeholder="e.g. 911 GT3, Model S, M4"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Model Year</label>
                  <input
                    type="number"
                    required
                    min={1990}
                    max={2026}
                    value={formData.year}
                    onChange={(e) => updateField('year', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Trim / Package</label>
                  <input
                    type="text"
                    value={formData.trim}
                    onChange={(e) => updateField('trim', e.target.value)}
                    placeholder="e.g. Turbo S, Competition xDrive"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Current Mileage (Miles)</label>
                  <input
                    type="number"
                    required
                    value={formData.mileage}
                    onChange={(e) => updateField('mileage', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Powertrain Fuel</label>
                  <select
                    value={formData.fuel}
                    onChange={(e) => updateField('fuel', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Electric">Pure Electric (EV)</option>
                    <option value="Petrol">Petrol / Gasoline</option>
                    <option value="Hybrid">Plug-in Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Body Style</label>
                  <select
                    value={formData.body_type}
                    onChange={(e) => updateField('body_type', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Coupe">Coupe</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">3D Stage Model Twin</label>
                  <select
                    value={formData.model_3d_type}
                    onChange={(e) => updateField('model_3d_type', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="hyper_ev">Hyper EV Stance</option>
                    <option value="cyber_coupe">Cyber Performance Coupe</option>
                    <option value="m_spec">M-Spec Sport Track</option>
                    <option value="gran_turismo">Gran Turismo Fastback</option>
                    <option value="sport_suv">Adventure Sport SUV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">VIN / Chassis Number</label>
                  <input
                    type="text"
                    value={formData.vin}
                    onChange={(e) => updateField('vin', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Location (City, State)</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PHOTO UPLOAD */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-bold font-display text-white pb-3 border-b border-cyan-500/15 flex items-center gap-2">
                <Camera className="w-5 h-5 text-cyan-400" />
                Step 2: Upload High-Resolution Photos
              </h3>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded-3xl p-8 text-center bg-slate-900/40 transition-colors">
                <UploadCloud className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">
                  Upload vehicle photos from your local machine
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Files are saved locally to <span className="font-mono text-cyan-400">server/uploads/</span>. Formats: JPEG, PNG, WEBP.
                </p>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer shadow-cyan-sm transition-all">
                  <span>{uploadingImage ? 'Uploading to Local Vault...' : 'Select Local Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>

              {/* Uploaded Gallery Grid */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                  Vehicle Gallery ({formData.images.length} photos)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {formData.images.map((img: any, idx: number) => (
                    <div
                      key={idx}
                      className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800"
                    >
                      <img src={img.url} alt={`Car ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="p-2 rounded-xl bg-red-500/80 text-white hover:bg-red-500"
                          title="Remove photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {idx === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-cyan-500 text-black font-mono text-[9px] font-bold">
                          PRIMARY
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONDITION AUDIT & CHECKLIST */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-bold font-display text-white pb-3 border-b border-cyan-500/15 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-cyan-400" />
                Step 3: 150-Point Condition Checklist
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Exterior & Paint Condition</label>
                  <select
                    value={formData.exterior_condition}
                    onChange={(e) => updateField('exterior_condition', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Flawless - Ceramic Coated">Flawless - Ceramic Coated / PPF</option>
                    <option value="Excellent - No Dents or Scratches">Excellent - No Dents or Scratches</option>
                    <option value="Good - Minor Stone Chips">Good - Minor Stone Chips</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Interior & Cockpit</label>
                  <select
                    value={formData.interior_condition}
                    onChange={(e) => updateField('interior_condition', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Like New - Non Smoker">Like New - Non Smoker</option>
                    <option value="Excellent - Minimal Leather Creasing">Excellent - Minimal Leather Creasing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Tire Tread Life</label>
                  <input
                    type="text"
                    value={formData.tyre_condition}
                    onChange={(e) => updateField('tyre_condition', e.target.value)}
                    placeholder="e.g. 85% Tread Remaining"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {formData.fuel === 'Electric' && (
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-400 uppercase">EV Traction Battery Health</span>
                      <span className="text-cyan-400 font-bold">{formData.battery_health}% SOH</span>
                    </div>
                    <input
                      type="range"
                      min={80}
                      max={100}
                      value={formData.battery_health}
                      onChange={(e) => updateField('battery_health', Number(e.target.value))}
                      className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                )}

                <div className="pt-2 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.service_history_complete}
                      onChange={(e) => updateField('service_history_complete', e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500"
                    />
                    <span>Complete Dealership Service Records Available</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.accident_free}
                      onChange={(e) => updateField('accident_free', e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500"
                    />
                    <span>Accident-Free & Clean Title Declaration</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PRICING & DESCRIPTION */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-bold font-display text-white pb-3 border-b border-cyan-500/15 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-cyan-400" />
                Step 4: Pricing & Seller Description
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Asking Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 font-bold">$</span>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={500}
                      value={formData.price}
                      onChange={(e) => updateField('price', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white font-bold text-lg focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Listing Headline / Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Full Vehicle Description</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW LIVE PREVIEW & PUBLISH */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
                <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  Step 5: Review Listing Before Publishing
                </h3>
                <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All Checks Passed
                </span>
              </div>

              {/* Exact Buyer View Mockup Card */}
              <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/30 shadow-cyan-glow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photo Preview */}
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900">
                    <img
                      src={formData.images[0]?.url || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'}
                      alt="Review primary preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                      3D DIGITAL TWIN READY
                    </div>
                  </div>

                  {/* Summary Specs */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                        {formData.condition_score}/100 Verified
                      </span>
                      <span className="text-xs font-mono text-slate-400">{formData.fuel}</span>
                    </div>

                    <h2 className="text-2xl font-bold font-display text-white">
                      {formData.year} {formData.make} {formData.model}
                    </h2>
                    <p className="text-xs text-slate-400">{formData.trim}</p>

                    <div className="text-2xl font-extrabold font-mono text-cyan-400">
                      ${formData.price.toLocaleString()}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-2 border-t border-slate-800">
                      <div>
                        <div className="text-slate-500">MILEAGE</div>
                        <div className="text-white">{formData.mileage.toLocaleString()} mi</div>
                      </div>
                      <div>
                        <div className="text-slate-500">TRANSMISSION</div>
                        <div className="text-white">{formData.transmission}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">TITLE</div>
                        <div className="text-emerald-400">{formData.accident_free ? 'Clean' : 'Rebuilt'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>
                  By clicking "Publish Vehicle Listing", this vehicle will immediately be indexed in SQLite and available on the 3D Showroom and Marketplace.
                </span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 font-mono text-xs transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-cyan-sm transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePublish}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm shadow-cyan-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing to SQLite Vault...' : 'Publish Vehicle Listing →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
