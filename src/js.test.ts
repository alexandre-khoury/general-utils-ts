import { expect, test } from 'vitest';
import { JSUtils } from './js.js';

test('jsonToXml empty', () => {
  expect(JSUtils.jsonToXml({})).toBe('');
});

test('jsonToXml basic 1', () => {
  expect(JSUtils.jsonToXml({ a: 1 }, 'b')).toBe('<b:a>1</b:a>');
});

test('jsonToXml basic 2', () => {
  expect(JSUtils.jsonToXml({ a: [1] }, 'b')).toBe('<b:a>1</b:a>');
});

test('jsonToXml basic 3', () => {
  expect(JSUtils.jsonToXml({ a: [1, 2] }, 'b')).toBe(
    '<b:a>1</b:a><b:a>2</b:a>',
  );
});

test('jsonToXml basic 4', () => {
  expect(JSUtils.jsonToXml({ a: { c: 2 } }, 'b')).toBe(
    '<b:a><b:c>2</b:c></b:a>',
  );
});

test('jsonToXml basic 4', () => {
  expect(JSUtils.jsonToXml({ a: { c: true } })).toBe('<a><c>true</c></a>');
});

test('jsonToXml basic 5', () => {
  expect(JSUtils.jsonToXml({ test: null })).toBe('<test/>');
});

test('jsonToXml basic 6', () => {
  expect(JSUtils.jsonToXml({ test: {} })).toBe('<test/>');
});

test('jsonToXml basic 7', () => {
  expect(JSUtils.jsonToXml({ test: {} })).toBe('<test/>');
});

test('jsonToXml basic 8', () => {
  expect(JSUtils.jsonToXml({ test: '<' })).toBe('<test>&lt;</test>');
});

test('xmlToJson empty', () => {
  expect(JSUtils.xmlToJson('')).toBe('');
});

test('xmlToJson basic 1', () => {
  expect(JSUtils.xmlToJson('<a/>')).toStrictEqual({ a: [''] });
});

test('xmlToJson basic 2', () => {
  expect(JSUtils.xmlToJson('<a></a>')).toStrictEqual({ a: [''] });
});

test('xmlToJson basic 3', () => {
  expect(JSUtils.xmlToJson('<a>b</a>')).toStrictEqual({ a: ['b'] });
});

test('xmlToJson basic 4', () => {
  expect(JSUtils.xmlToJson('<a>2</a>')).toStrictEqual({ a: ['2'] });
});

test('xmlToJson basic 5', () => {
  expect(JSUtils.xmlToJson('<x><a>2</a><a>3</a><b>4</b></x>')).toStrictEqual({
    x: [{ a: ['2', '3'], b: ['4'] }],
  });
});

test('xmlToJson basic 6', () => {
  expect(JSUtils.xmlToJson('<x><a></a><a>true</a></x>')).toStrictEqual({
    x: [{ a: ['', 'true'] }],
  });
});
