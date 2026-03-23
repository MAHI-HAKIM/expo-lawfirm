// For signup
export interface SignUpFormData {
    full_name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    barNumber: string;
    firmName: string;
    isAttorney: boolean;
  }
  
  // For signin
  export interface SignInFormData {
    email: string;
    password: string;
  }
  