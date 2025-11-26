/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable<Subject = any> {
		/**
		 * Custom command to drag an element to a target
		 * @example cy.get('selector').drag('targetSelector')
		 */
		drag(target: string | JQuery<HTMLElement>): Chainable<any>;
	}
}
