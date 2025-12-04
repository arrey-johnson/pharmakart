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
  bicycleOutline,
  cashOutline,
  personOutline 
} from 'ionicons/icons';
import RiderDashboard from '../pages/RiderDashboard';

const RiderTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/rider/dashboard" component={RiderDashboard} />
        <Route exact path="/rider">
          <Redirect to="/rider/dashboard" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" style={{ '--background': 'white' }}>
        <IonTabButton tab="dashboard" href="/rider/dashboard">
          <IonIcon icon={gridOutline} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>

        <IonTabButton tab="deliveries" href="/rider/deliveries">
          <IonIcon icon={bicycleOutline} />
          <IonLabel>Deliveries</IonLabel>
        </IonTabButton>

        <IonTabButton tab="earnings" href="/rider/earnings">
          <IonIcon icon={cashOutline} />
          <IonLabel>Earnings</IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href="/rider/profile">
          <IonIcon icon={personOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default RiderTabs;

