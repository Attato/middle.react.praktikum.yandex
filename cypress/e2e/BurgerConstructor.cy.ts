const testUrl = 'http://localhost:3000/';
const ingredientCard = 'div[class*="ingredientCard"]';
const constructorContainer = '.mt-25.pl-4.pr-4.pt-5';

describe('Burger Constructor', () => {
	beforeEach(() => {
		cy.visit(testUrl);
		cy.get('h2#buns').should('exist');
	});

	it('Должны отображаться ингредиенты и вкладки', () => {
		cy.contains('Соберите бургер').should('exist');
		cy.get('.tab').contains('Булки').should('exist');
		cy.get('.tab').contains('Соусы').should('exist');
		cy.get('.tab').contains('Начинки').should('exist');
		cy.get('h2#buns').should('exist');
		cy.get('h2#sauces').should('exist');
		cy.get('h2#mains').should('exist');
	});

	it('Ингредиенты должны перемещаться в конструктор', () => {
		cy.get('h2#buns').parent().find(ingredientCard).first().as('bunIngredient');
		cy.get(constructorContainer).as('constructor');

		cy.get('@bunIngredient').trigger('dragstart');
		cy.get('@constructor').trigger('drop');

		cy.get('.constructor-element').should('exist');
		cy.contains('верх').should('exist');
	});

	it('Цена должна правильно расчитываться', () => {
		let bunPrice = 0;
		let mainPrice = 0;

		cy.get('h2#buns')
			.parent()
			.find(ingredientCard)
			.first()
			.find('p[class*="text_type_digits-default"]')
			.invoke('text')
			.then((price) => {
				bunPrice = parseInt(price);

				cy.get('h2#mains')
					.parent()
					.find(ingredientCard)
					.first()
					.find('p[class*="text_type_digits-default"]')
					.invoke('text')
					.then((mainPriceText) => {
						mainPrice = parseInt(mainPriceText);
						const expectedTotal = bunPrice * 2 + mainPrice;

						cy.get('h2#buns')
							.parent()
							.find(ingredientCard)
							.first()
							.as('bunIngredient');
						cy.get('h2#mains')
							.parent()
							.find(ingredientCard)
							.first()
							.as('mainIngredient');
						cy.get(constructorContainer).as('constructor');

						cy.get('@bunIngredient').trigger('dragstart');
						cy.get('@constructor').trigger('drop');

						cy.get('@mainIngredient').trigger('dragstart');
						cy.get('@constructor').trigger('drop');

						cy.get('.text_type_digits-medium')
							.should('exist')
							.and('have.text', expectedTotal.toString());
					});
			});
	});

	it('Перенаправление на странциу логина, если пользователь не был аутентифицирован при оформлении заказа', () => {
		cy.get('h2#buns').parent().find(ingredientCard).first().as('bunIngredient');
		cy.get('h2#mains')
			.parent()
			.find(ingredientCard)
			.first()
			.as('mainIngredient');
		cy.get(constructorContainer).as('constructor');

		cy.get('@bunIngredient').trigger('dragstart');
		cy.get('@constructor').trigger('drop');

		cy.get('@mainIngredient').trigger('dragstart');
		cy.get('@constructor').trigger('drop');

		cy.contains('Оформить заказ').click();

		cy.url().should('include', '/login');
	});

	it('Должно открываться модальное окно при нажатии на ингредиент', () => {
		cy.get('h2#buns').parent().find(ingredientCard).first().click();

		cy.get('#modal-root').find('div[class*="modal"]').should('exist');
		cy.get('#modal-root').find('button').click();
	});
});
