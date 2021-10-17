import { getFormattedDate } from './helpers';

describe('getFormattedDate', () => {
  const string = '2021-06-07T09:56:25Z';

  test('formats date only', () => {
    const type = 'date';
    expect(getFormattedDate(string, type)).toEqual('May 7, 2021');
  });

  test('formats date and time', () => {
    const type = 'datetime';
    expect(getFormattedDate(string, type)).toEqual('May 7, 2021 3:56');
  });
});
