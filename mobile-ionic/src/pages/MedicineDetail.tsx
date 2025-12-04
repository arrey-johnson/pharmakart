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
  IonBackButton,
  IonSpinner,
  IonChip,
  useIonToast,
} from '@ionic/react';
import { notificationsOutline, cartOutline, locationOutline, addOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import medicineService from '../services/medicine.service';
import cartService from '../services/cart.service';
import { formatPrice } from '../config/constants';

const MedicineDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [medicine, setMedicine] = useState<any>(null);
  const [pharmacyOffers, setPharmacyOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();

  useEffect(() => {
    fetchMedicineDetails();
  }, [id]);

  const fetchMedicineDetails = async () => {
    try {
      // Get medicine details from database
      const medicineData = await medicineService.getById(id);
      setMedicine(medicineData);

      // Get all pharmacy offers for this medicine from database
      const offers = await medicineService.getPharmacyOffers(id);
      setPharmacyOffers(offers || []);
    } catch (error) {
      console.error('Failed to fetch medicine details:', error);
      present({
        message: 'Failed to load medicine details',
        duration: 2000,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (pharmacyId: string, price: number) => {
    try {
      await cartService.addToCart(id, 1);
      present({
        message: 'Added to cart',
        duration: 2000,
        color: 'success',
      });
    } catch (error) {
      present({
        message: 'Failed to add to cart',
        duration: 2000,
        color: 'danger',
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': 'white' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/medicines" />
          </IonButtons>
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
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : medicine ? (
          <div style={{ padding: '20px' }}>
            {/* Medicine Info */}
            <IonCard style={{ marginBottom: '16px' }}>
              {medicine.image_url && (
                <img 
                  src={medicine.image_url} 
                  alt={medicine.name}
                  style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                />
              )}
              <IonCardHeader>
                <IonCardTitle style={{ fontSize: '24px' }}>{medicine.name}</IonCardTitle>
                {medicine.genericName && (
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                    Generic: {medicine.genericName}
                  </p>
                )}
                {medicine.prescriptionRequired && (
                  <IonChip color="warning" style={{ marginTop: '8px' }}>
                    Prescription Required
                  </IonChip>
                )}
              </IonCardHeader>
              <IonCardContent>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  {medicine.description}
                </p>
                {medicine.dosage && (
                  <p style={{ fontSize: '13px', color: '#999', marginTop: '12px' }}>
                    <strong>Dosage:</strong> {medicine.dosage}
                  </p>
                )}
              </IonCardContent>
            </IonCard>

            {/* Available at Pharmacies */}
            <h3 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 'bold' }}>
              Available at {pharmacyOffers.length || 0} {pharmacyOffers.length === 1 ? 'Pharmacy' : 'Pharmacies'}
            </h3>

            {pharmacyOffers.length === 0 ? (
              <IonCard>
                <IonCardContent>
                  <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                    This medicine is currently not available at any pharmacy
                  </p>
                </IonCardContent>
              </IonCard>
            ) : (
              pharmacyOffers.map((offer: any) => (
                <IonCard key={offer.id} style={{ marginBottom: '12px' }}>
                  <IonCardContent>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                          {offer.pharmacy?.name || 'Pharmacy'}
                        </h4>
                        {offer.pharmacy?.rating != null && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '16px' }}>⭐</span>
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>
                              {Number(offer.pharmacy.rating).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                        <IonIcon icon={locationOutline} style={{ fontSize: '14px', verticalAlign: 'middle' }} />
                        {' '}{offer.pharmacy?.address || 'Location not specified'}
                      </p>
                      
                      <div style={{ 
                        marginTop: '12px', 
                        paddingTop: '12px', 
                        borderTop: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#008C8C', margin: '0 0 4px' }}>
                            {formatPrice(offer.price)}
                          </p>
                          <p style={{ fontSize: '12px', color: offer.stockQuantity > 0 ? '#10b981' : '#ef4444', margin: 0 }}>
                            {offer.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                          </p>
                          {offer.stockQuantity > 0 && offer.stockQuantity <= 10 && (
                            <p style={{ fontSize: '11px', color: '#f59e0b', margin: '2px 0 0' }}>
                              Only {offer.stockQuantity} left
                            </p>
                          )}
                        </div>
                        <IonButton
                          onClick={() => handleAddToCart(offer.pharmacyId, offer.price)}
                          disabled={!offer.stockQuantity || offer.stockQuantity === 0}
                          style={{ 
                            '--background': offer.stockQuantity > 0 ? '#008C8C' : '#ccc',
                            minWidth: '140px'
                          }}
                        >
                          <IonIcon slot="start" icon={addOutline} />
                          Add to Cart
                        </IonButton>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '60px', padding: '20px' }}>
            <p style={{ color: '#666' }}>Medicine not found</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MedicineDetail;

