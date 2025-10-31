import AppHeader from '../AppHeader/AppHeader';

interface AppLayoutProps {
	children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
	return (
		<main className="container">
			<AppHeader />

			{children}
		</main>
	);
};

export default AppLayout;
