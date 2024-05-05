# Проектная работа "Веб-ларек"

## Описание проекта

"Веб-ларек" — это шуточный интернет-магазин, в котором пользователи могут приобрести самые необходимые товары для веб-разработчиков (например, дополнительный час в сутках). Проект создан с применением паттерна MVP (Model-View-Presenter) и предлагает интуитивно понятный интерфейс, позволяющий легко просматривать товары, добавлять их в корзину и оформлять заказы. Взаимодействие между компонентами осуществляется через эффективную событийную модель и прямые вызовы методов, обеспечивая каждому классу высокую производительность и возможность отзывчиво реагировать на изменения в приложении.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Типы данных, используемые в веб-приложении

```
// Интерфейс карточки товара
interface IProductItem {
  id: string;
	description: string;
	image: string;
	title: string;
	category: TCategoryProduct;
	price: number | null;
}

// Интерфейс формы c адресом доставки
interface IAddressForm {
    payment: string;
    address: string;
}

// Интерфейс формы c контактами
interface IContactsForm {
  email: string;
	phone: string;
}

// Интерфейс данных о заказе (при запросе на сервер)
interface IOrder extends IAddressForm, IContactsForm {
  items: string[];
  total: number;
}

// Интерфейс успешного ответа от сервера
interface IOrderSuccess {
  id: string;
  total: number;
}
```

## Базовые классы

### Класс Api:

Класс Api создан для обеспечения основных методов взаимодействия с серверным API. Он предоставляет удобный интерфейс для отправки HTTP-запросов на сервер и получения ответов.

Методы класса:

- `get`: выполняет HTTP GET запрос по указанному URI и возвращает объект, содержащий данные ответа.
- `post`: отправляет HTTP POST запрос по указанному URI с переданными данными и методом запроса (по умолчанию 'POST'). По завершении запроса возвращает объект с данными ответа.

### Класс EventEmitter:

Класс EventEmitter представляет собой инструмент для организации обмена данными между компонентами в приложении. Он обеспечивает возможность установки обработчиков событий, вызова событий и их прослушивания.

Методы класса:

- `on`: устанавливает обработчик для события.
- `off`: удаляет обработчик для события.
- `emit`: инициирует событие с переданными данными.
- `onAll`: устанавливает обработчик для всех событий.
- `offAll`: снимает обработчик со всех событий.
- `trigger`: делает коллбек-триггер, генерирующий событие при вызове.

### Абстрактный класс Component:

Абстрактный базовый класс Component необходим для создания компонентов пользовательского интерфейса. Он предоставляет методы для управления элементами DOM и поведением компонентов. Является родительским для всех классов слоя отображения (View).

Методы класса:

- `toggleClass`: переключает класс для указанного элемента.
- `protected setText`: устанавливает текстовое содержимое для указанного элемента.
- `protected setImage`: устанавливает изображения и альтернативный текст для указанного элемента.
- `setDisabled`: изменяет статус блокировки для указанного элемента.
- `protected setVisible`: отоброжает указанный элемент.
- `protected setHidden`: скрывает указанный элемент.
- `render`: рендерит компонент, используя переданные данные.

### Абстрактный класс Model:

Класс Model — это абстрактный класс, который представляет собой модель данных, используемую для описания состояния приложения. Данный класс является родительским для других классов данных (Model), которые содержат конкретные реализации моделей для различных компонентов или функций приложения.

Метод класса:

- `emitChanges`: cообщает о каких-либо изменениях в модели.

## Слой работы с данными (Model). Основные классы

Модель (Model) отвечает за хранение данных приложения и бизнес-логику, связанную с этими данными. Она предоставляет интерфейс для доступа к данным и операциям над ними, однако не знает, как эти данные будут использоваться в других частях приложения.

### AppState:

Класс AppState является представлением глобального состояния приложения. Интерфейс IAppState определяет структуру этого состояния. Путем наследования от Model<IAppState> класс AppState получает возможность использовать функциональность базовой модели для управления событиями и обновлением данных.

Поля:

- `catalog: IProductItem[]`: Массив объектов товаров в каталоге.
- `order: IOrder`: Объект с данными, необходимыми для формления заказа.
- `formErrors: FormErrors`: Объект, содержащий ошибки, возникающие при некорректном заполнении формы заказа.

Методы класса:

