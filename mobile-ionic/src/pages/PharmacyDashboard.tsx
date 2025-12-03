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
  IonIcon,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from '@ionic/react';
import { 
  medkitOutline, 
  receiptOutline, 
  addCircleOutline,
  trendingUpOutline,
  logOutOutline 
} from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../services/auth.service';
import orderService from '../services/order.service';
import medicineService from '../services/medicine.service';

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
        <IonToolbar color="primary">
          <IonTitle>Pharmacy Dashboard</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleLogout}>
            <IonIcon slot="icon-only" icon={logOutOutline} />
          </IonButton>
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
                        <IonIcon icon={receiptOutline} style={{ fontSize: '32px', color: '#008C8C' }} />
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
                        <IonIcon icon={trendingUpOutline} style={{ fontSize: '32px', color: '#f59e0b' }} />
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
                        <IonIcon icon={medkitOutline} style={{ fontSize: '32px', color: '#3b82f6' }} />
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
                        <span style={{ fontSize: '32px' }}>💰</span>
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                          ${stats.revenue.toFixed(0)}
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
                    <IonIcon icon={medkitOutline} style={{ fontSize: '28px', color: '#008C8C' }} />
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
                    <IonIcon icon={receiptOutline} style={{ fontSize: '28px', color: '#008C8C' }} />
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

