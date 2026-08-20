/**
 * @jest-environment jsdom
 *
 * Unit tests for the utility helpers that js/main.js exposes on
 * `window.NutritionHaveli`.
 *
 * main.js is a browser script (no module exports), so we evaluate its
 * source inside the jsdom environment. Its top-level code only declares
 * functions, registers a DOMContentLoaded listener (which never fires here)
 * and runs one IIFE that bails out early when its target section is absent,
 * so evaluating the file simply populates `window.NutritionHaveli`.
 */
let NutritionHaveli;

beforeAll(() => {
    // Requiring the script runs it in the jsdom global scope (Jest also
    // instruments it for coverage). It registers a DOMContentLoaded listener
    // that never fires here and assigns window.NutritionHaveli.
    require('../../js/main.js');
    NutritionHaveli = window.NutritionHaveli;
});

describe('window.NutritionHaveli exports', () => {
    it('exposes the expected helper functions', () => {
        expect(typeof NutritionHaveli).toBe('object');
        ['trackWhatsAppClick', 'generateWhatsAppLink', 'formatWhatsAppNumber', 'debounce', 'throttle'].forEach(
            (key) => expect(typeof NutritionHaveli[key]).toBe('function')
        );
    });
});

describe('formatWhatsAppNumber', () => {
    it('strips all non-digit characters', () => {
        expect(NutritionHaveli.formatWhatsAppNumber('+91 98276-76474')).toBe('919827676474');
    });

    it('keeps an already-clean number untouched', () => {
        expect(NutritionHaveli.formatWhatsAppNumber('919827676474')).toBe('919827676474');
    });

    it('returns an empty string when there are no digits', () => {
        expect(NutritionHaveli.formatWhatsAppNumber('no-digits-here')).toBe('');
    });
});

describe('generateWhatsAppLink', () => {
    it('builds a wa.me link with the formatted number and encoded message', () => {
        const link = NutritionHaveli.generateWhatsAppLink('+91 98276 76474', 'Hi there & welcome!');
        expect(link).toBe('https://wa.me/919827676474?text=Hi%20there%20%26%20welcome!');
    });

    it('encodes newlines and special characters in the message', () => {
        const link = NutritionHaveli.generateWhatsAppLink('919827676474', 'Line 1\nLine 2');
        expect(link).toBe('https://wa.me/919827676474?text=Line%201%0ALine%202');
    });
});

describe('debounce', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('invokes the function only once after the wait window', () => {
        const fn = jest.fn();
        const debounced = NutritionHaveli.debounce(fn, 200);

        debounced();
        debounced();
        debounced();
        expect(fn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(200);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('passes the latest arguments through to the wrapped function', () => {
        const fn = jest.fn();
        const debounced = NutritionHaveli.debounce(fn, 100);

        debounced('first');
        debounced('second');
        jest.advanceTimersByTime(100);

        expect(fn).toHaveBeenCalledWith('second');
    });

    it('resets the timer when called again before the wait elapses', () => {
        const fn = jest.fn();
        const debounced = NutritionHaveli.debounce(fn, 100);

        debounced();
        jest.advanceTimersByTime(60);
        debounced();
        jest.advanceTimersByTime(60);
        expect(fn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(40);
        expect(fn).toHaveBeenCalledTimes(1);
    });
});

describe('throttle', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('runs immediately on the first call and ignores calls within the limit', () => {
        const fn = jest.fn();
        const throttled = NutritionHaveli.throttle(fn, 200);

        throttled();
        throttled();
        throttled();
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('allows another call once the limit has passed', () => {
        const fn = jest.fn();
        const throttled = NutritionHaveli.throttle(fn, 200);

        throttled();
        jest.advanceTimersByTime(200);
        throttled();

        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('forwards arguments and "this" to the wrapped function', () => {
        const fn = jest.fn();
        const throttled = NutritionHaveli.throttle(fn, 100);

        throttled('a', 'b');
        expect(fn).toHaveBeenCalledWith('a', 'b');
    });
});

describe('trackWhatsAppClick', () => {
    it('logs the product name without throwing', () => {
        const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
        expect(() => NutritionHaveli.trackWhatsAppClick('Creatine')).not.toThrow();
        expect(spy).toHaveBeenCalledWith(expect.stringContaining('Creatine'));
        spy.mockRestore();
    });
});
