import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  useIonToast,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import { cartOutline, addOutline, notificationsOutline, personOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import medicineService, { Medicine } from '../services/medicine.service';
import { formatPrice } from '../config/constants';

const categories = [
  { name: 'All', slug: 'all' },
  { name: 'Pain & Fever', slug: 'pain-fever' },
  { name: 'Cough & Cold', slug: 'cough-cold' },
  { name: 'Malaria', slug: 'malaria' },
  { name: 'Vitamins', slug: 'vitamins' },
  { name: 'Antibiotics', slug: 'antibiotics' },
];

const Medicines: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();
  const history = useHistory();

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [searchText, selectedCategory, medicines]);

  const fetchMedicines = async () => {
    try {
      const data = await medicineService.getAll();
      setMedicines(data);
    } catch (error) {
      present({
        message: 'Failed to load medicines',
        duration: 2000,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMedicines = () => {
    let filtered = medicines;
    
    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchText.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Filter by category (if implemented in backend)
    if (selectedCategory !== 'all') {
      // You can implement category filtering here
    }
    
    setFilteredMedicines(filtered);
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
        <IonToolbar style={{ '--background': 'white' }}>
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Search for medicines..."
            animated
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Categories */}
        <div style={{ padding: '12px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {categories.map(cat => (
            <IonChip
              key={cat.slug}
              color={selectedCategory === cat.slug ? 'primary' : 'medium'}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.name}
            </IonChip>
          ))}
        </div>

        {/* Medicines Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : (
          <IonGrid>
            <IonRow>
              {filteredMedicines.map(medicine => (
                <IonCol size="6" sizeMd="4" sizeLg="3" key={medicine.id}>
                  <IonCard 
                    button 
                    onClick={() => history.push(`/app/medicines/${medicine.id}`)}
                    style={{ margin: 0 }}
                  >
                    {medicine.image_url && (
                      <img 
                        src={medicine.image_url} 
                        alt={medicine.name}
                        style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                      />
                    )}
                    <IonCardContent style={{ padding: '12px' }}>
                      <h3 style={{ 
                        fontSize: '15px', 
                        fontWeight: 'bold', 
                        margin: '0 0 6px',
                        lineHeight: '1.3',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {medicine.name}
                      </h3>
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#666', 
                        margin: '0 0 8px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {medicine.genericName || medicine.description}
                      </p>
                      {medicine.pharmacyCount && medicine.pharmacyCount > 0 && (
                        <p style={{ fontSize: '13px', color: '#008C8C', fontWeight: '500', margin: 0 }}>
                          Available at {medicine.pharmacyCount} {medicine.pharmacyCount === 1 ? 'pharmacy' : 'pharmacies'}
                        </p>
                      )}
                      {medicine.minPrice && (
                        <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>
                          From {formatPrice(medicine.minPrice)}
                        </p>
                      )}
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}

        {!loading && filteredMedicines.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px' }}>
            <p style={{ color: '#666' }}>No medicines found</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Medicines;

