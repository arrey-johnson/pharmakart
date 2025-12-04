import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerTabs from './components/CustomerTabs';
import PharmacyTabs from './components/PharmacyTabs';
import RiderTabs from './components/RiderTabs';
import AdminTabs from './components/AdminTabs';
import authService from './services/auth.service';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const user = authService.getCurrentUser();
      setIsAuthenticated(authenticated);
      setUserRole(user?.role || null);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Auth Routes - No tabs */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          
          {/* Customer App with Bottom Tabs */}
          <Route path="/app">
            {isAuthenticated && userRole === 'CLIENT' ? (
              <CustomerTabs />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          
          {/* Pharmacy App with Bottom Tabs */}
          <Route path="/pharmacy">
            {isAuthenticated && userRole === 'PHARMACY' ? (
              <PharmacyTabs />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          
          {/* Rider App with Bottom Tabs */}
          <Route path="/rider">
            {isAuthenticated && userRole === 'RIDER' ? (
              <RiderTabs />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          
          {/* Admin App with Bottom Tabs */}
          <Route path="/admin">
            {isAuthenticated && userRole === 'ADMIN' ? (
              <AdminTabs />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          
          {/* Legacy route redirects for backward compatibility */}
          <Route exact path="/home">
            <Redirect to="/app/home" />
          </Route>
          <Route exact path="/medicines">
            <Redirect to="/app/medicines" />
          </Route>
          <Route exact path="/cart">
            <Redirect to="/app/cart" />
          </Route>
          <Route exact path="/orders">
            <Redirect to="/app/orders" />
          </Route>
          <Route exact path="/pharmacy-dashboard">
            <Redirect to="/pharmacy/dashboard" />
          </Route>
          <Route exact path="/rider-dashboard">
            <Redirect to="/rider/dashboard" />
          </Route>
          <Route exact path="/admin-dashboard">
            <Redirect to="/admin/dashboard" />
          </Route>
          
          {/* Default Route - Role-based redirect */}
          <Route exact path="/">
            {!isAuthenticated ? (
              <Redirect to="/login" />
            ) : userRole === 'CLIENT' ? (
              <Redirect to="/app/home" />
            ) : userRole === 'PHARMACY' ? (
              <Redirect to="/pharmacy/dashboard" />
            ) : userRole === 'RIDER' ? (
              <Redirect to="/rider/dashboard" />
            ) : userRole === 'ADMIN' ? (
              <Redirect to="/admin/dashboard" />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
