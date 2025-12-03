import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonLoading,
  useIonToast,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../services/auth.service';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      present({
        message: 'Please enter email and password',
        duration: 2000,
        color: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(email, password);
      
      present({
        message: 'Login successful!',
        duration: 2000,
        color: 'success',
      });

      // Navigate based on user role
      const role = response.user.role;
      switch (role) {
        case 'CLIENT':
          history.push('/home');
          break;
        case 'PHARMACY':
          history.push('/pharmacy-dashboard');
          break;
        case 'RIDER':
          history.push('/rider-dashboard');
          break;
        case 'ADMIN':
          history.push('/admin-dashboard');
          break;
        default:
          history.push('/home');
      }
    } catch (error: any) {
      present({
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
        duration: 3000,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>PharmaKart - Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ '--background': '#f8fafa' }}>
        <div className="login-container" style={{ maxWidth: '440px', margin: '0 auto', paddingTop: '40px' }}>
          {/* Header - Matching Web App */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img 
              src="/assets/pk-brand-icon-colored.svg" 
              alt="PharmaKart Logo" 
              style={{ width: '80px', height: '80px', margin: '0 auto 16px' }}
            />
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#222428' }}>
              Welcome back
            </h1>
            <p style={{ color: '#666666', fontSize: '15px' }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Form Card - Matching Web App */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '20px' }}>
                <IonLabel style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                  Email address
                </IonLabel>
                <IonInput
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                  required
                  disabled={loading}
                  style={{ 
                    '--background': '#ffffff',
                    '--border-color': '#e5e7eb',
                    '--border-width': '1px',
                    '--border-radius': '8px',
                    '--padding-start': '12px',
                    '--padding-end': '12px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <IonLabel style={{ fontSize: '14px', fontWeight: '500' }}>
                    Password
                  </IonLabel>
                  <a href="/forgot-password" style={{ fontSize: '14px', color: '#008C8C', textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                </div>
                <IonInput
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                  required
                  disabled={loading}
                  style={{ 
                    '--background': '#ffffff',
                    '--border-color': '#e5e7eb',
                    '--border-width': '1px',
                    '--border-radius': '8px',
                    '--padding-start': '12px',
                    '--padding-end': '12px'
                  }}
                />
              </div>

              <IonButton 
                expand="block" 
                type="submit" 
                disabled={loading}
                style={{ 
                  '--background': '#008C8C',
                  '--background-hover': '#007b7b',
                  '--border-radius': '8px',
                  height: '44px',
                  fontSize: '16px',
                  fontWeight: '500',
                  marginTop: '8px'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </IonButton>
            </form>

            {/* Divider - Matching Web App */}
            <div style={{ position: 'relative', margin: '24px 0', textAlign: 'center' }}>
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: 0, 
                right: 0, 
                height: '1px', 
                background: '#e5e7eb' 
              }} />
              <span style={{ 
                position: 'relative', 
                background: 'white', 
                padding: '0 8px', 
                fontSize: '12px', 
                color: '#666666',
                textTransform: 'uppercase'
              }}>
                New to PharmaKart?
              </span>
            </div>

            {/* Register Button - Matching Web App */}
            <IonButton 
              expand="block"
              fill="outline"
              routerLink="/register"
              style={{ 
                '--border-color': '#e5e7eb',
                '--border-radius': '8px',
                '--color': '#222428',
                height: '44px',
                fontSize: '16px'
              }}
            >
              Create an account
            </IonButton>
          </div>

          {/* Trust Badges - Matching Web App */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '24px', 
            fontSize: '12px', 
            color: '#666666',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🔒</span>
              <span>Secure login</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🔐</span>
              <span>256-bit encryption</span>
            </div>
          </div>
        </div>

        <IonLoading isOpen={loading} message="Signing in..." />
      </IonContent>
    </IonPage>
  );
};

export default Login;

