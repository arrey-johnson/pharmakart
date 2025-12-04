import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonSpinner,
  useIonToast,
  IonNote,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { trashOutline, addOutline, removeOutline, cartOutline, notificationsOutline, personOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import cartService, { CartItem } from '../services/cart.service';
import orderService from '../services/order.service';
import authService from '../services/auth.service';
import { formatPrice } from '../config/constants';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [present] = useIonToast();
  const history = useHistory();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        const data = await cartService.getCartItems(user.id);
        setCartItems(data);
      }
    } catch (error) {
      present({
        message: 'Failed to load cart',
        duration: 2000,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await cartService.updateQuantity(itemId, newQuantity);
      await fetchCartItems();
    } catch (error) {
      present({
        message: 'Failed to update quantity',
        duration: 2000,
        color: 'danger',
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await cartService.removeFromCart(itemId);
      await fetchCartItems();
      present({
        message: 'Item removed from cart',
        duration: 2000,
        color: 'success',
      });
    } catch (error) {
      present({
        message: 'Failed to remove item',
        duration: 2000,
        color: 'danger',
      });
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setSubmitting(true);
    try {
      const user = authService.getCurrentUser();
      
      // Group items by pharmacy
      const pharmacyGroups = cartItems.reduce((groups: any, item) => {
        const pharmacyId = item.pharmacy_id || 'unknown';
        if (!groups[pharmacyId]) {
          groups[pharmacyId] = [];
        }
        groups[pharmacyId].push(item);
        return groups;
      }, {});

      // Create orders for each pharmacy
      for (const pharmacyId in pharmacyGroups) {
        const items = pharmacyGroups[pharmacyId];
        const totalAmount = items.reduce((sum: number, item: CartItem) => 
          sum + (item.price * item.quantity), 0
        );

        await orderService.createOrder({
          user_id: user.id,
          pharmacy_id: pharmacyId,
          items: items,
          total_amount: totalAmount,
          status: 'PENDING'
        });
      }

      // Clear cart
      await cartService.clearCart(user.id);

      present({
        message: 'Order placed successfully!',
        duration: 3000,
        color: 'success',
      });

      history.push('/orders');
    } catch (error) {
      present({
        message: 'Failed to place order',
        duration: 2000,
        color: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': 'white' }}>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon slot="icon-only" icon={notificationsOutline} style={{ color: '#008C8C', fontSize: '24px' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '80px', padding: '20px' }}>
            <IonIcon icon={cartOutline} style={{ fontSize: '80px', color: '#ccc' }} />
            <h2>Your cart is empty</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Browse medicines and add them to your cart</p>
            <IonButton routerLink="/medicines" color="primary">
              Browse Medicines
            </IonButton>
          </div>
        ) : (
          <>
            <IonList>
              {cartItems.map(item => (
                <IonCard key={item.id}>
                  <IonCardContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.medicine_name}</h3>
                        <IonNote>{item.pharmacy_name}</IonNote>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#008C8C', marginTop: '8px' }}>
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IonButton
                          size="small"
                          fill="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <IonIcon slot="icon-only" icon={removeOutline} />
                        </IonButton>
                        <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>
                          {item.quantity}
                        </span>
                        <IonButton
                          size="small"
                          fill="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <IonIcon slot="icon-only" icon={addOutline} />
                        </IonButton>
                        <IonButton
                          size="small"
                          color="danger"
                          fill="clear"
                          onClick={() => removeItem(item.id)}
                        >
                          <IonIcon slot="icon-only" icon={trashOutline} />
                        </IonButton>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>

            {/* Cart Summary */}
            <div style={{ padding: '16px', position: 'sticky', bottom: 0, background: 'white', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#008C8C' }}>
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <IonButton
                expand="block"
                onClick={handleCheckout}
                disabled={submitting || cartItems.length === 0}
                style={{ '--background': '#008C8C', height: '48px' }}
              >
                {submitting ? 'Processing...' : 'Proceed to Checkout'}
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Cart;

