import { UploadFile } from "antd";

export type ProductDto = {
    name: string;
    description?: string;
    price: number;
    stock: number;
    manufacturer: string;
    specifications?: { name: string, value: string }[];
    images?: UploadFile[];
    categories?: number[];
}