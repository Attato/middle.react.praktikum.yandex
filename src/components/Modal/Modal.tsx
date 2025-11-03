import { useEffect, FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import ModalOverlay from '../ModalOverlay/ModalOverlay';

import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './styles.module.css';

interface ModalProps {
	onClose: () => void;
	children: ReactNode;
	title?: string;
}

const Modal: FC<ModalProps> = ({ onClose, children, title }) => {
	const modalRoot = document.getElementById('modal-root');

	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleEsc);
		return () => {
			document.removeEventListener('keydown', handleEsc);
		};
	}, [onClose]);

	if (!modalRoot) return null;

	return ReactDOM.createPortal(
		<ModalOverlay onClick={onClose}>
			<div
				className={styles.modalCloseWrapper}
				style={{
					justifyContent: title ? 'space-between' : 'flex-end',
				}}
			>
				{title && <p className="text text_type_main-large">{title}</p>}

				<button className={styles.closeButton} onClick={onClose}>
					<CloseIcon type="primary" />
				</button>
			</div>
			{children}
		</ModalOverlay>,

		modalRoot
	);
};

export default Modal;
