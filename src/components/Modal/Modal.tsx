import React from 'react';
import ReactDOM from 'react-dom';
import ModalOverlay from '../ModalOverlay/ModalOverlay';

import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './styles.module.css';

interface ModalProps {
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, title }) => {
	const modalRoot = document.getElementById('modal-root');
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
