import React from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { LoginForm, LoginFormProps } from './LoginForm';

export interface LoginProps extends LoginFormProps {
  onBack?: () => void;
  showBack?: boolean;
  onNavigateToRegister?: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onSuccess,
  onNavigateToRegister,
  onBack,
  showBack = false,
}) => {
  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Sign in to continue to SmartCart."
      showBack={showBack}
      onBack={onBack}
      showFeatures={true}
    >
      <LoginForm
        onSuccess={onSuccess}
        onSwitchToRegister={onNavigateToRegister}
      />
    </AuthLayout>
  );
};

export default Login;
