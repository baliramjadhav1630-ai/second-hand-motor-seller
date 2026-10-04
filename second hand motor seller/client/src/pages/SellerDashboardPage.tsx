import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Vehicle, Inquiry } from '../types/index.js';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';
import { Modal } from '../components/common/Modal.js';
import {
  Car,
  DollarSign,
  Heart,
  MessageSquare,
  Eye,
  Pause,
  Play,
  Trash2,
  Edit,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const SellerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState({
    active_listings: 0,
    paused_listings: 0,
    total_inquiries: 0,
    total_favorites: 0,
    total_inventory_value: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'inquiries'>('listings');

  // Edit Price Modal
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newStatus, setNewStatus] = useState<string>('active');

  const loadDashboardData = async () => {
    try {
      // 1. Fetch user vehicles
      const vRes = await apiRequest<{ vehicles: Vehicle[] }>(`/vehicles?sellerId=${user?.id || 'usr-demo-seller'}&status=all`);
      setVehicles(vRes.vehicles);

      // 2. Fetch inquiries
      const iRes = await apiRequest<{ inquiries: Inquiry[] }>('/inquiries');
      setInquiries(iRes.inquiries);

      // 3. Fetch stats
      const sRes = await apiRequest<{ stats: any }>('/dashboard/stats');
      setStats(sRes.stats);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Toggle Pause/Resume Listing
  const handleToggleStatus = async (vehicle: Vehicle) => {
    const nextStatus = vehicle.status === 'active' ? 'paused' : 'active';
    try {
      await apiRequest(`/vehicles/${vehicle.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus })
      });
      setVehicles(prev =>
        prev.map(v => v.id === vehicle.id ? { ...v, status: nextStatus as any } : v)
      );
    } catch (err) {
      alert('Failed to update listing status');
    }
  };

  // Delete Listing
  const handleDeleteListing = async (vehicleId: string) => {
    if (!window.confirm('Are you sure you want to delete this listing from the vault?')) return;

    try {
      await apiRequest(`/vehicles/${vehicleId}`, { method: 'DELETE' });
      setVehicles(prev => prev.filter(v => v.id !== vehicleId));
    } catch (err) {
      alert('Failed to delete listing');
    }
  };

  // Save Edit Price
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    try {
      await apiRequest(`/vehicles/${editingVehicle.id}`, {
        method: 'PUT',
        body: JSON.stringify({ price: newPrice, status: newStatus })
      });
      setVehicles(prev =>
        prev.map(v => v.id === editingVehicle.id ? { ...v, price: newPrice, status: newStatus as any } : v)
      );
      setEditingVehicle(null);
    } catch (err) {
      alert('Failed to save listing changes');
    }
  };

  // Update Inquiry Status (Accept, Decline, Contacted)
  const handleUpdateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      await apiRequest(`/inquiries/${inquiryId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      setInquiries(prev =>
        prev.map(i => i.id === inquiryId ? { ...i, status: status as any } : i)
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Edit Listing Modal */}
      <Modal
        isOpen={!!editingVehicle}
        onClose={() => setEditingVehicle(null)}
        title="Quick Edit Listing"
        subtitle={editingVehicle ? `${editingVehicle.year} ${editingVehicle.make} ${editingVehicle.model}` : ''}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 uppercase mb-1">Asking Price ($ USD)</label>
            <input
              type="number"
              required
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase mb-1">Listing Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="active">Active (Visible in Marketplace)</option>
              <option value="paused">Paused (Temporarily Hidden)</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingVehicle(null)}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-cyan-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan-500/15">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AUTHENTICATED SELLER PORTAL
            </div>
            <h1 className="text-3xl font-extrabold font-display text-white">
              Seller Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Welcome back, <span className="text-cyan-300 font-semibold">{user?.name || 'Alex Mercer'}</span>. Manage listings, buyer offers, and test-drive appointments.
            </p>
          </div>

          <Link
            to="/sell"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-cyan-glow transition-all"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Listing</span>
          </Link>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0c1322]/80 border border-cyan-500/20 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>ACTIVE LISTINGS</span>
              <Car className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">{stats.active_listings}</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-mono">100% 3D Twins Online</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c1322]/80 border border-cyan-500/20 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>INVENTORY VALUE</span>
              <DollarSign className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">
              ${stats.total_inventory_value.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">Verified Asking Total</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c1322]/80 border border-cyan-500/20 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>INQUIRIES & OFFERS</span>
              <MessageSquare className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">{inquiries.length}</div>
            <div className="text-[11px] text-cyan-400 mt-1 font-mono">
              {inquiries.filter(i => i.status === 'pending').length} Pending Review
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c1322]/80 border border-cyan-500/20 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>SAVED FAVORITES</span>
              <Heart className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">{stats.total_favorites || 5}</div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">Buyer Watchlists</div>
          </div>
        </div>

        {/* Tab Navigation (My Listings vs Inquiries & Offers) */}
        <div className="flex border-b border-cyan-500/15 gap-4">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 text-sm font-bold font-display transition-colors relative ${
              activeTab === 'listings'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Vehicle Listings ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 text-sm font-bold font-display transition-colors relative ${
              activeTab === 'inquiries'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Inquiries & Offers ({inquiries.length})
          </button>
        </div>

        {/* TAB 1: LISTINGS MANAGEMENT */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            {vehicles.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#0c1322]/80 border border-slate-800 text-center">
                <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Active Listings Yet</h3>
                <p className="text-xs text-slate-400 mb-4">Click below to publish your first vehicle.</p>
                <Link to="/sell" className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs">
                  Create Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="p-5 rounded-2xl bg-[#0c1322]/80 border border-cyan-500/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <img
                        src={v.primary_image || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'}
                        alt={v.model}
                        className="w-24 h-16 rounded-xl object-cover border border-cyan-500/20 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                              v.status === 'active'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                                : v.status === 'paused'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {v.status}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400">
                            {v.condition_score}/100 Score
                          </span>
                        </div>
                        <h4 className="text-base font-bold font-display text-white">
                          {v.year} {v.make} {v.model}
                        </h4>
                        <div className="text-xs font-mono text-slate-400">
                          ${v.price.toLocaleString()} • {v.mileage.toLocaleString()} mi • {v.location}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                      <Link
                        to={`/vehicle/${v.id}`}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => {
                          setEditingVehicle(v);
                          setNewPrice(v.price);
                          setNewStatus(v.status);
                        }}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400"
                        title="Edit Price & Status"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(v)}
                        className={`p-2 rounded-xl border transition-colors ${
                          v.status === 'active'
                            ? 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/50'
                            : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50'
                        }`}
                        title={v.status === 'active' ? 'Pause Listing' : 'Activate Listing'}
                      >
                        {v.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleDeleteListing(v.id)}
                        className="p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/50"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INQUIRIES & OFFERS INBOX */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#0c1322]/80 border border-slate-800 text-center">
                <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Inquiries Yet</h3>
                <p className="text-xs text-slate-400">Incoming buyer offers and test drive requests will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-2xl bg-[#0c1322]/80 border border-cyan-500/20 backdrop-blur-xl flex flex-col md:flex-row items-start justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                            inq.type === 'offer'
                              ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                              : inq.type === 'test_drive'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {inq.type === 'offer' ? 'Formal Offer' : inq.type === 'test_drive' ? 'Test Drive Booking' : 'Question'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                            inq.status === 'accepted'
                              ? 'bg-emerald-950 text-emerald-300'
                              : inq.status === 'declined'
                              ? 'bg-red-950 text-red-300'
                              : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          Status: {inq.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white font-display">
                        {inq.name} ({inq.email})
                      </h4>

                      {inq.offer_amount && (
                        <div className="text-base font-extrabold font-mono text-cyan-400">
                          Proposed Price: ${inq.offer_amount.toLocaleString()} USD
                        </div>
                      )}

                      {inq.preferred_date && (
                        <div className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Date: {inq.preferred_date} ({inq.preferred_time_slot})</span>
                        </div>
                      )}

                      <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                        "{inq.message}"
                      </p>
                    </div>

                    {/* Status Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {inq.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'accepted')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold hover:bg-emerald-500/30 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'declined')}
                            className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-mono font-bold hover:bg-red-500/30 flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </>
                      )}
                      {inq.status !== 'pending' && (
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq.id, 'pending')}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-mono hover:text-white"
                        >
                          Mark Pending
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
