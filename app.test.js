import app from './app.js';
import request from 'supertest';



describe("PUT //api/books/:bookId/checkout/:userId", ()=> {
    test("should checkout a book for a specific user.", async () => {
        let result = await request(app).put("/api/books/9780140385724/checkout/1");
        let actual = JSON.stringify(result.body);
        console.log(actual)
        expect(actual.isbn).toEqual('9780140385724');
        expect(actual.title).toEqual('The Outsiders');
        expect(actual.author).toEqual('SE Hinton');
        expect(actual.checked_out).toEqual(true);
        expect(actual.order_id).toBeTruthy();
        expect(actual.user_id).toEqual(1);
        expect(actual.date_checked_out).toBeTruthy();
        expect(actual.due_date).toBeTruthy();
        expect(actual.return_date).toEqual(undefined);
    })
})

