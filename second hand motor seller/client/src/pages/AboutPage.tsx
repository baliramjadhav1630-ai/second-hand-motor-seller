import React, { useState } from 'react';
import { ShieldCheck, Lock, RefreshCw, Cpu, Award, ChevronDown, CheckCircle2, Shield } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the MotorVault 150-Point Digital Inspection?',
      a: 'Unlike traditional paper checklists, MotorVault combines on-site physical vehicle auditing with real-time digital diagnostic telemetry. Our certified technicians evaluate chassis laser alignment, paint depth micrometers, high-voltage battery health (SOH), brake pad thickness, and computer ECU scans before any vehicle goes live.'
    },
    {
      q: 'How does the 7-Day Test-Own Guarantee work?',
      a: 'Once you take delivery of your vehicle, you have 7 calendar days or up to 250 miles to experience it on your daily roads. If it does not meet your expectations, contact our concierge to schedule a seamless return for a full refund minus a modest nominal restocking fee.'
    },
    {
      q: 'Are deposits protected in escrow?',
      a: 'Yes. All reservation deposits and formal offer funds are held in an audited third-party escrow account. Funds are never released to the seller until you have inspected the vehicle in person and verified that all condition metrics match the 3D digital twin.'
    },
    {
      q: 'Can I sell my vehicle on MotorVault as a private owner?',
      a: 'Absolutely. MotorVault allows both certified dealership partners and private enthusiasts to list their vehicles using our 5-step seller wizard. We generate a 3D digital twin visualization for your vehicle upon submission.'
    },
    {
      q: 'Does MotorVault support vehicle delivery across state lines?',
      a: 'Yes. We partner with fully insured enclosed and open carriers. You can arrange white-glove enclosed transport directly through our concierge with live GPS tracking.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Brand Mission Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            THE MOTORVAULT PHILOSOPHY
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            The Digital Twin Marketplace for High-Performance Motors.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            MotorVault was founded to eradicate the asymmetry, mystery, and anxiety of purchasing pre-owned performance and electric motor vehicles. By combining interactive 3D WebGL inspection with rigorous decentralized telemetry, we deliver absolute transparency to buyers and sellers.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0c1322]/80 border border-cyan-500/20 backdrop-blur-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-cyan-sm">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-white">3D Digital Twins</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every motor vehicle is rendered in full WebGL with interactive orbit, hotspot telemetry callouts, and real-time paint swatches.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0c1322]/80 border border-cyan-500/20 backdrop-blur-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-cyan-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-white">150-Point Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Traction battery health, brake pads, tire tread depth, and computerized ECU faults are thoroughly inspected before listing.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0c1322]/80 border border-cyan-500/20 backdrop-blur-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-cyan-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-white">Escrow Buyer Protection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your deposits and offers are securely locked until you physically test-drive and approve title transfer in person.
            </p>
          </div>
        </div>

        {/* 150-Point Audit Details */}
        <div className="p-8 rounded-3xl bg-[#0a0f1d] border border-cyan-500/25 shadow-cyan-glow">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold font-display text-white mb-2">
              Our 150-Point Digital Inspection Protocol
            </h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              We leave no bolt unturned. Here is a snapshot of our verification stages conducted by master mechanics:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Powertrain & High Voltage
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  EV cell balancing, inverter thermal cycles, transmission synchro engagement, turbocharger shaft play, and oil analysis.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Chassis & Suspension
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Subframe alignment, adaptive damper seals, ball joints, suspension bushings, and laser-guided wheel alignment.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Braking & Wheels
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Rotor minimum thickness micrometers, brake fluid boiling point, caliper piston free-movement, and rim trueness.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Digital History & Title
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Multi-state title check, lien verification, total loss check, odometer rollback audit, and flood inspection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="space-y-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-display text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-400 mt-1">Everything you need to know about MotorVault operations.</p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#0c1322]/80 border border-cyan-500/20 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-cyan-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
