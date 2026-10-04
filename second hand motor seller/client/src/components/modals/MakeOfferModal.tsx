import React, { useState } from 'react';
import { Modal } from '../common/Modal.js';
import { Vehicle } from '../../types/index.js';
import { apiRequest } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';
import confetti from 'canvas-confetti';
import { DollarSign, ShieldCheck, CheckCircle2, AlertCircle, Percent } from 'lucide-react';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({ isOpen, onClose, vehicle }) => {
  const { user } = useAuth();
  const [offerAmount, setOfferAmount] = useState<number>(Math.round(vehicle.price * 0.95));
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'finance' | 'trade_in'>('cash');
  const [message, setMessage] = useState(`I am submitting an offer of $${Math.round(vehicle.price * 0.95).toLocaleString()} for your ${vehicle.year} ${vehicle.make} ${vehicle.model}. Ready to proceed with escrow deposit.`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const diffPercent = Math.round(((offerAmount - vehicle.price) / vehicle.price) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await apiRequest('/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          vehicle_id: vehicle.id,
          name,
          email,
          phone,
          type: 'offer',
          offer_amount: offerAmount,
          message: `${message} [Payment: ${paymentMethod.toUpperCase()}]`
        })
      });

      setIsSuccess(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } catch (err: any) {
      setError(err.message || 'Failed to submit offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Make an Offer"
      subtitle={`${vehicle.year} ${vehicle.make} ${vehicle.model} • Listed at $${vehicle.price.toLocaleString()}`}
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold font-display text-white">
            Formal Offer Transmitted!
          </h4>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Your offer of <span className="text-cyan-400 font-bold font-mono text-base">${offerAmount.toLocaleString()}</span> has been submitted to {vehicle.seller_name || 'the seller'}. You will be notified when they accept, counter, or decline.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/20 max-w-sm mx-auto text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>MotorVault Escrow guarantee protects buyer funds upon acceptance.</span>
          </div>
          <button
            onClick={handleModalClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-colors mt-2"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Price Overview Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-mono">LISTED ASKING PRICE</div>
              <div className="text-lg font-bold font-mono text-white">${vehicle.price.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 font-mono">OFFER DIFFERENTIAL</div>
              <div className={`text-sm font-bold font-mono ${diffPercent < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {diffPercent > 0 ? `+${diffPercent}%` : `${diffPercent}%`} (${(offerAmount - vehicle.price).toLocaleString()})
              </div>
            </div>
          </div>

          {/* Offer Input */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
              Your Offer Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 font-mono font-bold">$</span>
              <input
                type="number"
                required
                min={1000}
                step={500}
                value={offerAmount}
                onChange={(e) => setOfferAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white font-mono font-bold text-lg focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex gap-2 text-xs">
            {[0.9, 0.95, 0.98, 1.0].map((ratio) => {
              const val = Math.round(vehicle.price * ratio);
              return (
                <button
                  type="button"
                  key={ratio}
                  onClick={() => setOfferAmount(val)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                    offerAmount === val
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {ratio === 1.0 ? 'Asking' : `-${Math.round((1 - ratio) * 100)}%`}
                </button>
              );
            })}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cash', label: 'All-Cash Wire' },
                { id: 'finance', label: 'Pre-Approved Loan' },
                { id: 'trade_in', label: 'Trade-in + Cash' }
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`py-2 px-2 text-xs font-medium rounded-xl border text-center transition-colors ${
                    paymentMethod === m.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              Message to Seller
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold shadow-cyan-glow transition-all text-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Transmitting...' : 'Submit Formal Offer'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
