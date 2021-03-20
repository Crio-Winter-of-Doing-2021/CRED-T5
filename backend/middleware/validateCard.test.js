const checkCardValidity = require('./validateCard').checkCardValidity;

test('Card test #1', () => {
    expect(() => checkCardValidity('1234567887654321', '10/23')).toThrow('Invalid card number');
});

test('Card test #2', () => {
    expect(() => checkCardValidity('5555444437392820', '2/20')).toThrow('Invalid expiry date format');
});

test('Card test #3', () => {
    expect(checkCardValidity('5555444437392820', '12/22')).toBe("VALID");
});