- `toggleOrderedItem`: Метод для добавления или удаления товара из корзины.
- `clearBasket`: Метод для очистки корзины и заказа.
- `getTotal`: Метод для вычисления общей стоимости товаров в корзине.
- `setCatalog`: Метод для установки каталога товаров и отправки соответствующего события об изменении.
- `setOrderField`: Метод для установки значения поля заказа и проверки наличия достаточных данных для оформления заказа.
- `validateOrderForm`: Метод для проверки наличия данных о способе оплаты и адресе доставки.
- `setContactsField`: Метод для установки значения поля контактной информации и проверки наличия достаточных контактных данных для оформления заказа.
- `validateContactsForm`: Метод для проверки наличия данных об электронной почте и номере телефона.
- `resetForm`: Метод для сброса значений формы.

## Слой отображения/представления (View). Основные классы

Слой отображения (View) в приложении отвечает за представление данных и взаимодействие с пользователем. Его основная задача состоит в том, чтобы отображать необходимую пользователю информацию и обеспечивать интерфейс для взаимодействия с приложением.

В данном проекте Presenter не вынесен в отдельный класс, содержится в файле index.ts и реализуется в основном через объект класса EventEmitter, связывающий между собой данные и отображение по иницилаизации тех или иных событий.

### Modal:

Назначение: Modal отвечает за создание и управление модальными окнами.
Наследуется от: Component<IModalContent>
Интерфейс: IModalContent
Описание: Класс Modal предоставляет функционал для управления модальными окнами, включая их открытие, закрытие и управление содержимым.

`constructor(container: HTMLElement, protected events: IEvents)`: Принимает элемент контейнера и объект управления событиями. Внутри вызывает конструктор базового класса Component<IModalContent>, чтобы инициализировать основной функционал компонента. Также он инициализирует элементы модального окна и устанавливает обработчики событий для кнопки закрытия, самого окна и его содержимого.

Поля класса:

- `_closeButton: HTMLButtonElement`: Кнопка для закрытия модального окна.
- `_content: HTMLElement`: Элемент контента модального окна.

Методы класса:

- `set content`: Устанавливает содержимое модального окна (сеттер).
- `open`: Открывает модальное окно и отправляет соответствующее событие.
- `close`: Закрывает модальное окно, очищает контент и отправляет соответствующее событие.
- `render`: Выполняет рендеринг модального окна с учетом переданных данных.

### Card:

Назначение: Класс Card предоставляет абстрактный шаблон для создания карточек с информацией о продукте.
Наследуется от: Component<ICard>
Интерфейс: ICard
Описание: Класс Card предоставляет основной функционал для отображения карточек продуктов, но сам по себе является абстрактным и не предназначен для создания экземпляров. Он служит в качестве основы для создания конкретных типов карточек продуктов, каждый из которых будет реализовывать свою собственную логику и внешний вид.

`constructor(protected container: HTMLElement, behavior?: ICardBehavior)`: Принимает имя блока, элемент контейнера и объект для управления событиями. Сначала он инициализирует базовый функционал компонента, связывая его с переданным контейнером. Далее он инициализирует элементы карточки продукта, такие как заголовок и цена, и устанавливает обработчики событий для кнопки действия, если такие предоставлены. Если объект behavior содержит обработчик события onClick, то он добавляется к кнопке карточки или к самой карточке в целом, в зависимости от наличия кнопки

Поля класса:

- `protected _title: HTMLElement`: Элемент заголовка продукта.
- `protected _image?: HTMLImageElement`: Элемент изображения продукта.
- `protected _description?: HTMLElement`: Элемент описания продукта.
- `protected _category?: HTMLElement`: Элемент для отображения категории продукта.
- `protected _price: HTMLElement`: Элемент для отображения цены продукта.
- `protected _button?: HTMLButtonElement`: Элемент кнопки.

Методы класса (сеттеры):

- `set id`: Устанавливает идентификатор продукта.
- `set category`: Устанавливает категорию продукта.
- `set title`: Устанавливает заголовок продукта.
- `set description`: Устанавливает описание продукта.
- `set image`: Устанавливает изображение продукта.
- `set buttonText`: Устанавливает текст кнопки.
- `set buttonStatus`: Устанавливает статус активности кнопки.
- `set price`: Устанавливает цену продукта.

#### CardCatalog:

Назначение: Класс, представляющий карточку продукта для отображения в каталоге товаров.
Наследуется от: Card
Описание: Класс CardCatalog представляет собой карточку товара в каталоге, который используется для отображения списка товаров. Он наследует основной функционал от класса Card и инициализирует дополнительные поля, такие как изображение и категория товара.

