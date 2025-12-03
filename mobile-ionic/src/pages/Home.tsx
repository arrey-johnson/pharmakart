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
  useIonToast,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import { 
  logOutOutline, 
  medkitOutline, 
  cartOutline, 
  receiptOutline,
  searchOutline,
  personCircleOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { RefresherEventDetail } from '@ionic/core';
import authService from '../services/auth.service';
import orderService from '../services/order.service';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const orders = await orderService.getOrders();
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => ['PENDING', 'CONFIRMED', 'PREPARING'].includes(o.status)).length,
        completedOrders: orders.filter(o => o.status === 'DELIVERED').length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchStats();
    event.detail.complete();
  };

  const handleLogout = () => {
    authService.logout();
    present({
      message: 'Logged out successfully',
      duration: 2000,
      color: 'success',
    });
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>PharmaKart</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#f8fafa' }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Header Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #008C8C 0%, #006b6b 100%)',
          padding: '24px 20px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
              </h1>
              <p style={{ opacity: 0.9, fontSize: '14px' }}>
                Manage your orders and health
              </p>
            </div>
            <IonIcon 
              icon={personCircleOutline} 
              style={{ fontSize: '48px', opacity: 0.8 }} 
            />
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Stats Cards */}
          {loading ? (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <IonSpinner name="crescent" color="primary" />
            </div>
          ) : (
            <IonGrid style={{ padding: 0 }}>
              <IonRow>
                <IonCol size="4">
                  <IonCard style={{ margin: 0, background: '#f0fafa', boxShadow: 'none' }}>
                    <IonCardContent style={{ textAlign: 'center', padding: '16px' }}>
                      <div style={{ 
                        background: '#008C8C', 
                        borderRadius: '50%', 
                        width: '48px', 
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px'
                      }}>
                        <IonIcon icon={receiptOutline} style={{ fontSize: '24px', color: 'white' }} />
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0' }}>
                        {stats.totalOrders}
                      </h3>
                      <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Total Orders</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                <IonCol size="4">
                  <IonCard style={{ margin: 0, background: '#fff4e6', boxShadow: 'none' }}>
                    <IonCardContent style={{ textAlign: 'center', padding: '16px' }}>
                      <div style={{ 
                        background: '#f59e0b', 
                        borderRadius: '50%', 
                        width: '48px', 
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px'
                      }}>
                        <span style={{ fontSize: '24px' }}>⏳</span>
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0' }}>
                        {stats.pendingOrders}
                      </h3>
                      <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>In Progress</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                <IonCol size="4">
                  <IonCard style={{ margin: 0, background: '#f0fdf4', boxShadow: 'none' }}>
                    <IonCardContent style={{ textAlign: 'center', padding: '16px' }}>
                      <div style={{ 
                        background: '#10b981', 
                        borderRadius: '50%', 
                        width: '48px', 
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px'
                      }}>
                        <span style={{ fontSize: '24px' }}>✓</span>
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0' }}>
                        {stats.completedOrders}
                      </h3>
                      <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Completed</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          )}

          {/* Quick Actions */}
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>Quick Actions</h3>
            
            <IonCard button onClick={() => history.push('/medicines')} style={{ marginBottom: '12px' }}>
              <IonCardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    background: '#f0fafa', 
                    borderRadius: '12px', 
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IonIcon icon={medkitOutline} style={{ fontSize: '32px', color: '#008C8C' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>Browse Medicines</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                      Search and order from verified pharmacies
                    </p>
                  </div>
                  <IonIcon icon={searchOutline} style={{ fontSize: '20px', color: '#ccc' }} />
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard button onClick={() => history.push('/cart')} style={{ marginBottom: '12px' }}>
              <IonCardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    background: '#fef3c7', 
                    borderRadius: '12px', 
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IonIcon icon={cartOutline} style={{ fontSize: '32px', color: '#f59e0b' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>My Cart</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                      View items in your shopping cart
                    </p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard button onClick={() => history.push('/orders')}>
              <IonCardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    background: '#ede9fe', 
                    borderRadius: '12px', 
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IonIcon icon={receiptOutline} style={{ fontSize: '32px', color: '#8b5cf6' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>My Orders</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                      Track your order history and status
                    </p>
                  </div>
                  {stats.pendingOrders > 0 && (
                    <div style={{
                      background: '#f59e0b',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '4px 12px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {stats.pendingOrders}
                    </div>
                  )}
                </div>
              </IonCardContent>
            </IonCard>
          </div>

          {/* Additional Info */}
          <IonCard style={{ marginTop: '24px', background: '#f0f9ff' }}>
            <IonCardContent>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ marginBottom: '8px', color: '#008C8C' }}>🏥 Need Help?</h4>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  Contact our support team or visit your nearest pharmacy
                </p>
                <IonButton size="small" fill="outline" color="primary">
                  Contact Support
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
