export interface IProduct {
    title: string;
    description: string;
    image: string;
    category_id?: number;
}

export interface IProductDB extends IProduct {
    categoryId?: number;
}

export interface ICategory {
    name: string;
}

export interface IBody {
    product: IProduct;
    category?: ICategory;
}