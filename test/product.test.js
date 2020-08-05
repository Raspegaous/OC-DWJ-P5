import Product from '../js/Product.js';
import fetchMock from "jest-fetch-mock";

describe('Product Class', () => {
    const product = new Product();
    const fakeResponse = {name: 'fake', price: 500, description: 'lorem ipsum'};

    test('function setUrl', () => {
        product.setUrl('test');
        expect(product.url).toBe('test');
    });

    test('async function getProduct', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(fakeResponse));
        expect(await product.getProduct()).toEqual(fakeResponse);
    });

    test('function productList', () => {
        const data = { imageUrl: "img", name: 'name', price: 'price', description: 'description', _id: 12 };
        expect(product.productList(data)).toBeInstanceOf(HTMLDivElement);
    });

});
