import './scss/styles.scss'; // Импорт стилей

import { OnlineStoreAPI } from './components/OnlineStore'; // Импорт API онлайн-магазина
import { API_URL, CDN_URL } from './utils/constants'; // Импорт констант API и CDN
import { settings } from './utils/constants';
import { EventEmitter } from './components/base/events'; // Импорт класса EventEmitter
import { AppState } from './components/AppData'; // Импорт состояния приложения
import { Page } from './components/Page'; // Импорт класса страницы
import { CardForBasket, CardCatalog, CardPreview } from './components/Card'; // Импорт карточек
import { cloneTemplate, ensureElement } from './utils/utils'; // Импорт вспомогательных функций
import { IProductItem, IAddressForm, IContactsForm } from './types'; // Импорт типов данных
import { Modal } from './components/Modal'; // Импорт модального окна
import { Basket } from './components/Basket'; // Импорт корзины
import { AddressForm, ContactsForm } from './components/Form'; // Импорт форм
import { Success } from './components/Success'; // Импорт сообщения об успешной операции

// Создание экземпляра класса EventEmitter
const events = new EventEmitter();

// Создание экземпляра класса OnlineStoreAPI с передачей констант API и CDN
const api = new OnlineStoreAPI(CDN_URL, API_URL);

// Обработчик события для вывода всех событий в консоль
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Получение шаблонов из DOM
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardForBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const addressFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Создание экземпляра класса AppState
const appData = new AppState({}, events);

// Создание экземпляра класса Page и передача ему корневого элемента и экземпляра EventEmitter
const page = new Page(document.body, events);

// Создание экземпляра класса Modal и передача ему контейнера для модального окна и экземпляра EventEmitter
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Создание экземпляра корзины
const basket = new Basket(cloneTemplate(basketTemplate), events);

// Создание экземпляра формы адреса
const addressForm = new AddressForm(cloneTemplate(addressFormTemplate), events);

// Создание экземпляра формы контактов
const contactsForm = new ContactsForm(
	cloneTemplate(contactsFormTemplate),
	events
);

// Функция для очистки корзины заказа
function clearOrder() {
	appData.clearBasket();
	page.counter = appData.getCountItems();
	events.off('order:clear', clearOrder);
}

// Обработчик события изменения списка карточек
events.on('cards:changed', (cards: { catalog: IProductItem[] }) => {
	page.catalog = cards.catalog.map((item) => {
		const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});

		card.setColorCategory(item.category, settings);
		return card.render({
			price: item.price,
			title: item.title,
			image: item.image,
			category: item.category,
		});
	});
});

// Обработчик события выбора карточки товара
events.on('card:select', (item: IProductItem) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appData.isIncludedCard(item.id)) {
				appData.toggleOrderedItem(item.id, true);
				page.counter = appData.getCountItems();
				card.buttonText = 'Удалить из корзины'; // Устанавливаем текст кнопки "Удалить из корзины"
			} else {
				appData.toggleOrderedItem(item.id, false);
				page.counter = appData.getCountItems();
				card.buttonText = 'В корзину'; // Устанавливаем текст кнопки "В корзину"
			}
		},
	});

	// Устанавливаем текст кнопки в зависимости от состояния товара в корзине
	card.buttonText = appData.isIncludedCard(item.id)
		? 'Удалить из корзины'
		: 'В корзину';

	card.setColorCategory(item.category, settings);
	card.buttonStatus = item.price;
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
			description: item.description,
		}),
	});
});

// Обработчик события открытия корзины
events.on('basket:open', () => {
	// Генерация карточек товаров в корзине и их рендеринг
	basket.items = appData.getAddProductInBasket().map((item, index) => {
		const card = new CardForBasket(cloneTemplate(cardForBasketTemplate), {
			onClick: () => {
				appData.toggleOrderedItem(item.id, false);
				page.counter = appData.getCountItems();
				events.emit('basket:open');
			},
		});

		return card.render({
			price: item.price,
			title: item.title,
			index: index + 1,
		});
	});

	// Рендеринг корзины в модальном окне
	modal.render({
		content: basket.render({
			total: appData.getTotal(),
			selected: appData.order.items,
		}),
	});
});

// Обработчик события открытия формы заказа
events.on('order:open', () => {
	// Рендеринг формы адреса в модальном окне
	modal.render({
		content: addressForm.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Обработчик события выбора способа оплаты
events.on('buttonPayments:select', (event: { button: HTMLButtonElement }) => {
	event.button.classList.add('button_alt-active');
	appData.setOrderField('payment', event.button.getAttribute('name'));
});

// Обработчик изменения полей формы адреса
events.on(
	/^order\..*:change/,
	(data: { field: keyof IAddressForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Обработчик изменения ошибок формы адреса
events.on('addressFormErrors:change', (errors: Partial<IAddressForm>) => {
	const { address, payment } = errors;
	addressForm.valid = !address && !payment;
	addressForm.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

// Обработчик события отправки заказа
events.on('order:submit', () => {
	// Рендеринг формы контактов в модальном окне
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Обработчик изменения полей формы контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Обработчик изменения ошибок формы контактов
events.on('contactsFormErrors:change', (errors: Partial<IContactsForm>) => {
	const { email, phone } = errors;
	contactsForm.valid = !phone && !email;
	contactsForm.errors = [phone, email].filter((i) => !!i).join('; ');
});

// Обработчик события отправки данных формы контактов
events.on('contacts:submit', () => {
	// Отправка данных формы контактов на сервер
	api
		.orderProduct(appData.order)
		.then((result) => {
			// Отображение сообщения об успешном заказе
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					// Очистка корзины после успешного заказа
					clearOrder();
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
			events.on('order:clear', clearOrder);
		})
		.catch((err) => {
			console.error(err);
		});
});

// Обработчик события открытия модального окна
events.on('modal:open', () => {
	page.locked = true; // Блокировка страницы при открытии модального окна
});

// Обработчик события закрытия модального окна
events.on('modal:close', () => {
	page.locked = false; // Разблокировка страницы при закрытии модального окна
});

// Очистка данных полей для активации валидации после закрытия модального окна
events.on('form:reset', () => {
	appData.resetForm();
});

// Получение списка карточек с сервера и установка списка в состояние приложения
api
	.getCardList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
