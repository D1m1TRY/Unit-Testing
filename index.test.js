const unitTestingTask = require('./unitTestingTask');
const date = new Date();
const months = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
const monthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
const weekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
const weekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
const weekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
const customFormats = [ 'ISODate', 'ISOTime', 'ISODateTime', 'ISODateTimeTZ' ];

const fullYear = date.getFullYear().toString();
const lastTwoDigitOfYear = fullYear % 100;
const currentMonthIndex = date.getMonth();
const currentDayIndex = date.getDay();
const numberOfDate = date.getDate();
const currentHourValue = date.getHours();
const currentMinutesValue = date.getMinutes().toString();
const currentSecondsValue = date.getSeconds().toString();
const currentMillisecondsValue = date.getMilliseconds().toString();
const twelveHourFormat = currentHourValue % 12 || 12;

const ISODateValue = `${fullYear}-${leadingZeroes(currentMonthIndex + 1)}-${leadingZeroes(numberOfDate)}`;
const ISOTimeValue = `${leadingZeroes(twelveHourFormat)}:${leadingZeroes(currentMinutesValue)}:${leadingZeroes(currentSecondsValue)}`;
const ISODateTimeValue = `${ISODateValue}T${ISOTimeValue}`;

function leadingZeroes(value, length) {
  let result = value.toString();
  let totalLength = arguments.length === 2 ? length : 2;

  if (result.length >= totalLength) {
    return result;
  }

  for (result; result.length < totalLength; result = '0' + result);
  return result;
};

expect.extend({
  getTimeZoneValue(received, date, format, separator = '') {
    if (!(date instanceof Date)) {
      return {
        message: () => "You get an Error because the received value isn't instanceof Date",
        pass: false
      };
    }
    const tz = date.getTimezoneOffset();
    const hours = Math.abs(Math.floor(tz / 60));
    const mins = tz % 60;
    const sign = tz > 0 ? '-' : '+';
    separator = separator || '';
    const result = sign + ([leadingZeroes(hours), leadingZeroes(mins)]).join(separator);
    const isPassed = result === received;
    if (isPassed) {
      return {
        message: () => `expected ${received} to be ${result}`,
        pass: true
      };
    } else {
      return {
        message: () => `${result} isn't correct`,
        pass: false
      };
    }
   
  },
  analizeHourFormat (received, currentHourValue, isUpperCase) {
    let result = 'am';
    if (currentHourValue && currentHourValue > 11) {
      result = 'pm';
    }
    if (isUpperCase) {
      result = result.toUpperCase()
    }
    const isPassed = result === received;
    if (typeof currentHourValue !== 'number') {
      return {
        message: () => `Result isn't correct probably because typeof currentHourValue must be a number`,
        pass: false
      };
    }
    if (currentHourValue.toString().length > 2) {
      return {
        message: () => `Result isn't correct probably because currentHourValue argument has incorrect value`,
        pass: false
      };
    }
    if (isPassed) {
      return {
        message: () => `expected ${received} to be ${result}`,
        pass: true
      };
    } else {
      return {
        message: () => `${result} isn't correct`,
        pass: false
      };
    }
  }
})

test('that test should check containing _formatters values', () => {
  expect(unitTestingTask._formatters['ISODate'](date)).toBe(ISODateValue);
  expect(unitTestingTask._formatters['ISOTime'](date)).toBe(ISOTimeValue);
  expect(unitTestingTask._formatters['ISODateTime'](date)).toBe(ISODateTimeValue);
});

test('that test should check for any conflicts when we call function', () => {
  expect(unitTestingTask).toBeDefined();
  expect(unitTestingTask.noConflict()).toBe(unitTestingTask);
});

test('that test should return list of custom formats', () => {
  expect(unitTestingTask.formatters()).toEqual(expect.arrayContaining(customFormats));
});

test('that test should return error when format arg is not a string type', () => {
  expect(() => unitTestingTask(null, date)).toThrow(/format/);
});22

test('that test should return error when date arg must be instance of Date or Unix Timestamp or ISODate String', () => {
  expect(() => unitTestingTask('YYYY', null)).toThrow(/date/);
});

