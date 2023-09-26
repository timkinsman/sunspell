import { AuthContext, useAuthProps } from '@/providers/auth';
import React from 'react';

export const useAuth = () => React.useContext<useAuthProps>(AuthContext);
