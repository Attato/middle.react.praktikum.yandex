import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { useAppDispatch } from '../../services/hooks';

import { fetchIngredients } from '../../services/slices/ingredientsSlice';

import AppHeader from '../AppHeader/AppHeader';
import Modal from '../Modal/Modal';
import IngredientDetails from '../IngredientDetails/IngredientDetails';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import AuthRoute from '../AuthRoute/AuthRoute';

import Constructor from '../../pages/Constructor/Constructor';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import ForgotPassword from '../../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Profile from '../../pages/Profile/Profile';
import ProfileOrders from '../../pages/ProfileOrders/ProfileOrders';
import IngredientDetailsPage from '../../pages/IngredientDetailsPage/IngredientDetailsPage';
import Feed from '../../pages/Feed/Feed';
import OrderPage from '../../pages/OrderPage/OrderPage';
import NotFound from '../../pages/NotFound/NotFound';

const App = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();

	const background = location.state?.background;

	useEffect(() => {
		dispatch(fetchIngredients());
	}, [dispatch]);

	return (
		<div className="container">
			<AppHeader />

			<Routes location={background || location}>
				<Route path="/" element={<Constructor />} />

				<Route
					path="/login"
					element={
						<AuthRoute>
							<Login />
						</AuthRoute>
					}
				/>

				<Route
					path="/register"
					element={
						<AuthRoute>
							<Register />
						</AuthRoute>
					}
				/>

				<Route
					path="/forgot-password"
					element={
						<AuthRoute>
							<ForgotPassword />
						</AuthRoute>
					}
				/>

				<Route
					path="/reset-password"
					element={
						<AuthRoute>
							<ResetPassword />
						</AuthRoute>
					}
				/>

				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				>
					<Route index element={<div />} />
					<Route path="orders" element={<ProfileOrders />} />
				</Route>

				<Route
					path="/profile/orders/:id"
					element={
						<ProtectedRoute>
							<OrderPage />
						</ProtectedRoute>
					}
				/>

				<Route path="/feed" element={<Feed />} />
				<Route path="/feed/:id" element={<OrderPage />} />
				<Route path="/ingredients/:id" element={<IngredientDetailsPage />} />

				<Route path="*" element={<NotFound />} />
			</Routes>

			{background && (
				<Routes>
					<Route
						path="/ingredients/:id"
						element={
							<Modal
								onClose={() => window.history.back()}
								title="Детали ингредиента"
							>
								<IngredientDetails />
							</Modal>
						}
					/>

					<Route
						path="/feed/:id"
						element={
							<Modal onClose={() => window.history.back()}>
								<OrderPage />
							</Modal>
						}
					/>

					<Route
						path="/profile/orders/:id"
						element={
							<Modal onClose={() => window.history.back()}>
								<OrderPage />
							</Modal>
						}
					/>
				</Routes>
			)}
		</div>
	);
};

export default App;
