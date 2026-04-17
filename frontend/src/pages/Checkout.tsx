import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAddresses, addAddress, estimateDelivery } from '../services/addressService';
import { placeOrder } from '../services/orderService';
import { confirmPayment, initiatePayment } from '../services/paymentService';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { Address } from '../types';

const Checkout = () => {
  const [addresses, setAddresses]     = useState<Address[]>([]);
  const [selectedAddr, setSelectedAddr] = useState('');
  const [delivery, setDelivery]       = useState<{ label: string; estimatedDate: string } | null>(null);
  const [method, setMethod]           = useState('card');
  const [loading, setLoading]         = useState(false);
  const [newAddr, setNewAddr]         = useState(false);
  const [addrForm, setAddrForm]       = useState({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
  const { cart, refreshCart } = useCart();
  const { convertPrice } = useLocation();
  const navigate = useNavigate();

  const total = cart.reduce((s: number, i: any) => s + (i.book?.price || 0), 0);

  useEffect(() => { getAddresses().then(r => { const list = r.data || []; setAddresses(list); if (list.length > 0) setSelectedAddr(list[0]._id); }); }, []);

  useEffect(() => {
    if (!selectedAddr || cart.length === 0) return;
    const addr = addresses.find(a => a._id === selectedAddr);
    const sellerPin = cart[0]?.book?.sellerPincode;
    if (addr && sellerPin) {
      estimateDelivery(sellerPin, addr.pincode).then(r => setDelivery(r.data));
    }
  }, [selectedAddr, cart]);

  const handleOrder = async (e: FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      let addrId = selectedAddr;
      if (newAddr) {
        const res = await addAddress(addrForm);
        addrId = res.data._id;
      }
      for (const item of cart) {
        const orderRes = await placeOrder({ bookId: item.book._id, addressId: addrId });
        const orderId  = orderRes.data._id;
        await initiatePayment(orderId, method);
        await confirmPayment(orderId);
      }
      await refreshCart();
      navigate('/my-orders');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Order failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleOrder} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-heading text-xl font-bold mb-4">Delivery Address</h2>
            {addresses.map(addr => (
              <label key={addr._id} className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer mb-3 transition-all ${selectedAddr === addr._id ? 'border-folio-green bg-folio-cream' : 'border-folio-light'}`}>
                <input type="radio" name="address" value={addr._id} checked={selectedAddr === addr._id} onChange={() => { setSelectedAddr(addr._id); setNewAddr(false); }} className="mt-1 accent-folio-green" />
                <div className="text-sm">
                  <p className="font-medium">{addr.fullName}</p>
                  <p className="text-folio-muted">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-folio-muted">{addr.phone}</p>
                </div>
              </label>
            ))}
            <button type="button" onClick={() => { setNewAddr(!newAddr); setSelectedAddr(''); }} className="text-folio-green text-sm font-medium hover:underline">+ Add new address</button>
            {newAddr && (
              <div className="mt-4 space-y-3">
                {['fullName','phone','street','city','state','pincode'].map(k => (
                  <input key={k} className="input" placeholder={k.charAt(0).toUpperCase() + k.slice(1)} value={(addrForm as any)[k]} onChange={e => setAddrForm(p => ({ ...p, [k]: e.target.value }))} required />
                ))}
              </div>
            )}
            {delivery && (
              <div className="mt-4 bg-folio-cream rounded-lg p-3 text-sm flex items-center gap-2">
                <span>🚚</span>
                <div>
                  <p className="font-medium text-folio-green">Estimated: {delivery.estimatedDate}</p>
                  <p className="text-folio-muted">{delivery.label}</p>
                </div>
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="font-heading text-xl font-bold mb-4">Payment Method</h2>
            {[['card','💳 Credit/Debit Card'],['upi','📱 UPI'],['cod','🏠 Cash on Delivery']].map(([val, label]) => (
              <label key={val} className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer mb-3 transition-all ${method === val ? 'border-folio-green bg-folio-cream' : 'border-folio-light'}`}>
                <input type="radio" name="method" value={val} checked={method === val} onChange={() => setMethod(val)} className="accent-folio-green" />
                <span className="font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="card p-6 h-fit space-y-4">
          <h2 className="font-heading text-xl font-bold">Order Summary</h2>
          {cart.map((item: any) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span className="text-folio-muted line-clamp-1 flex-1 mr-2">{item.book?.title}</span>
              <span className="font-medium">{convertPrice(item.book?.price)}</span>
            </div>
          ))}
          <div className="border-t border-folio-light pt-4 flex justify-between font-bold text-lg">
            <span>Total</span><span className="text-folio-green">{convertPrice(total)}</span>
          </div>
          <button type="submit" disabled={loading || (!selectedAddr && !newAddr)} className="btn-primary w-full">
            {loading ? 'Placing order...' : `Pay ${convertPrice(total)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
