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
  IonList,
  IonItem,
  IonLabel,
  useIonToast,
} from '@ionic/react';
import { 
  personOutline,
  mailOutline,
  callOutline,
  locationOutline,
  logOutOutline,
  createOutline,
  shieldCheckmarkOutline,
  notificationsOutline,
} from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../services/auth.service';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [present] = useIonToast();
  const history = useHistory();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    present({
      message: 'Logged out successfully',
      duration: 2000,
      color: 'success',
    });
    window.location.href = '/login';
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

      <IonContent style={{ '--background': '#f8fafa' }}>
        <div style={{ padding: '20px' }}>
          {/* Profile Header */}
          <IonCard style={{ marginBottom: '16px' }}>
            <IonCardContent>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #008C8C 0%, #006b6b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '32px',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 'bold' }}>
                  {user?.name || 'User'}
                </h2>
                <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                  {user?.role === 'CLIENT' ? 'Customer' : user?.role}
                </p>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Account Info */}
          <IonCard style={{ marginBottom: '16px' }}>
            <IonCardHeader>
              <IonCardTitle style={{ fontSize: '16px' }}>Account Information</IonCardTitle>
            </IonCardHeader>
            <IonCardContent style={{ padding: 0 }}>
              <IonList style={{ background: 'transparent' }}>
                <IonItem lines="full">
                  <IonIcon icon={personOutline} slot="start" color="primary" />
                  <IonLabel>
                    <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px' }}>Name</p>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>{user?.name || 'Not set'}</h3>
                  </IonLabel>
                </IonItem>

                <IonItem lines="full">
                  <IonIcon icon={mailOutline} slot="start" color="primary" />
                  <IonLabel>
                    <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px' }}>Email</p>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>{user?.email}</h3>
                  </IonLabel>
                </IonItem>

                <IonItem lines="full">
                  <IonIcon icon={callOutline} slot="start" color="primary" />
                  <IonLabel>
                    <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px' }}>Phone</p>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>{user?.phone || 'Not set'}</h3>
                  </IonLabel>
                </IonItem>

                <IonItem lines="none">
                  <IonIcon icon={locationOutline} slot="start" color="primary" />
                  <IonLabel>
                    <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px' }}>Location</p>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>
                      {user?.address || user?.subdivision || 'Not set'}
                    </h3>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Actions */}
          <IonCard style={{ marginBottom: '16px' }}>
            <IonCardContent style={{ padding: '12px' }}>
              <IonButton 
                expand="block" 
                fill="outline"
                style={{ marginBottom: '8px' }}
              >
                <IonIcon slot="start" icon={createOutline} />
                Edit Profile
              </IonButton>

              <IonButton 
                expand="block" 
                fill="outline"
                color="medium"
              >
                <IonIcon slot="start" icon={shieldCheckmarkOutline} />
                Change Password
              </IonButton>
            </IonCardContent>
          </IonCard>

          {/* Logout */}
          <IonButton 
            expand="block" 
            color="danger"
            onClick={handleLogout}
            style={{ marginTop: '8px' }}
          >
            <IonIcon slot="start" icon={logOutOutline} />
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;

