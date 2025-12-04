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
  peopleOutline,
  storefrontOutline,
  settingsOutline 
} from 'ionicons/icons';
import AdminDashboard from '../pages/AdminDashboard';

const AdminTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/admin/dashboard" component={AdminDashboard} />
        <Route exact path="/admin">
          <Redirect to="/admin/dashboard" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" style={{ '--background': 'white' }}>
        <IonTabButton tab="dashboard" href="/admin/dashboard">
          <IonIcon icon={gridOutline} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>

        <IonTabButton tab="users" href="/admin/users">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Users</IonLabel>
        </IonTabButton>

        <IonTabButton tab="pharmacies" href="/admin/pharmacies">
          <IonIcon icon={storefrontOutline} />
          <IonLabel>Pharmacies</IonLabel>
        </IonTabButton>

        <IonTabButton tab="settings" href="/admin/settings">
          <IonIcon icon={settingsOutline} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AdminTabs;

