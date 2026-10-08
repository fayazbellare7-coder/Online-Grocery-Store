import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, ShieldCheck, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, amount, onConfirmPayment }) {
  const [tab, setTab] = useState('card'); // 'card' | 'upi' | 'netbanking'
  const [simulateSuccess, setSimulateSuccess] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Mock Card Form
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Mock UPI
  const [upiId, setUpiId] = useState('user@okaxis');

  if (!isOpen) return null;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onConfirmPayment(simulateSuccess);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">FreshCart Secure Payment Gateway</h3>
              <p className="text-[11px] text-slate-400">Mock Payment Simulator (Demo Mode)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount bar */}
        <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-900">Total Payable Amount</span>
          <span className="text-lg font-black text-emerald-700">${Number(amount).toFixed(2)}</span>
        </div>

        {/* Payment Tabs */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setTab('card')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                tab === 'card'
                  ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('upi')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                tab === 'upi'
                  ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>UPI / QR</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('netbanking')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                tab === 'netbanking'
                  ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Net Banking</span>
            </button>
          </div>

          {/* Tab Form */}
          {tab === 'card' && (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Expires (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === 'upi' && (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">UPI ID / VPA</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500">Supports Google Pay, Apple Pay, PhonePe, Paytm, and BHIM.</p>
            </div>
          )}

          {tab === 'netbanking' && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <label className="block text-[11px] font-bold text-slate-700">Choose Bank</label>
              <select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs">
                <option>Chase Bank (Fast Checkout)</option>
                <option>Bank of America</option>
                <option>Wells Fargo</option>
                <option>Citibank</option>
              </select>
            </div>
          )}

          {/* Hackathon Demo Evaluator Simulation Selector */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs space-y-2">
            <p className="font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Demo Simulator Outcome
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSimulateSuccess(true)}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition ${
                  simulateSuccess
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" /> Simulate Success
              </button>
              <button
                type="button"
                onClick={() => setSimulateSuccess(false)}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition ${
                  !simulateSuccess
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <AlertTriangle className="w-3 h-3" /> Simulate Decline
              </button>
            </div>
          </div>

          {/* CTA Pay button */}
          <button
            type="button"
            disabled={processing}
            onClick={handlePay}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing Mock Payment...
              </>
            ) : (
              `Pay $${Number(amount).toFixed(2)}`
            )}
          </button>

          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulated sandbox transaction. No real money charged.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
