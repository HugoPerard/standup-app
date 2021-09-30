import dayjs from 'dayjs';

import '@/config';

import { parseInputToDate } from './parseInputToDate';

describe('parseInputToDate function', () => {
  test('"22" give the 22nd of the current month and year', () => {
    // GIVEN
    const input = '22';
    const current = dayjs();

    // WHEN
    const parsedDate = parseInputToDate(input);

    // THEN
    expect(parsedDate.format('DD')).toBe(input);
    expect(parsedDate.format('MM')).toBe(current.format('MM'));
    expect(parsedDate.format('YYYY')).toBe(current.format('YYYY'));
  });

  test('"01/01/2021" give the wanted date', () => {
    // GIVEN
    const input = '01/01/2021';

    // WHEN
    const parsedDate = parseInputToDate(input);

    // THEN
    expect(parsedDate.format('DD')).toBe('01');
    expect(parsedDate.format('MM')).toBe('01');
    expect(parsedDate.format('YYYY')).toBe('2021');
  });

  test('"0303" give the 3rd of march of this year', () => {
    // GIVEN
    const input = '0303';
    const current = dayjs();

    // WHEN
    const parsedDate = parseInputToDate(input);

    // THEN
    expect(parsedDate.format('DD')).toBe('03');
    expect(parsedDate.format('MM')).toBe('03');
    expect(parsedDate.format('YYYY')).toBe(current.format('YYYY'));
  });

  test('"120421" give the 12th of april of the year 2021', () => {
    // GIVEN
    const input = '120421';

    // WHEN
    const parsedDate = parseInputToDate(input);

    // THEN
    expect(parsedDate.format('DD')).toBe('12');
    expect(parsedDate.format('MM')).toBe('04');
    expect(parsedDate.format('YYYY')).toBe('2021');
  });

  test('"" give an invalid date', () => {
    // GIVEN
    const input = '';

    // WHEN
    const parsedDate = parseInputToDate(input);

    // THEN
    expect(parsedDate.isValid()).toBeFalsy();
  });

  test('"222" give an invalid date', () => {
    // GIVEN
    const input = '';

    // WHEN
    const parsedDate = parseInputToDate(input);

    // THEN
    expect(parsedDate.isValid()).toBeFalsy();
  });

  test('"2-fev-15" give an invalid date', () => {
    // GIVEN
    const input = '';

    // WHEN
    const parsedDate = parseInputToDate(input);

    // THEN
    expect(parsedDate.isValid()).toBeFalsy();
  });

  test('"303" give an invalid date', () => {
    // GIVEN
    const input = '';

    // WHEN
    const parsedDate = parseInputToDate(input);

    // THEN
    expect(parsedDate.isValid()).toBeFalsy();
  });

  test('"12421" give an invalid date', () => {
    // GIVEN
    const input = '';

    // WHEN
    const parsedDate = parseInputToDate(input);

    // THEN
    expect(parsedDate.isValid()).toBeFalsy();
  });
});
