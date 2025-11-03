import { ReactNode } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '../../services/hooks';

interface AuthRouteProps {
	children: ReactNode;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
	const { isAuthenticated } = useAppSelector((state) => state.auth);
	const location = useLocation();

	if (isAuthenticated) {
		const from = location.state?.from?.pathname || '/';
		return <Navigate to={from} replace />;
	}

	return <>{children}</>;
};

export default AuthRoute;
