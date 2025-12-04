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
  IonButtons,
  IonSpinner,
} from '@ionic/react';
import { 
  peopleOutline,        // Users icon from web (same)
  storefrontOutline,    // Store icon from web
  cubeOutline,          // Package icon from web
  cashOutline,          // DollarSign icon from web
  trendingUpOutline,    // TrendingUp icon from web
  bicycleOutline,       // Bike icon from web
  settingsOutline,      // Settings icon from web (same)
  barChartOutline,      // BarChart3 icon from web
  notificationsOutline, // Notification bell
  personOutline,        // Profile icon
  logOutOutline         // LogOut icon from web (same)
} from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../services/auth.service';
import adminService from '../services/admin.service';
import { formatPrice } from '../config/constants';

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPharmacies: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const overview = await adminService.getOverview();
      setStats({
        totalUsers: overview.totalUsers || 0,
        totalPharmacies: overview.totalPharmacies || 0,
        totalOrders: overview.totalOrders || 0,
        revenue: overview.totalRevenue || 0,
      });
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
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
                    {/* Users icon - matches web */}
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
                    {/* Store icon - matches web */}
                    <IonIcon icon={storefrontOutline} style={{ fontSize: '32px', color: '#3b82f6' }} />
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
                    {/* Package icon - matches web */}
                    <IonIcon icon={cubeOutline} style={{ fontSize: '32px', color: '#f59e0b' }} />
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
                    {/* DollarSign icon - matches web */}
                    <IonIcon icon={cashOutline} style={{ fontSize: '32px', color: '#16a34a' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '8px 0' }}>
                      {formatPrice(stats.revenue)}
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
                {/* Users icon - matches web */}
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
                {/* Store icon - matches web */}
                <IonIcon icon={storefrontOutline} style={{ fontSize: '28px', color: '#008C8C' }} />
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
                {/* Settings icon - matches web */}
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

