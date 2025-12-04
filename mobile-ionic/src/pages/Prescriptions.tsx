import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  useIonToast,
} from '@ionic/react';
import { 
  notificationsOutline, 
  cartOutline,
  cloudUploadOutline,
  addOutline,
  imageOutline,
} from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { RefresherEventDetail } from '@ionic/core';
import authService from '../services/auth.service';

const Prescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        // TODO: Call prescription service when created
        // const data = await prescriptionService.getUserPrescriptions(user.id);
        // setPrescriptions(data);
        setPrescriptions([]);
      }
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchPrescriptions();
    event.detail.complete();
  };

  const handleUploadPrescription = () => {
    present({
      message: 'Upload prescription feature coming soon',
      duration: 2000,
      color: 'primary',
    });
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
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              My Prescriptions
            </h1>
            <p style={{ color: '#666', marginTop: '4px', fontSize: '14px' }}>
              Upload and manage your prescriptions
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <IonSpinner name="crescent" color="primary" />
            </div>
          ) : prescriptions.length === 0 ? (
            <IonCard>
              <IonCardContent>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <IonIcon 
                    icon={imageOutline} 
                    style={{ fontSize: '80px', color: '#ccc', marginBottom: '16px' }} 
                  />
                  <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>No prescriptions yet</h2>
                  <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
                    Upload your prescription and get quotes from pharmacies
                  </p>
                  <IonButton onClick={handleUploadPrescription}>
                    <IonIcon slot="start" icon={cloudUploadOutline} />
                    Upload Prescription
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          ) : (
            <div>
              {prescriptions.map((prescription) => (
                <IonCard key={prescription.id} style={{ marginBottom: '12px' }}>
                  <IonCardContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px' }}>
                          Prescription #{prescription.id.substring(0, 8)}
                        </p>
                        <p style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}>
                          {formatDate(prescription.createdAt)}
                        </p>
                      </div>
                      <IonBadge color={prescription.status === 'approved' ? 'success' : 'warning'}>
                        {prescription.status}
                      </IonBadge>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button for Upload */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary" onClick={handleUploadPrescription}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Prescriptions;