#### CardForBasket:

Назначение: Класс, представляющий карточку товара для отображения в корзине.
Наследуется от: Card
Описание: Класс CardForBasket, унаследованный от класса Card, предназначен для представления карточки товара в корзине. Он служит для отображения информации о товаре (например, название, цена). Кроме того, класс CardForBasket расширяет функционал класса Card, добавляя инициализацию дополнительного поля — порядкового номера отображающейся в корзине карточки товара.

Поле класса:

- `protected _itemIndex: HTMLElement`: Элемент для отображения порядкого номера карточки в корзине.

Метод класса (сеттер):

- `set index`: Устанавливает порядковый номер карточки в корзине.

#### CardPreview:

Назначение: Класс, представляющий предварительный просмотр карточки товара.
Наследуется от: Card
Описание: CardPreview необходим для отображения превью выбранной карточки в модальном окне (название, изображение, категория товара, цена, описание товара). При нажатии на кнопку "В корзину" карточка добавляется в корзину, а модальное окно закрывается. Этот класс упрощает пользовательский опыт путем предварительного просмотра товара и позволяет легко осуществлять покупку в модальном окне.

### Page:

Назначение: Page управляет отображением блока с карточками на основной странице приложения.
Наследуется от: Component<IPage>
Интерфейс: IPage
Описание: Page отображает содержимое главной страницы приложения, такое как каталог продуктов и счетчик элементов.

`constructor(container: HTMLElement, protected events: IEvents)`: Этот конструктор инициализирует объект страницы, принимая контейнер, в котором будет размещена страница, а также объект для управления событиями. Внутри конструктора происходит инициализация основных элементов страницы, таких как счетчик корзины, контейнер каталога товаров, обертка страницы и элемент корзины. Также добавляется обработчик события клика на элемент корзины, который при активации вызывает метод emit объекта событий events, инициируя событие "открытие корзины".

Поля класса:

- `protected _catalog: HTMLElement`: Элемент каталога товаров.
- `protected _basket: HTMLElement`: Элемент корзины.
- `protected _counter: HTMLElement`: Элемент счетчика товаров в корзине.
- `protected _wrapper: HTMLElement`: Элемент обертки страницы.

Методы класса (сеттеры):

- `set catalog`: Устанавливает список элементов каталога товаров на странице.
- `set counter`: Устанавливает значение счетчика товаров в корзине.
- `set locked`: Устанавливает состояние прокрутки.

### Basket:

Назначение: Basket управляет отображением информации о корзине покупок.
Наследуется от: Component<IBasketContent>
Интерфейс: IBasketContent
Описание: Basket отображает содержимое корзины покупок, а также предоставляет методы для управления элементами в корзине.

`constructor(container: HTMLElement, protected events: EventEmitter)`: Этот конструктор инициализирует объект корзины товаров. Он принимает два аргумента: container, который представляет собой элемент DOM, в который будет встроена корзина, и events, который является объектом EventEmitter и используется для управления событиями внутри корзины.
Внутри конструктора происходит инициализация основных элементов корзины, таких как список товаров, общая стоимость и кнопка оформления заказа. Также устанавливается обработчик события клика на кнопку оформления заказа, который при активации вызывает соответствующее событие через объект events, инициируя процесс оформления заказа.

Поля класса:

- `protected _list: HTMLElement`: Элемент списка товаров в корзине.
- `protected _total: HTMLElement`: Элемент для отображения общей стоимости товаров в корзине.
- `protected _button: HTMLElement`: Кнопка для оформления заказа.

Методы класса (сеттеры):

- `set items`: Устанавливает список элементов товаров в корзине.
- `set selected`: Устанавливает состояние книпки оформления заказа (вкл. или выкл.) в зависимости от наличия товаров.
- `set total`: Устанавливает общую стоимость товаров в корзине.

### Form:

Назначение: Класс Form управляет отображением и взаимодействием с формами.
Наследуется от: Component<IFormCondition>
Интерфейс: IFormCondition
Описание: Form предоставляет общие методы для управления формами, такие как установка значений полей и валидация.

`constructor(container: HTMLFormElement, events: IEvents)`: Этот конструктор принимает два аргумента: container и events. container представляет собой элемент HTML-формы, с которым будет взаимодействовать экземпляр класса, а events представляет объект для управления событиями. При создании экземпляра класса Form, конструктор инициализирует основные элементы формы и устанавливает обработчики событий для ввода данных пользователем и отправки формы.

