export const scrollToSection = (
	id: string,
	setCurrent: (id: string) => void
) => {
	const element = document.getElementById(id);

	if (element) {
		element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		setCurrent(id);
	}
};

export const getClosestSection = (
	container: HTMLElement,
	sectionIds: string[]
): string => {
	let closest = sectionIds[0];
	let minDistance = Infinity;

	sectionIds.forEach((id) => {
		const el = document.getElementById(id);

		if (el) {
			const distance = Math.abs(
				el.getBoundingClientRect().top - container.getBoundingClientRect().top
			);

			if (distance < minDistance) {
				minDistance = distance;
				closest = id;
			}
		}
	});

	return closest;
};