test('that test must return number of year if date arg will be Unix Timestamp', () => {
  expect(unitTestingTask('YYYY', +date)).toBe(fullYear);
});

test('that test must return number of year if date arg will be in ISODate String', () => {
  expect(unitTestingTask('YYYY', date.toISOString())).toBe(fullYear);
});

test('it should return correct lang', () => {
  expect(unitTestingTask.lang()).toBe('en');
});

test('that test should return number of year', () => {
  expect(unitTestingTask('YYYY', date)).toBe(fullYear);
});

test('that test should return two last numbers of year', () => {
  expect(unitTestingTask('YY', date)).toBe(lastTwoDigitOfYear.toString())
})

test('that test should return month name', () => {
  expect(unitTestingTask('MMMM', date)).toBe(months[currentMonthIndex]);
});

test('that test should return short month name', () => {
  expect(unitTestingTask('MMM', date)).toBe(monthsShort[currentMonthIndex]);
});

test('that test should return month number', () => {
  expect(unitTestingTask('MM', date)).toBe(leadingZeroes(currentMonthIndex + 1));
});

test('that test should return month number without zero-padding', () => {
  expect(unitTestingTask('M', date)).toBe((currentMonthIndex + 1).toString());
});

test('that test should return day name', () => {
  expect(unitTestingTask('DDD', date)).toBe(weekdays[currentDayIndex]);
});

test('that test should return short day name', () => {
  expect(unitTestingTask('DD', date)).toBe(weekdaysShort[currentDayIndex]);
});

test('that test should return two-letter format of day name', () => {
  expect(unitTestingTask('D', date)).toBe(weekdaysMin[currentDayIndex]);
});

test('that test should return number of day with zero-padding', () => {
  expect(unitTestingTask('dd', date)).toBe(leadingZeroes(numberOfDate));
});

test('that test should return number of day', () => {
  expect(unitTestingTask('d', date)).toBe((numberOfDate).toString());
});

test('that test should return zero-padded current hour in 24-hr format', () => {
  expect(unitTestingTask('HH', date)).toBe(leadingZeroes(currentHourValue));
});

test('that test should return current hour in 24-hr format', () => {
  expect(unitTestingTask('H', date)).toBe(currentHourValue.toString());
});

test('that test should return zero-padded hour in 12-hr format', () => {
  expect(unitTestingTask('hh', date)).toBe(leadingZeroes(twelveHourFormat));
});

test('that test should return current hour in 12-hr format', () => {
  expect(unitTestingTask('h', date)).toBe(twelveHourFormat.toString());
});

test('that test should return zero-padded minutes', () => {
  expect(unitTestingTask('mm', date)).toBe(leadingZeroes(currentMinutesValue));
});

test('that test should return current minutes time', () => {
  expect(unitTestingTask('m', date)).toBe(currentMinutesValue);
});

test('that test should return zero-padded seconds time', () => {
  expect(unitTestingTask('ss', date)).toBe(leadingZeroes(currentSecondsValue));
});

test('that test should return seconds time', () => {
  expect(unitTestingTask('s', date)).toBe(currentSecondsValue);
});

test('that test should return zero-padded current milliseconds time', () => {
  expect(unitTestingTask('ff', date)).toBe(leadingZeroes(currentMillisecondsValue, 3));
});

test('that test should return milliseconds time', () => {
  expect(unitTestingTask('f', date)).toBe(currentMillisecondsValue);
});

test('that test should return twelve time format (AM or PM) uppercase', () => {
  expect(unitTestingTask('A', date)).analizeHourFormat(currentHourValue, true);
});

test('that test should return twelve time format (am or pm)', () => {
  expect(unitTestingTask('a', date)).analizeHourFormat(currentHourValue);
});

test('that test should return time zone in ISO8601-compatible basic format', () => {
  expect(unitTestingTask('ZZ', date)).getTimeZoneValue(date);
});

test('that test should return time zone in ISO8601-compatible extended format', () => {
  expect(unitTestingTask('Z', date)).getTimeZoneValue(date, null, ':');
});
