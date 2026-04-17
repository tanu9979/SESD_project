import { Order } from '../types';

const STEPS = [
  { key: 'pending',            label: 'Order Placed',      icon: '📋' },
  { key: 'payment_confirmed',  label: 'Payment Confirmed', icon: '💳' },
  { key: 'processing',         label: 'Processing',        icon: '📦' },
  { key: 'shipped',            label: 'Shipped',           icon: '🚚' },
  { key: 'out_for_delivery',   label: 'Out for Delivery',  icon: '🏍️' },
  { key: 'delivered',          label: 'Delivered',         icon: '✅' },
];

const stepIndex = (status: string) => STEPS.findIndex(s => s.key === status);

const OrderTracker = ({ order }: { order: Order }) => {
  const current = stepIndex(order.status);
  if (order.status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-red-500 font-medium py-4">
        <span>❌</span> Order Cancelled
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-folio-light rounded-full" />
        <div
          className="absolute top-5 left-0 h-1 bg-folio-green rounded-full transition-all duration-500"
          style={{ width: `${(current / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((step, i) => (
          <div key={step.key} className="relative flex flex-col items-center gap-2 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300
              ${i <= current ? 'bg-folio-green border-folio-green text-white' : 'bg-white border-folio-light text-folio-muted'}`}>
              {step.icon}
            </div>
            <span className={`text-xs font-medium text-center max-w-16 leading-tight
              ${i <= current ? 'text-folio-green' : 'text-folio-muted'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      {order.estimatedDelivery && (
        <p className="text-sm text-folio-muted text-center mt-4">
          Estimated delivery: <span className="font-medium text-folio-green">{new Date(order.estimatedDelivery).toDateString()}</span>
        </p>
      )}
    </div>
  );
};

export default OrderTracker;
