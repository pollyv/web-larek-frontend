// Импорт базового класса компонента
import { Component } from './base/Components';
// Импорт интерфейса продукта
import { IProductItem, TCategoryProduct } from '../types/index';
// Импорт вспомогательных функций
import { ensureElement, formatNumber } from '../utils/utils';

// Интерфейс для поведения карточки
interface ICardBehavior {
	onClick: (event: MouseEvent) => void; // Обработчик события клика
}

// Интерфейс для карточки
export interface ICard extends IProductItem {
	index: number; // Индекс
}

// Абстрактный класс карточки
export abstract class Card extends Component<ICard> {
	// Защищенные поля карточки
	protected _title: HTMLElement; // Заголовок
	protected _image?: HTMLImageElement; // Изображение
	protected _description?: HTMLElement; // Описание
	protected _category?: HTMLElement; // Категория
	protected _price: HTMLElement; // Цена
	protected _button?: HTMLButtonElement; // Кнопка

	constructor(protected container: HTMLElement, behavior?: ICardBehavior) {
		super(container);

		// Инициализация полей карточки
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);

		// Добавление обработчика события клика, если передано поведение карточки
		if (behavior?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', behavior.onClick);
			} else {
				container.addEventListener('click', behavior.onClick);
			}
		}
	}

	// Установка идентификатора карточки
	set id(value: string) {
		this.container.dataset.id = value;
	}

	// Установка заголовка карточки
	set title(value: string) {
		this.setText(this._title, value);
	}

	// Установка цены карточки
	set price(value: number) {
		if (value) {
			this.setText(this._price, `${formatNumber(value)} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
		}
	}

	// Установка текста кнопки карточки
	set buttonText(value: string) {
		this.setText(this._button, value);
	}

	// Установка состояния кнопки карточки
	set buttonStatus(value: number) {
		if (!value) {
			this.setDisabled(this._button, true);
		}
	}

	// Установка изображения карточки
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	// Установка описания карточки
	set description(value: string) {
		this.setText(this._description, value);
	}

	// Установка категории карточки
	set category(value: TCategoryProduct) {
		this.setText(this._category, value);
	}

	// Установка цвета категории карточки
	setColorCategory(
		value: TCategoryProduct,
		settings: Record<TCategoryProduct, string>
	): void {
		this.toggleClass(this._category, settings[value]);
	}
}

// Класс списка карточек
export class CardCatalog extends Card {
	constructor(container: HTMLElement, behavior?: ICardBehavior) {
		super(container, behavior);

		// Инициализация полей для списка
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
	}
}

// Класс карточки для корзины
export class CardForBasket extends Card {
	protected _itemIndex: HTMLElement; // Индекс товара

	constructor(container: HTMLElement, behavior?: ICardBehavior) {
		super(container, behavior);

		// Инициализация полей для карточки в корзине
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
		this._itemIndex = ensureElement<HTMLImageElement>(
			'.basket__item-index',
			container
		);
	}

	// Установка индекса товара
	set index(value: number) {
		this.setText(this._itemIndex, String(value));
	}
}

// Класс предварительного просмотра карточки
export class CardPreview extends Card {
	constructor(container: HTMLElement, behavior?: ICardBehavior) {
		super(container, behavior);

		// Инициализация полей для предварительного просмотра
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._description = ensureElement<HTMLElement>('.card__text', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);

		// Удаляем обработчик события клика на всю карточку
		this.container.removeEventListener('click', behavior?.onClick);

		// Добавляем обработчик события клика на кнопку "В корзину"
		this._button.addEventListener('click', (event) => {
			event.stopPropagation(); // Останавливаем всплытие события
			if (behavior && behavior.onClick) {
				behavior.onClick(event); // Вызываем обработчик
			}
		});
	}
}
