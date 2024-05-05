export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: TCategoryProduct;
	price: number | null;
}

export type TCategoryProduct =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export interface IAddressForm {
	payment: string;
	address: string;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IOrder extends IAddressForm, IContactsForm {
	items: string[];
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
	catalog: IProductItem[];
	order: IOrder;
	formErrors: FormErrors;
}

export interface IOrderSuccess {
	id: string;
	total: number;
}

export type TSuccess = Pick<IOrderSuccess, 'total'>;

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};
