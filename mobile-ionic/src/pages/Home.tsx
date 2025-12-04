import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButtons,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonBadge,
  useIonToast,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import { 
  logOutOutline, 
  cubeOutline,           // Package icon from web
  timeOutline,           // Clock icon from web
  checkmarkCircleOutline, // CheckCircle icon from web
  personOutline,         // User icon from web
  mailOutline,           // Mail icon from web
  callOutline,           // Phone icon from web
  locationOutline,       // MapPin icon from web
  notificationsOutline,  // Notification bell
  medkitOutline, 
  cartOutline, 
  receiptOutline,
  searchOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { RefresherEventDetail } from '@ionic/core';
import authService from '../services/auth.service';
import orderService from '../services/order.service';
import './Home.css';

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: 'Pending', color: 'warning', icon: '⏱️' },
  CONFIRMED: { label: 'Confirmed', color: 'primary', icon: '✓' },
  PREPARING: { label: 'Preparing', color: 'secondary', icon: '📦' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'tertiary', icon: '🚚' },
  DELIVERED: { label: 'Delivered', color: 'success', icon: '✅' },
  CANCELLED: { label: 'Cancelled', color: 'danger', icon: '❌' },
};

const Home: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status)).length,
    completedOrders: orders.filter(o => o.status === 'DELIVERED').length,
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

  const formatPrice = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': 'white' }}>
          <IonButtons slot="end">
            <IonButton routerLink="/app/cart">
              <IonIcon slot="icon-only" icon={cartOutline} style={{ color: '#008C8C', fontSize: '24px' }} />
            </IonButton>
            <IonButton>
              <IonIcon slot="icon-only" icon={notificationsOutline} style={{ color: '#008C8C', fontSize: '24px' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#f8fafa' }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div style={{ padding: '20px' }}>
          {/* Header - Matching Web App */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p style={{ color: '#666', marginTop: '4px', fontSize: '14px' }}>
              Manage your orders and profile
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <IonSpinner name="crescent" color="primary" />
            </div>
          ) : (
            <>
              {/* Stats Cards - Matching Web App */}
              <IonGrid style={{ padding: 0, marginBottom: '24px' }}>
                <IonRow>
                  <IonCol size="12" sizeMd="4">
                    <IonCard style={{ margin: 0 }}>
                      <IonCardContent style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            background: 'rgba(0, 140, 140, 0.1)',
                            borderRadius: '50%',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {/* Package icon - matches web */}
                            <IonIcon icon={cubeOutline} style={{ fontSize: '24px', color: '#008C8C' }} />
                          </div>
                          <div>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                              {stats.totalOrders}
                            </p>
                            <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0' }}>
                              Total Orders
                            </p>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                  <IonCol size="12" sizeMd="4">
                    <IonCard style={{ margin: 0 }}>
                      <IonCardContent style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            background: '#fff4e6',
                            borderRadius: '50%',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {/* Clock icon - matches web */}
                            <IonIcon icon={timeOutline} style={{ fontSize: '24px', color: '#ea580c' }} />
                          </div>
                          <div>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                              {stats.pendingOrders}
                            </p>
                            <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0' }}>
                              In Progress
                            </p>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                  <IonCol size="12" sizeMd="4">
                    <IonCard style={{ margin: 0 }}>
                      <IonCardContent style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            background: '#f0fdf4',
                            borderRadius: '50%',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {/* CheckCircle icon - matches web */}
                            <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '24px', color: '#16a34a' }} />
                          </div>
                          <div>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                              {stats.completedOrders}
                            </p>
                            <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0' }}>
                              Completed
                            </p>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                </IonRow>
              </IonGrid>

              {/* Recent Orders Card - Matching Web App */}
              <IonCard style={{ marginBottom: '16px' }}>
                <IonCardHeader>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <IonCardTitle>Recent Orders</IonCardTitle>
                      <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                        Your latest medicine orders
                      </p>
                    </div>
                    <IonButton 
                      size="small" 
                      fill="clear" 
                      onClick={() => history.push('/orders')}
                    >
                      View All →
                    </IonButton>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px' }}>
                      <IonIcon icon={receiptOutline} style={{ fontSize: '48px', color: '#ccc', marginBottom: '12px' }} />
                      <p style={{ color: '#666', marginBottom: '16px' }}>No orders yet</p>
                      <IonButton size="small" onClick={() => history.push('/medicines')}>
                        Browse Medicines
                      </IonButton>
                    </div>
                  ) : (
                    <div>
                      {orders.slice(0, 5).map((order) => {
                        const status = statusConfig[order.status] || statusConfig['PENDING'];
                        return (
                          <div 
                            key={order.id}
                            onClick={() => history.push(`/orders/${order.id}`)}
                            style={{
                              padding: '16px',
                              marginBottom: '8px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              background: 'white'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                <span style={{ fontSize: '20px' }}>{status.icon}</span>
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px' }}>
                                    Order #{order.id.substring(0, 8)}
                                  </p>
                                  <p style={{ fontSize: '13px', color: '#666', margin: '2px 0 0' }}>
                                    {order.pharmacy?.name || 'Pharmacy'} • {formatDate(order.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: 'bold', margin: 0, fontSize: '15px' }}>
                                  {formatPrice(order.totalAmount)}
                                </p>
                                <IonBadge color={status.color} style={{ marginTop: '4px' }}>
                                  {status.label}
                                </IonBadge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </IonCardContent>
              </IonCard>

              {/* Profile Card - Matching Web App */}
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Profile</IonCardTitle>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                    Your account information
                  </p>
                </IonCardHeader>
                <IonCardContent>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Name - User icon from web */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        background: '#f4f5f8', 
                        borderRadius: '50%', 
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IonIcon icon={personOutline} style={{ fontSize: '18px' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Name</p>
                        <p style={{ fontWeight: '500', margin: '2px 0 0', fontSize: '14px' }}>
                          {user?.name || 'Not set'}
                        </p>
                      </div>
                    </div>

                    {/* Email - Mail icon from web */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        background: '#f4f5f8', 
                        borderRadius: '50%', 
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IonIcon icon={mailOutline} style={{ fontSize: '18px' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Email</p>
                        <p style={{ fontWeight: '500', margin: '2px 0 0', fontSize: '14px' }}>
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Phone - Phone icon from web */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        background: '#f4f5f8', 
                        borderRadius: '50%', 
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IonIcon icon={callOutline} style={{ fontSize: '18px' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Phone</p>
                        <p style={{ fontWeight: '500', margin: '2px 0 0', fontSize: '14px' }}>
                          {user?.phone || 'Not set'}
                        </p>
                      </div>
                    </div>

                    {/* Location - MapPin icon from web */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        background: '#f4f5f8', 
                        borderRadius: '50%', 
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IonIcon icon={locationOutline} style={{ fontSize: '18px' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Location</p>
                        <p style={{ fontWeight: '500', margin: '2px 0 0', fontSize: '14px' }}>
                          {user?.address || user?.subdivision || 'Not set'}
                        </p>
                      </div>
                    </div>

                    {/* Edit Profile Button */}
                    <IonButton 
                      expand="block" 
                      fill="outline"
                      style={{ marginTop: '8px' }}
                    >
                      Edit Profile
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
