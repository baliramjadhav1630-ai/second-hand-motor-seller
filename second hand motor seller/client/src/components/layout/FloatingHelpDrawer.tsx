import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, HelpCircle, ShieldCheck, ChevronRight, Check } from 'lucide-react';

export const FloatingHelpDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'faq'>('chat');
  const [inputMsg, setInputMsg] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: 'Greetings! I am the MotorVault Virtual Concierge. How may I assist your vehicle search or listing today?',
      time: 'Just now'
    }
  ]);

  const quickQuestions = [
    'How does the 150-Point Inspection work?',
    'How do I schedule a local test drive?',
    'Can I make a cash offer online?',
    'What is the 7-day return policy?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userEntry = {
      sender: 'user',
      text: text.trim(),
      time: 'Just now'
    };

    setChatHistory(prev => [...prev, userEntry]);
    setInputMsg('');

    // Instant local concierge logic
    setTimeout(() => {
      let botResponse = "Our MotorVault concierge team is ready to help! You can book a test drive or make an offer on any vehicle detail page.";

      const lower = text.toLowerCase();
      if (lower.includes('inspection') || lower.includes('150')) {
        botResponse = "Every vehicle listed on MotorVault undergoes our certified 150-point inspection covering drivetrain, battery degradation, chassis alignment, tire tread depth, and computerized ECU fault scan.";
      } else if (lower.includes('test drive') || lower.includes('schedule')) {
        botResponse = "To test drive a vehicle, simply open its detail page and click 'Request Test Drive'. You can choose a date and time slot, and the seller will confirm your booking.";
      } else if (lower.includes('offer') || lower.includes('price')) {
        botResponse = "You can submit an offer directly using the 'Make an Offer' button on any listing. All offers are routed to the seller's dashboard with escrow options.";
      } else if (lower.includes('return') || lower.includes('policy') || lower.includes('guarantee')) {
        botResponse = "MotorVault provides a 7-day or 250-mile test-own guarantee. If you're not completely satisfied with your purchase, you can return the vehicle for a full refund.";
      } else if (lower.includes('sell') || lower.includes('list')) {
        botResponse = "Selling is easy! Click 'List Your Vehicle' in the top bar to launch our 5-step wizard with local photo upload and instant valuation.";
      }

      setChatHistory(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          time: 'Just now'
        }
      ]);
    }, 450);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-sm shadow-cyan-glow transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open MotorVault Assistant"
        >
          <Bot className="w-5 h-5 stroke-[2.5]" />
          <span className="hidden sm:inline font-display font-bold">Vault Concierge</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Expanded Help Drawer */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] rounded-3xl bg-[#0a0f1d] border border-cyan-500/30 shadow-cyan-glow-lg flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-[#0c162c] border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
                  Vault Concierge
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </h4>
                <p className="text-[11px] text-cyan-400/80 font-mono">Instant Local AI Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-cyan-500/10 bg-slate-950/60 p-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Concierge</span>
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'faq'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Quick FAQs</span>
            </button>
          </div>

          {/* Body Content */}
          {activeTab === 'chat' ? (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Chat messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        item.sender === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                          : 'bg-slate-900/90 border border-cyan-500/20 text-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {item.text}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 px-1">{item.time}</span>
                  </div>
                ))}
              </div>

              {/* Quick Suggestion Pills */}
              <div className="p-2 border-t border-slate-800 bg-slate-950/40 flex gap-1.5 overflow-x-auto no-scrollbar">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 border border-cyan-500/20 hover:border-cyan-400/50 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="p-3 border-t border-cyan-500/15 bg-slate-950/90 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question about MotorVault..."
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder-slate-500"
                />
                <button
                  onClick={() => handleSend()}
                  className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* FAQ tab */
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <h5 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  What is 150-Point Digital Inspection?
                </h5>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Our certified technicians physically audit every vehicle for structural integrity, powertrain telemetry, tire wear, brake rotor life, and EV battery health before listing.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <h5 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  How do test drives work?
                </h5>
                <p className="text-[11px] text-slate-400 leading-normal">
                  You can schedule an accompanied test drive directly with the private seller or MotorVault certified hub. Booking is completely free.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <h5 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  How does MotorVault protect buyers?
                </h5>
                <p className="text-[11px] text-slate-400 leading-normal">
                  All transaction deposits are held securely in an audited escrow account until you verify the car and receive title transfer.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
