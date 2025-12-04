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
  cubeOutline,           // Package icon from web
  timeOutline,           // Clock icon from web  
  cashOutline,           // DollarSign icon from web
  trendingUpOutline,     // TrendingUp icon from web (same)
  medicalOutline,        // Pill icon from web
  logOutOutline,         // LogOut icon from web (same)
  notificationsOutline,  // Notification bell
  personOutline,         // Profile icon
  addCircleOutline,
} from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../services/auth.service';
import orderService from '../services/order.service';
import medicineService from '../services/medicine.service';
import { formatPrice } from '../config/constants';

const PharmacyDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalMedicines: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const history = useHistory();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [orders, medicines] = await Promise.all([
        orderService.getOrders(),
        medicineService.getAll(),
      ]);

      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
      const revenue = orders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + o.total_amount, 0);

      setStats({
        totalOrders,
        pendingOrders,
        totalMedicines: medicines.length,
        revenue,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
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
          <p style={{ color: '#666' }}>Manage your pharmacy operations</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <IonCard style={{ background: '#f0fafa' }}>
                    <IonCardContent>
                      <div style={{ textAlign: 'center' }}>
                        {/* Package icon - matches web */}
                        <IonIcon icon={cubeOutline} style={{ fontSize: '32px', color: '#008C8C' }} />
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                          {stats.totalOrders}
                        </h3>
                        <p style={{ fontSize: '12px', color: '#666' }}>Total Orders</p>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                <IonCol size="6">
                  <IonCard style={{ background: '#fff4e6' }}>
                    <IonCardContent>
                      <div style={{ textAlign: 'center' }}>
                        {/* Clock icon - matches web */}
                        <IonIcon icon={timeOutline} style={{ fontSize: '32px', color: '#ea580c' }} />
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                          {stats.pendingOrders}
                        </h3>
                        <p style={{ fontSize: '12px', color: '#666' }}>Pending</p>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                <IonCol size="6">
                  <IonCard style={{ background: '#f0f9ff' }}>
                    <IonCardContent>
                      <div style={{ textAlign: 'center' }}>
                        {/* Pill icon - matches web */}
                        <IonIcon icon={medicalOutline} style={{ fontSize: '32px', color: '#3b82f6' }} />
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                          {stats.totalMedicines}
                        </h3>
                        <p style={{ fontSize: '12px', color: '#666' }}>Medicines</p>
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
                        <p style={{ fontSize: '12px', color: '#666' }}>Revenue</p>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>

            {/* Quick Actions */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
              
          <IonCard button routerLink="/pharmacy/inventory">
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Pill icon - matches web */}
                <IonIcon icon={medicalOutline} style={{ fontSize: '28px', color: '#008C8C' }} />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 'bold' }}>Manage Inventory</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                    Add, edit, or remove medicines
                  </p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard button routerLink="/pharmacy/add-medicine">
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Add icon */}
                <IonIcon icon={addCircleOutline} style={{ fontSize: '28px', color: '#008C8C' }} />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 'bold' }}>Add New Medicine</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                    List a new product in your inventory
                  </p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard button routerLink="/pharmacy/orders">
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Package icon - matches web */}
                <IonIcon icon={cubeOutline} style={{ fontSize: '28px', color: '#008C8C' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontWeight: 'bold' }}>View Orders</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                    Manage incoming orders
                  </p>
                </div>
                {stats.pendingOrders > 0 && (
                  <IonBadge color="warning">{stats.pendingOrders}</IonBadge>
                )}
              </div>
            </IonCardContent>
          </IonCard>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PharmacyDashboard;

