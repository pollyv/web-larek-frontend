import { Component } from './base/Components';
import { createElement, ensureElement, formatNumber } from '../utils/utils';
import { EventEmitter } from './base/events';

// Интерфейс для содержимого корзины
interface IBasketContent {
	items: HTMLElement[]; // Элементы в корзине
	total: number; // Общая сумма
	selected: string[]; // Выбранные элементы
}

// Класс корзины
export class Basket extends Component<IBasketContent> {
	protected _list: HTMLElement; // Элемент списка в корзине
	protected _total: HTMLElement; // Элемент с общей суммой
	protected _button: HTMLButtonElement; // Кнопка заказа

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		// Находим элементы в DOM
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		// Если кнопка заказа существует, добавляем обработчик события на нажатие
		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open'); // Генерируем событие "order:open"
			});
		}

		// Изначально список пуст
		this.items = [];
	}

	// Установка элементов в корзине
	set items(items: HTMLElement[]) {
		if (items.length) {
			// Если есть элементы, заменяем текущие элементы в списке
			this._list.replaceChildren(...items);
		} else {
			// Если нет элементов, выводим сообщение о пустой корзине
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Нет товаров в корзине',
				})
			);
		}
	}

	// Установка выбранных элементов
	set selected(items: string[]) {
		if (items.length) {
			// Если выбраны элементы, активируем кнопку заказа
			this.setDisabled(this._button, false);
		} else {
			// Если не выбраны элементы, деактивируем кнопку заказа
			this.setDisabled(this._button, true);
		}
	}

	// Установка общей суммы
	set total(total: number) {
		this.setText(this._total, `${formatNumber(total)} синапсов`); // Устанавливаем текст с общей суммой
	}
}
