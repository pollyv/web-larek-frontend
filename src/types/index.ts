// Интерфейс, описывающий структуру объекта продукта
export interface IProductItem {
	id: string; // Уникальный идентификатор продукта
	description: string; // Описание продукта
	image: string; // URL изображения продукта
	title: string; // Название продукта
	category: TCategoryProduct; // Категория продукта
	price: number | null; // Цена продукта или null, если цена не указана
}

// Тип данных для категории продукта
export type TCategoryProduct =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// Интерфейс, описывающий форму адреса
export interface IAddressForm {
	payment: string; // Способ оплаты
	address: string; // Адрес доставки
}

// Интерфейс, описывающий форму контактов
export interface IContactsForm {
	email: string; // Email
	phone: string; // Телефон
}

// Интерфейс описывающий заказ
export interface IOrder extends IAddressForm, IContactsForm {
	items: string[]; // Массив идентификаторов продуктов в заказе
	total: number; // Общая сумма заказа
}

// Тип данных для ошибок формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс, описывающий состояние приложения
export interface IAppState {
	catalog: IProductItem[]; // Список продуктов
	order: IOrder; // Текущий заказ
	formErrors: FormErrors; // Ошибки формы
}

// Интерфейс, описывающий успешный заказ
export interface IOrderSuccess {
	id: string; // Уникальный идентификатор заказа
	total: number; // Общая сумма заказа
}

// Тип данных для сообщения об успешном заказе
export type TSuccess = Pick<IOrderSuccess, 'total'>;

// Тип данных для ответа API с списком объектов
export type ApiListResponse<Type> = {
	total: number; // Общее количество элементов в списке
	items: Type[]; // Массив элементов
};
