import { ApiListResponse } from '../types/index';
import { Api } from './base/api';
import { IProductItem } from '../types/index';
import { IOrder, IOrderSuccess } from '../types';

// Интерфейс для API онлайн-магазина
export interface IOnlineStoreAPI {
	// Метод для получения списка продуктов
	getCardList: () => Promise<IProductItem[]>;
	// Метод для получения информации о продукте по его ID
	getCardItem: (id: string) => Promise<IProductItem>;
	// Метод для оформления заказа
	orderProduct: (order: IOrder) => Promise<IOrderSuccess>;
}

// Класс реализации API онлайн-магазина
export class OnlineStoreAPI extends Api implements IOnlineStoreAPI {
	readonly cdn: string; // URL

	// Конструктор класса
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// Метод для получения информации о продукте по его ID
	getCardItem(id: string): Promise<IProductItem> {
		return this.get(`/product/${id}`).then((item: IProductItem) => ({
			...item,
			image: this.cdn + item.image, // Добавление URL CDN к пути изображения
		}));
	}

	// Метод для получения списка продуктов
	getCardList(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image, // Добавление URL к пути изображения
			}))
		);
	}

	// Метод для оформления заказа
	orderProduct(order: IOrder): Promise<IOrderSuccess> {
		return this.post('/order', order).then((data: IOrderSuccess) => data);
	}
}
