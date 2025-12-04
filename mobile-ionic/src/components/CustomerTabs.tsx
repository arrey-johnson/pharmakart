import { 
  IonTabs, 
  IonTabBar, 
  IonTabButton, 
  IonIcon, 
  IonLabel,
  IonRouterOutlet 
} from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { 
  homeOutline, 
  medkitOutline, 
  cloudUploadOutline,  // Upload prescription icon
  receiptOutline,
  personOutline 
} from 'ionicons/icons';
import Home from '../pages/Home';
import Medicines from '../pages/Medicines';
import MedicineDetail from '../pages/MedicineDetail';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import Prescriptions from '../pages/Prescriptions';

const CustomerTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/home" component={Home} />
        <Route exact path="/app/medicines" component={Medicines} />
        <Route exact path="/app/medicines/:id" component={MedicineDetail} />
        <Route exact path="/app/cart" component={Cart} />
        <Route exact path="/app/prescriptions" component={Prescriptions} />
        <Route exact path="/app/orders" component={Orders} />
        <Route exact path="/app/profile" component={Profile} />
        <Route exact path="/app">
          <Redirect to="/app/home" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" style={{ '--background': 'white' }}>
        <IonTabButton tab="home" href="/app/home">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="medicines" href="/app/medicines">
          <IonIcon icon={medkitOutline} />
          <IonLabel>Browse</IonLabel>
        </IonTabButton>

        <IonTabButton tab="prescriptions" href="/app/prescriptions">
          <IonIcon icon={cloudUploadOutline} />
          <IonLabel>Upload Rx</IonLabel>
        </IonTabButton>

        <IonTabButton tab="orders" href="/app/orders">
          <IonIcon icon={receiptOutline} />
          <IonLabel>Orders</IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href="/app/profile">
          <IonIcon icon={personOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default CustomerTabs;

