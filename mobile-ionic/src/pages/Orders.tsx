import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import orderService, { Order } from '../services/order.service';
import { RefresherEventDetail } from '@ionic/core';

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'warning' },
  CONFIRMED: { label: 'Confirmed', color: 'primary' },
  PREPARING: { label: 'Preparing', color: 'secondary' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'tertiary' },
  DELIVERED: { label: 'Delivered', color: 'success' },
  CANCELLED: { label: 'Cancelled', color: 'danger' },
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchOrders();
    event.detail.complete();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>My Orders</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '80px', padding: '20px' }}>
            <h2>No orders yet</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Start shopping to see your orders here</p>
            <IonButton routerLink="/medicines" color="primary">
              Browse Medicines
            </IonButton>
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            {orders.map(order => (
              <IonCard key={order.id} style={{ marginBottom: '12px' }}>
                <IonCardHeader>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IonCardTitle style={{ fontSize: '16px' }}>
                      Order #{order.id.substring(0, 8)}
                    </IonCardTitle>
                    <IonBadge color={statusConfig[order.status]?.color || 'medium'}>
                      {statusConfig[order.status]?.label || order.status}
                    </IonBadge>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    {order.pharmacy?.name || 'Pharmacy'}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                    {formatDate(order.createdAt)}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#008C8C' }}>
                      ${order.total_amount.toFixed(2)}
                    </span>
                    <IonButton 
                      size="small" 
                      fill="outline"
                      routerLink={`/orders/${order.id}`}
                    >
                      View Details
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Orders;

