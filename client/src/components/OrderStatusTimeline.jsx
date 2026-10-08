import React from 'react';
import { Check, Clock, PackageCheck, Truck, Home, XCircle, AlertCircle } from 'lucide-react';

const STAGES = [
  { key: 'Placed', label: 'Order Placed', icon: Clock, desc: 'Received & verified' },
  { key: 'Confirmed', label: 'Confirmed', icon: Check, desc: 'Store accepted order' },
  { key: 'Packed', label: 'Packed', icon: PackageCheck, desc: 'Cold bags & packed' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck, desc: 'Driver on the way' },
  { key: 'Delivered', label: 'Delivered', icon: Home, desc: 'Handed over at door' }
];

export default function OrderStatusTimeline({ status, history = [] }) {
  const isCancelled = status === 'Cancelled';
  const currentStageIdx = STAGES.findIndex((s) => s.key === status);

  if (isCancelled) {
    const cancelHistory = history.find((h) => h.status === 'Cancelled');
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
          <XCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-rose-900 text-sm sm:text-base">This Order Has Been Cancelled</h4>
          <p className="text-xs text-rose-700 mt-0.5">
            {cancelHistory?.notes || 'The order was cancelled and items have been returned to warehouse stock.'}
          </p>
          {cancelHistory?.timestamp && (
            <p className="text-[11px] text-rose-500 mt-1 font-mono">
              Cancelled on: {new Date(cancelHistory.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      {/* Desktop Horizontal Stepper */}
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-slate-200 z-0 rounded-full" />
          
          {/* Active Progress Connecting Line */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-emerald-500 z-0 rounded-full transition-all duration-700"
            style={{
              width: `${(Math.max(0, currentStageIdx) / (STAGES.length - 1)) * 100}%`
            }}
          />

          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            const isUpcoming = idx > currentStageIdx;

            const stageHistory = history.find((h) => h.status === stage.key);

            return (
              <div key={stage.key} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                      : isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 scale-110 shadow-lg'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="text-center mt-3 max-w-[110px]">
                  <p
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-emerald-700'
                        : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight truncate">
                    {stageHistory ? new Date(stageHistory.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="md:hidden space-y-4 relative pl-4 border-l-2 border-slate-200 ml-4">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCompleted = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;
          const isUpcoming = idx > currentStageIdx;

          const stageHistory = history.find((h) => h.status === stage.key);

          return (
            <div key={stage.key} className="relative flex items-start gap-3">
              <div
                className={`-ml-[25px] w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 transition ${
                  isCompleted || isCurrent
                    ? 'bg-emerald-600 text-white ring-2 ring-white shadow'
                    : 'bg-white text-slate-400 border border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <p className={`text-xs font-bold ${isCurrent ? 'text-emerald-700' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                  {stage.label}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {stageHistory?.notes || stage.desc}
                </p>
                {stageHistory?.timestamp && (
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {new Date(stageHistory.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Latest Timeline Note Box */}
      {history.length > 0 && (
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
          <AlertCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900">Latest Update: </span>
            <span>{history[history.length - 1].notes || `Order status is currently ${status}`}</span>
            <span className="text-slate-400 text-[11px] ml-1 font-mono">
              ({new Date(history[history.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
