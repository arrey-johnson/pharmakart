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
  gridOutline,
  cubeOutline,
  receiptOutline,
  personOutline 
} from 'ionicons/icons';
import PharmacyDashboard from '../pages/PharmacyDashboard';

const PharmacyTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/pharmacy/dashboard" component={PharmacyDashboard} />
        <Route exact path="/pharmacy">
          <Redirect to="/pharmacy/dashboard" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" style={{ '--background': 'white' }}>
        <IonTabButton tab="dashboard" href="/pharmacy/dashboard">
          <IonIcon icon={gridOutline} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>

        <IonTabButton tab="inventory" href="/pharmacy/inventory">
          <IonIcon icon={cubeOutline} />
          <IonLabel>Inventory</IonLabel>
        </IonTabButton>

        <IonTabButton tab="orders" href="/pharmacy/orders">
          <IonIcon icon={receiptOutline} />
          <IonLabel>Orders</IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href="/pharmacy/profile">
          <IonIcon icon={personOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default PharmacyTabs;

