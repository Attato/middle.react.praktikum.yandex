import React, { useRef } from 'react';
import {
	ConstructorElement,
	DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import type { BurgerFilling } from '../../services/slices/burgerSlice';

import styles from './styles.module.css';

interface FillingItemProps {
	item: BurgerFilling;
	index: number;
	moveItem: (fromIndex: number, toIndex: number) => void;
	onRemove: (key: string) => void;
	onClick: () => void;
}

interface DragItem {
	index: number;
}

const FillingItem: React.FC<FillingItemProps> = ({
	item,
	index,
	moveItem,
	onRemove,
	onClick,
}) => {
	const ref = useRef<HTMLDivElement>(null);

	const [, drop] = useDrop<DragItem>({
		accept: 'filling',
		hover(draggedItem: DragItem, monitor: DropTargetMonitor) {
			if (!ref.current) return;
			const dragIndex = draggedItem.index;
			const hoverIndex = index;
			if (dragIndex === hoverIndex) return;

			const hoverBoundingRect = ref.current.getBoundingClientRect();
			const hoverMiddleY =
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
			const clientOffset = monitor.getClientOffset();
			if (!clientOffset) return;
			const hoverClientY = clientOffset.y - hoverBoundingRect.top;

			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

			moveItem(dragIndex, hoverIndex);
			draggedItem.index = hoverIndex;
		},
	});

	drop(ref);

	const [, drag] = useDrag({
		type: 'filling',
		item: { index },
	});

	return (
		<div ref={ref} className={styles.fillingItem}>
			<div
				ref={(node) => {
					drag(node);
					drop(node);
				}}
			>
				<DragIcon type="primary" />
			</div>

			<div onClick={onClick} className={`${styles.clickableWrapper} ml-2`}>
				<ConstructorElement
					text={item.name}
					price={item.price}
					thumbnail={item.image}
					handleClose={(e?: React.MouseEvent) => {
						e?.stopPropagation();
						onRemove(item.uniqueKey);
					}}
					extraClass={styles.noSelect}
				/>
			</div>
		</div>
	);
};

export default FillingItem;
