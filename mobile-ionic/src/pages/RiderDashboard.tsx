import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { bicycleOutline, checkmarkCircleOutline, timeOutline, logOutOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../services/auth.service';

const RiderDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [stats] = useState({
    totalDeliveries: 24,
    completedToday: 8,
    inProgress: 3,
    earnings: 12500,
  });
  const history = useHistory();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Rider Dashboard</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleLogout}>
            <IonIcon slot="icon-only" icon={logOutOutline} />
          </IonButton>
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
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                      ${stats.earnings}
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

