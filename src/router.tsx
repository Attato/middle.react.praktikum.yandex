import { createBrowserRouter } from 'react-router-dom';

import Constructor from './pages/Constructor/Constructor';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Profile from './pages/Profile/Profile';
import IngredientDetailsPage from './pages/IngredientDetailsPage/IngredientDetailsPage';
import NotFound from './pages/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AuthRoute from './components/AuthRoute/AuthRoute';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Constructor />,
	},
	{
		path: '/login',
		element: (
			<AuthRoute>
				<Login />
			</AuthRoute>
		),
	},
	{
		path: '/register',
		element: (
			<AuthRoute>
				<Register />
			</AuthRoute>
		),
	},
	{
		path: '/forgot-password',
		element: (
			<AuthRoute>
				<ForgotPassword />
			</AuthRoute>
		),
	},
	{
		path: '/reset-password',
		element: (
			<AuthRoute>
				<ResetPassword />
			</AuthRoute>
		),
	},
	{
		path: '/profile',
		element: (
			<ProtectedRoute>
				<Profile />
			</ProtectedRoute>
		),
	},
	{
		path: '/ingredients/:id',
		element: <IngredientDetailsPage />,
	},
	{
		path: '*',
		element: <NotFound />,
	},
]);
