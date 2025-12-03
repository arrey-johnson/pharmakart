import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonLoading,
  useIonToast,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../services/auth.service';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CLIENT' as 'CLIENT' | 'PHARMACY' | 'RIDER',
  });
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();
  const history = useHistory();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      present({
        message: 'Passwords do not match',
        duration: 2000,
        color: 'danger',
      });
      return;
    }

    if (formData.password.length < 6) {
      present({
        message: 'Password must be at least 6 characters',
        duration: 2000,
        color: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      
      present({
        message: 'Registration successful! Please login.',
        duration: 3000,
        color: 'success',
      });

      history.push('/login');
    } catch (error: any) {
      present({
        message: error.response?.data?.message || 'Registration failed. Please try again.',
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
          <IonTitle>Register - PharmaKart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#f8fafa' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto', paddingTop: '40px', padding: '20px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img 
              src="/assets/pk-brand-icon-colored.svg" 
              alt="PharmaKart Logo" 
              style={{ width: '80px', height: '80px', margin: '0 auto 16px' }}
            />
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#222428' }}>
              Create an account
            </h1>
            <p style={{ color: '#666666', fontSize: '15px' }}>
              Join PharmaKart today
            </p>
          </div>

          {/* Form Card */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <form onSubmit={handleRegister}>
              {/* Name */}
              <div style={{ marginBottom: '20px' }}>
                <IonLabel style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                  Full Name
                </IonLabel>
                <IonInput
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onIonChange={(e) => setFormData({ ...formData, name: e.detail.value! })}
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

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <IonLabel style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                  Email address
                </IonLabel>
                <IonInput
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onIonChange={(e) => setFormData({ ...formData, email: e.detail.value! })}
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

              {/* Role */}
              <div style={{ marginBottom: '20px' }}>
                <IonLabel style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                  I am a
                </IonLabel>
                <IonSelect
                  value={formData.role}
                  onIonChange={(e) => setFormData({ ...formData, role: e.detail.value })}
                  interface="popover"
                  style={{ 
                    '--background': '#ffffff',
                    '--border-color': '#e5e7eb',
                    '--border-width': '1px',
                    '--border-radius': '8px',
                    '--padding-start': '12px',
                    '--padding-end': '12px'
                  }}
                >
                  <IonSelectOption value="CLIENT">Customer</IonSelectOption>
                  <IonSelectOption value="PHARMACY">Pharmacy</IonSelectOption>
                  <IonSelectOption value="RIDER">Delivery Rider</IonSelectOption>
                </IonSelect>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '20px' }}>
                <IonLabel style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                  Password
                </IonLabel>
                <IonInput
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onIonChange={(e) => setFormData({ ...formData, password: e.detail.value! })}
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

              {/* Confirm Password */}
              <div style={{ marginBottom: '20px' }}>
                <IonLabel style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                  Confirm Password
                </IonLabel>
                <IonInput
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onIonChange={(e) => setFormData({ ...formData, confirmPassword: e.detail.value! })}
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
                {loading ? 'Creating account...' : 'Create Account'}
              </IonButton>
            </form>

            {/* Login Link */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: '#008C8C', textDecoration: 'none', fontWeight: '500' }}>
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>

        <IonLoading isOpen={loading} message="Creating account..." />
      </IonContent>
    </IonPage>
  );
};

export default Register;

