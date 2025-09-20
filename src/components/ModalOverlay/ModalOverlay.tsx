import React from 'react';
import styles from './styles.module.css';

interface ModalOverlayProps {
	onClick?: () => void;
	children?: React.ReactNode;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClick, children }) => {
	return (
		<div className={styles.modalOverlay} onClick={onClick}>
			<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>
	);
};

export default ModalOverlay;
