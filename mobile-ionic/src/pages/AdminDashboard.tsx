import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from '@ionic/react';
import { 
  peopleOutline, 
  medkitOutline, 
  receiptOutline,
  settingsOutline,
  logOutOutline 
} from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../services/auth.service';

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [stats] = useState({
    totalUsers: 156,
    totalPharmacies: 24,
    totalOrders: 342,
    revenue: 45600,
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
          <IonTitle>Admin Dashboard</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleLogout}>
            <IonIcon slot="icon-only" icon={logOutOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ marginBottom: '24px' }}>
          <h2>Admin Panel</h2>
          <p style={{ color: '#666' }}>Manage PharmaKart platform</p>
        </div>

        {/* Stats Cards */}
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonCard style={{ background: '#f0fafa' }}>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <IonIcon icon={peopleOutline} style={{ fontSize: '32px', color: '#008C8C' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                      {stats.totalUsers}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666' }}>Total Users</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard style={{ background: '#f0f9ff' }}>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <IonIcon icon={medkitOutline} style={{ fontSize: '32px', color: '#3b82f6' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                      {stats.totalPharmacies}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666' }}>Pharmacies</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard style={{ background: '#fef3c7' }}>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <IonIcon icon={receiptOutline} style={{ fontSize: '32px', color: '#f59e0b' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                      {stats.totalOrders}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666' }}>Total Orders</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard style={{ background: '#f0fdf4' }}>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '32px' }}>💰</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                      ${stats.revenue}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666' }}>Total Revenue</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Management Options */}
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Management</h3>
          
          <IonCard button>
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IonIcon icon={peopleOutline} style={{ fontSize: '28px', color: '#008C8C' }} />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 'bold' }}>User Management</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                    View and manage all users
                  </p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard button>
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IonIcon icon={medkitOutline} style={{ fontSize: '28px', color: '#008C8C' }} />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 'bold' }}>Pharmacy Management</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                    Approve and manage pharmacies
                  </p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard button>
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IonIcon icon={settingsOutline} style={{ fontSize: '28px', color: '#008C8C' }} />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 'bold' }}>Platform Settings</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                    Configure platform parameters
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

export default AdminDashboard;