Поля класса:

- `protected _submit: HTMLButtonElement`: Кнопка отправки формы.
- `protected _errors: HTMLElement`: Элемент для отображения ошибок формы.

Методы класса:

- `set valid`: Устанавливает состояние кнопки отправки (активное/неактивное) в зависимости от валидности формы (сеттер).
- `set errors`: Устанавливает значение текста ошибок в форме (сеттер).
- `render`: Выполняет рендеринг компонентов формы с учетом переданного состояния.
- `onInputChange`: Отправляет событие об изменении данных ввода.

#### AddressForm:

Назначение: Класс формы для ввода адреса доставки товара.
Наследуется от: AddressForm наследуется от абстрактного класса Form<T>, который предоставляет базовую функциональность для работы с формами.
Описание: Класс формы AddressForm предназначен для ввода адреса доставки товара. Он обеспечивает интерфейс для взаимодействия с пользователем, включая поля для ввода адреса и кнопки выбора способа оплаты. При изменении значений полей формы или выборе способа оплаты генерируются соответствующие события для обработки.

Поле класса:

- `protected _buttonPayments: HTMLButtonElement[]`: Массив с элементами, отвечающими за выбор способа оплаты.

Метод класса (сеттер):

- `set address`: Устанавливает значение для поля адреса.

#### ContactsForm:

Назначение: Класс формы для ввода контактных данных клиента.
Наследуется от: ContactsForm наследуется от абстрактного класса Form<T>, который предоставляет базовую функциональность для работы с формами.
Описание: ContactsForm представляет собой форму для ввода контактной информации клиента, такой как адрес электронной почты и номер телефона. Класс обеспечивает возможность ввода данных в соответствующие поля и предоставляет интерфейс для обработки этих данных. При изменении значений полей формы генерируются события для дальнейшей обработки.

Методы класса (сеттеры):

- `set phonenumber(value: string)`: Устанавливает значение для поля телефона.
- `set email(value: string)`: Устанавливает значение для поля email.

### Success:

Назначение: Этот класс отвечает за отображение интерфейса успешной покупки.
Наследуется от: Component<TSuccess>
Описание: Success предназначен для отображения сообщения об успешном заказе.

`constructor(container: HTMLElement, purchase: ISuccessPurchase)`: Этот конструктор инициализирует объект класса Success, который предназначен для отображения сообщения об успешном заказе. Он принимает два параметра: container, который представляет контейнер, в котором будет отображаться сообщение об успешном заказе, и purchase, объект содержащий обработчик события клика на элемент закрытия сообщения.
В конструкторе происходит инициализация элементов, которые будут отображать описание успешного заказа и кнопку для закрытия сообщения. Если передан объект purchase с обработчиком клика, то он привязывается к элементу закрытия сообщения.

Поля класса:

- `protected _close: HTMLElement`: Элемент для кнопки закрытия сообщения.
- `protected _successSum: HTMLElement`: Элемент для отображения суммы списания.

Метод класса (сеттер):

- `set total`: Устанавливает текст со значением суммы списания.

## Слой коммуникации. Основные классы

В нашем приложении необходимо обмениваться данными с внешними сервисами (а именно с сервером онлайн-магазина "WebLarek"). Слой коммуникации управляет этими взаимодействиями.

### OnlineStoreAPI:

Назначение: Этот класс отвечает за взаимодействия с сервером онлайн-магазина "WebLarek".
Наследуется от: Api
Интерфейс: IOnlineStoreAPI
Описание: OnlineStoreAPI представляет собой клиентский API для взаимодействия с сервером онлайн-магазина "WebLarek". Этот класс расширяет базовый класс Api, который предоставляет методы для выполнения HTTP-запросов.

`constructor(cdn: string, baseUrl: string, options?: RequestInit)`: Этот конструктор создает новый экземпляр API для общения с сервером онлайн-магазина "WebLarek". Он принимает три параметра: cdn, baseUrl, и необязательный options, где cdn – это URL для загрузки изображений, baseUrl – базовый URL для API магазина, а options – это дополнительные настройки запроса.

Поле класса:

- `readonly cdn: string`: URL-адрес контентного сервера.

Методы класса:

- `getCardList`: Метод получения списка товаров.
- `getCardItem`: Метод получения информации о конкретном товаре по его идентификатору.
- `orderProduct`: Метод оформления заказа на товар.

## Размещение в сети

Интернет-магазин доступен по адресу: //адрес будет указан по завершении проекта.
