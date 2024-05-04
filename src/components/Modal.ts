import { Component } from './base/Components';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

// Определение интерфейса для содержимого модального окна
interface IModalContent {
	content: HTMLElement; // Содержимое модального окна
}

export class Modal extends Component<IModalContent> {
	protected _content: HTMLElement; // Элемент для отображения содержимого модального окна
	protected _closeButton: HTMLButtonElement; // Кнопка закрытия модального окна

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		// Инициализация элементов модального окна
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		// Обработчики событий для закрытия модального окна
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	// Установка содержимого модального окна
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	// Метод для открытия модального окна
	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	// Метод для закрытия модального окна
	close() {
		this.container.classList.remove('modal_active');
		this.content = null; // Очищаем содержимое модального окна
		this.events.emit('modal:close');
		this.events.emit('form:reset');
		this.events.emit('order:clear');
	}

	// Метод для рендеринга модального окна с указанным содержимым
	render(data: IModalContent): HTMLElement {
		super.render(data);
		this.open(); // Открываем модальное окно при рендеринге
		return this.container;
	}
}
