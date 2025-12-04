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
  IonIcon,
  IonLoading,
  useIonToast,
} from '@ionic/react';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      <IonContent style={{ '--background': '#f8fafa', '--padding-top': 'env(safe-area-inset-top)', '--padding-bottom': 'env(safe-area-inset-bottom)' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto', padding: '20px', paddingTop: 'max(60px, calc(env(safe-area-inset-top) + 40px))' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img 
              src="/assets/pk-secondary-brand-logo-colored.svg" 
              alt="PharmaKart Logo" 
              style={{ width: '220px', height: 'auto', margin: '0 auto 24px' }}
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
                <div style={{ position: 'relative' }}>
                  <IonInput
                    type={showPassword ? 'text' : 'password'}
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
                      '--padding-end': '42px'
                    }}
                  />
                  <IonButton
                    fill="clear"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0',
                      top: '0',
                      height: '100%',
                      margin: 0,
                      '--padding-start': '8px',
                      '--padding-end': '8px'
                    }}
                  >
                    <IonIcon 
                      slot="icon-only" 
                      icon={showPassword ? eyeOffOutline : eyeOutline} 
                      style={{ color: '#666' }}
                    />
                  </IonButton>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '20px' }}>
                <IonLabel style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                  Confirm Password
                </IonLabel>
                <div style={{ position: 'relative' }}>
                  <IonInput
                    type={showConfirmPassword ? 'text' : 'password'}
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
                      '--padding-end': '42px'
                    }}
                  />
                  <IonButton
                    fill="clear"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '0',
                      top: '0',
                      height: '100%',
                      margin: 0,
                      '--padding-start': '8px',
                      '--padding-end': '8px'
                    }}
                  >
                    <IonIcon 
                      slot="icon-only" 
                      icon={showConfirmPassword ? eyeOffOutline : eyeOutline} 
                      style={{ color: '#666' }}
                    />
                  </IonButton>
                </div>
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

