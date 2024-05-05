import { Component } from './base/Components'; // Импорт базового класса компонента
import { IEvents } from './base/events'; // Импорт интерфейса событий
import { ensureElement } from '../utils/utils'; // Импорт вспомогательной функции
import { IAddressForm, IContactsForm } from '../types/index'; // Импорт интерфейсов формы адреса и формы контактов

// Интерфейс для состояния формы
interface IFormCondition {
	valid: boolean; // Флаг валидности
	errors: string[]; // Массив ошибок
}

// Абстрактный класс формы
export abstract class Form<T> extends Component<IFormCondition> {
	protected _submit: HTMLButtonElement; // Кнопка отправки формы
	protected _errors: HTMLElement; // Элемент для отображения ошибок

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		// Инициализация элементов формы
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		// Обработчик изменения значений полей формы
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		// Обработчик отправки формы
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	// Метод для обработки изменения значений полей формы
	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	// Установка состояния валидности формы
	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	// Установка сообщения об ошибке
	set errors(value: string) {
		this.setText(this._errors, value);
	}

	// Метод для рендеринга формы
	render(state: Partial<T> & IFormCondition) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

// Класс формы для адреса
export class AddressForm extends Form<IAddressForm> {
	protected _buttonPayments: HTMLButtonElement[]; // Кнопки выбора оплаты
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttonPayments = Array.from(
			container.querySelectorAll('.button_alt')
		);

		// Обработчики для кнопок выбора оплаты
		this._buttonPayments.forEach((button) => {
			button.addEventListener('click', (e: Event) => {
				this._buttonPayments.forEach((button) => {
					if (button === e.target) return;
					button.classList.remove('button_alt-active');
				});
				events.emit('buttonPayments:select', {
					button: e.target as HTMLButtonElement,
				});
			});
		});
	}

	// Установка значения адреса
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

// Класс формы для контактов
export class ContactsForm extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	// Установка значения email
	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	// Установка значения телефона
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
