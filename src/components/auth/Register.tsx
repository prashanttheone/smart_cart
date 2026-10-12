import React from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { RegisterForm, RegisterFormProps } from './RegisterForm';

export interface RegisterProps extends RegisterFormProps {
  onBack?: () => void;
  showBack?: boolean;
  onNavigateToLogin?: () => void;
}

export const Register: React.FC<RegisterProps> = ({
  onSuccess,
  onNavigateToLogin,
  onBack,
  showBack = false,
}) => {
  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up to start shopping on SmartCart."
      showBack={showBack}
      onBack={onBack}
      showFeatures={true}
    >
      <RegisterForm
        onSuccess={onSuccess}
        onSwitchToLogin={onNavigateToLogin}
      />
    </AuthLayout>
  );
};

export default Register;
