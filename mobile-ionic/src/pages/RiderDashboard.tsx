import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from '@ionic/react';
import { 
  bicycleOutline,         // Bike icon from web (same)
  checkmarkCircleOutline, // CheckCircle icon from web (same)
  timeOutline,            // Clock icon from web (same)
  cashOutline,            // DollarSign icon from web
  navigateOutline,        // Navigation icon from web
  cubeOutline,            // Package icon from web
  notificationsOutline,   // Notification bell
  personOutline,          // Profile icon
  logOutOutline           // LogOut icon from web (same)
} from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../services/auth.service';
import deliveryService from '../services/delivery.service';
import { formatPrice } from '../config/constants';

const RiderDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedToday: 0,
    inProgress: 0,
    earnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser?.id) {
      fetchDeliveryStats(currentUser.id);
    }
  }, []);

  const fetchDeliveryStats = async (riderId: string) => {
    try {
      const [deliveries, earningsData] = await Promise.all([
        deliveryService.getAll(riderId),
        deliveryService.getEarnings()
      ]);

      const now = new Date();
      const today = now.toISOString().split('T')[0];

      setStats({
        totalDeliveries: deliveries.length,
        completedToday: deliveries.filter(d => 
          d.status === 'DELIVERED' && 
          d.createdAt.startsWith(today)
        ).length,
        inProgress: deliveries.filter(d => 
          ['ASSIGNED', 'PICKED_UP'].includes(d.status)
        ).length,
        earnings: earningsData.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch delivery stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    history.push('/login');
  };

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

      <IonContent className="ion-padding">
        <div style={{ marginBottom: '24px' }}>
          <h2>Welcome, {user?.name}!</h2>
          <p style={{ color: '#666' }}>Ready for deliveries today</p>
        </div>

        {/* Stats Cards */}
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonCard style={{ background: '#f0fafa' }}>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <IonIcon icon={bicycleOutline} style={{ fontSize: '32px', color: '#008C8C' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                      {stats.totalDeliveries}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666' }}>Total Deliveries</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard style={{ background: '#f0f9ff' }}>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <IonIcon icon={timeOutline} style={{ fontSize: '32px', color: '#3b82f6' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                      {stats.inProgress}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666' }}>In Progress</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard style={{ background: '#f0fdf4' }}>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '32px', color: '#10b981' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                      {stats.completedToday}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666' }}>Completed Today</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard style={{ background: '#fef3c7' }}>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '32px' }}>💰</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '8px 0' }}>
                      {formatPrice(stats.earnings)}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666' }}>Earnings</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Quick Actions */}
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
          
          <IonCard button>
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <IonIcon icon={bicycleOutline} style={{ fontSize: '28px', color: '#008C8C' }} />
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 'bold' }}>My Deliveries</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                      View current and past deliveries
                    </p>
                  </div>
                </div>
                {stats.inProgress > 0 && (
                  <IonBadge color="primary">{stats.inProgress}</IonBadge>
                )}
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard button>
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>📊</span>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 'bold' }}>Earnings Report</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                    View your earnings and statistics
                  </p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RiderDashboard;

