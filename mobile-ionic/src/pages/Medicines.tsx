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
import { cartOutline, addOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import medicineService, { Medicine } from '../services/medicine.service';
import cartService from '../services/cart.service';

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

  const handleAddToCart = async (medicine: Medicine) => {
    try {
      await cartService.addToCart(medicine.id, 1);
      present({
        message: `${medicine.name} added to cart`,
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
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Browse Medicines</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/cart">
              <IonIcon slot="icon-only" icon={cartOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
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
                <IonCol size="12" sizeMd="6" sizeLg="4" key={medicine.id}>
                  <IonCard>
                    {medicine.image_url && (
                      <img 
                        src={medicine.image_url} 
                        alt={medicine.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <IonCardHeader>
                      <IonCardTitle>{medicine.name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                        {medicine.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#008C8C' }}>
                          ${medicine.price}
                        </span>
                        <IonButton
                          size="small"
                          onClick={() => handleAddToCart(medicine)}
                          disabled={medicine.quantity === 0}
                        >
                          <IonIcon slot="start" icon={addOutline} />
                          Add to Cart
                        </IonButton>
                      </div>
                      {medicine.quantity === 0 && (
                        <p style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>
                          Out of stock
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

