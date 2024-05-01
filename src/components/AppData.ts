import _ from 'lodash'; // Импорт lodash для использования вспомогательных функций
import { Model } from './base/Model'; // Импорт базового класса Model для создания модели AppState
import {
	IAppState, // Импорт интерфейса для состояния приложения
	IProductItem, // Импорт интерфейса для элемента продукта
	IOrder, // Импорт интерфейса для заказа
	IAddressForm, // Импорт интерфейса для формы заказа
	IContactsForm, // Импорт интерфейса для формы контактов
	FormErrors, // Импорт типа для ошибок формы
} from '../types/index'; // Импорт пользовательских типов данных

export class AppState extends Model<IAppState> {
	// Класс AppState, наследующийся от Model<IAppState>
	catalog: IProductItem[]; // Список продуктов в каталоге
	order: IOrder = {
		// Информация о заказе
		payment: '', // Способ оплаты
		address: '', // Адрес доставки
		email: '', // Email
		phonenumber: '', // Номер телефона
		total: 0, // Общая сумма заказа
		items: [], // Выбранные продукты
	};
	formErrors: FormErrors = {}; // Ошибки формы

	toggleOrderedItem(id: string, isIncluded: boolean): void {
		// Добавление/удаление элемента из заказа
		if (isIncluded) {
			this.order.items = _.uniq([...this.order.items, id]);
		} else {
			this.order.items = _.without(this.order.items, id);
		}
	}

	isIncludedCard(cardId: string): boolean {
		// Проверка, включен ли продукт в заказ
		return this.order.items.some((itemId) => itemId === cardId);
	}

	getTotal(): number {
		// Вычисление общей суммы заказа
		return this.order.items.reduce(
			(total, itemId) =>
				total + this.catalog.find((item) => item.id === itemId).price,
			0
		);
	}

	setCatalog(items: IProductItem[]): void {
		// Установка списка продуктов
		this.catalog = items;
		this.emitChanges('cards:changed', { catalog: this.catalog });
	}

	getAddProductInBasket(): IProductItem[] {
		// Получение списка продуктов, добавленных в корзину
		return this.catalog.filter((item) => this.order.items.includes(item.id));
	}

	setOrderField(field: keyof IAddressForm, value: string): void {
		// Установка значений полей заказа
		this.order[field] = value;
		if (this.validateOrderForm()) {
			// Проверка валидности формы заказа
		}
	}

	validateOrderForm(): boolean {
		// Валидация формы заказа
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Укажите способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}
		this.formErrors = errors;
		this.events.emit('orderformErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setContactsField(field: keyof IContactsForm, value: string): void {
		// Установка значений полей контактов
		this.order[field] = value;
		if (this.validateContactsForm()) {
			// Проверка валидности формы контактов
		}
	}

	validateContactsForm(): boolean {
		// Валидация формы контактов
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phonenumber) {
			errors.phonenumber = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	getCountItems(): number {
		// Получение количества элементов в заказе
		return this.order.items.length;
	}

	clearBasket() {
		// Очистка корзины
		this.order.items.forEach((id) => {
			this.toggleOrderedItem(id, false);
		});
	}
}
