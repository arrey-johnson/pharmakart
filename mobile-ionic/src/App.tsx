import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Medicines from './pages/Medicines';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import PharmacyDashboard from './pages/PharmacyDashboard';
import RiderDashboard from './pages/RiderDashboard';
import AdminDashboard from './pages/AdminDashboard';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
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
          {/* Auth Routes */}
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          
          {/* Customer Routes */}
          <Route exact path="/home">
            {isAuthenticated ? <Home /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/medicines">
            {isAuthenticated ? <Medicines /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/cart">
            {isAuthenticated ? <Cart /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/orders">
            {isAuthenticated ? <Orders /> : <Redirect to="/login" />}
          </Route>
          
          {/* Pharmacy Routes */}
          <Route exact path="/pharmacy-dashboard">
            {isAuthenticated ? <PharmacyDashboard /> : <Redirect to="/login" />}
          </Route>
          
          {/* Rider Routes */}
          <Route exact path="/rider-dashboard">
            {isAuthenticated ? <RiderDashboard /> : <Redirect to="/login" />}
          </Route>
          
          {/* Admin Routes */}
          <Route exact path="/admin-dashboard">
            {isAuthenticated ? <AdminDashboard /> : <Redirect to="/login" />}
          </Route>
          
          {/* Default Route */}
          <Route exact path="/">
            <Redirect to={isAuthenticated ? "/home" : "/login"} />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
