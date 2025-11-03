import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './services/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App/App';
import './global.css';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<StrictMode>
		<Provider store={store}>
			<DndProvider backend={HTML5Backend}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</DndProvider>
		</Provider>
	</StrictMode>
);
