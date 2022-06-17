const unitTestingTask = require('./unitTestingTask');
const date = new Date();
const months = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
const monthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
const weekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
const weekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
const weekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
const customFormats = [ 'ISODate', 'ISOTime', 'ISODateTime', 'ISODateTimeTZ' ];

const fullYear = date.getFullYear();
const yyDate = fullYear % 100;
const monthIndex = date.getMonth();
const dayindex = date.getDay();
const dateindex = date.getDate();
const hour = date.getHours();
const minutes = date.getMinutes();
const seconds = date.getSeconds();
const milliseconds = date.getMilliseconds();
const twelveHourFormat = hour % 12 || 12;

const ISODateValue = `${fullYear}-${leadingZeroes(monthIndex + 1)}-${leadingZeroes(dateindex)}`;
const ISOTimeValue = `${leadingZeroes(twelveHourFormat)}:${leadingZeroes(minutes)}:${leadingZeroes(seconds)}`;
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
    const tz = date.getTimezoneOffset();
    const hours = Math.abs(Math.floor(tz / 60));
    const mins = tz % 60;
    const sign = tz > 0 ? '-' : '+';
    separator = separator || '';
    const result = sign + ([leadingZeroes(hours), leadingZeroes(mins)]).join(separator);
    const isPassed = result === received;
    if (isPassed) {
      return {
        message: () => {
          `expected ${received} to be ${result}`
        },
        pass: true
      };
    } else {
      return {
        message: () => {
          `${result} isn't correct`
        },
        pass: false
      };
    }
   
  },
  analizeHourFormat (received, hour, isUpperCase) {
    let result = 'am';
    if (hour > 11) {
      result = 'pm';
    }
    if (isUpperCase) {
      result = result.toUpperCase()
    }
    const isPassed = result === received;
    if (isPassed) {
      return {
        message: () => {
          `expected ${received} to be ${result}`
        },
        pass: true
      };
    } else {
      return {
        message: () => {
          `${result} isn't correct`
        },
        pass: false
      };
    }
  }
})

test('test _formatters', () => {
  expect(unitTestingTask._formatters['ISODate'](date)).toBe(ISODateValue);
  expect(unitTestingTask._formatters['ISOTime'](date)).toBe(ISOTimeValue);
  expect(unitTestingTask._formatters['ISODateTime'](date)).toBe(ISODateTimeValue);
});

test('test to have 0 conflicts', () => {
  expect(unitTestingTask).toBeDefined();
  expect(unitTestingTask.noConflict()).toBe(unitTestingTask);
});

test('test to get list of custom formats', () => {
  expect(unitTestingTask.formatters()).toEqual(expect.arrayContaining(customFormats));
});

test('test to get error when format arg is not a string type', () => {
  expect(() => unitTestingTask(null, date)).toThrow(/format/);
});

test('test to get error when date arg must be instance of Date or Unix Timestamp or ISODate String', () => {
  expect(() => unitTestingTask('YYYY', null)).toThrow(/date/);
});

test('test to get correct result if date arg will be Unix Timestamp', () => {
  expect(unitTestingTask('YYYY', +date)).toBe(fullYear.toString());
});

test('test to get correct result if date arg will be in ISODate String', () => {
  expect(unitTestingTask('YYYY', date.toISOString())).toBe(fullYear.toString());
});

test('test to get correct lang', () => {
  expect(unitTestingTask.lang()).toBe('en');
});

test('test to get full year', () => {
  expect(unitTestingTask('YYYY', date)).toBe(fullYear.toString());
});

test('test to get two last numbers of year', () => {
  expect(unitTestingTask('YY', date)).toBe(yyDate.toString())
})

test('test to get month name', () => {
  expect(unitTestingTask('MMMM', date)).toBe(months[monthIndex]);
});

test('test to get short month name', () => {
  expect(unitTestingTask('MMM', date)).toBe(monthsShort[monthIndex]);
});

test('test to get month number', () => {
  expect(unitTestingTask('MM', date)).toBe(leadingZeroes(monthIndex + 1));
});

test('test to get month number without zero-padding', () => {
  expect(unitTestingTask('M', date)).toBe((monthIndex + 1).toString());
});

test('test to get day name', () => {
  expect(unitTestingTask('DDD', date)).toBe(weekdays[dayindex]);
});

test('test to get short day name', () => {
  expect(unitTestingTask('DD', date)).toBe(weekdaysShort[dayindex]);
});

test('test to get min day name', () => {
  expect(unitTestingTask('D', date)).toBe(weekdaysMin[dayindex]);
});

test('test to get number of day with zero-padding', () => {
  expect(unitTestingTask('dd', date)).toBe(leadingZeroes(dateindex));
});

test('test to get number of day', () => {
  expect(unitTestingTask('d', date)).toBe((dateindex).toString());
});

test('test to get zero-padded hour in 24-hr format', () => {
  expect(unitTestingTask('HH', date)).toBe(leadingZeroes(hour));
});

test('test to get hour in 24-hr format', () => {
  expect(unitTestingTask('H', date)).toBe(hour.toString());
});

test('test to get zero-padded hour in 24-hr format', () => {
  expect(unitTestingTask('hh', date)).toBe(leadingZeroes(twelveHourFormat));
});

test('test to get hour in 24-hr format', () => {
  expect(unitTestingTask('h', date)).toBe(twelveHourFormat.toString());
});

test('test to get zero-padded minutes', () => {
  expect(unitTestingTask('mm', date)).toBe(leadingZeroes(minutes));
});

test('test to get minutes', () => {
  expect(unitTestingTask('m', date)).toBe(minutes.toString());
});

test('test to get zero-padded seconds', () => {
  expect(unitTestingTask('ss', date)).toBe(leadingZeroes(seconds));
});

test('test to get seconds', () => {
  expect(unitTestingTask('s', date)).toBe(seconds.toString());
});

test('test to get zero-padded milliseconds', () => {
  expect(unitTestingTask('ff', date)).toBe(leadingZeroes(milliseconds, 3));
});

test('test to get milliseconds', () => {
  expect(unitTestingTask('f', date)).toBe(milliseconds.toString());
});

test('test to get twelve time format uppercase', () => {
  expect(unitTestingTask('A', date)).analizeHourFormat(hour, true);
});

test('test to get twelve time format', () => {
  expect(unitTestingTask('a', date)).analizeHourFormat(hour);
});

test('test to get time zone in ISO8601-compatible basic format', () => {
  expect(unitTestingTask('ZZ', date)).getTimeZoneValue(date);
});

test('test to get time zone in ISO8601-compatible extended format', () => {
  expect(unitTestingTask('Z', date)).getTimeZoneValue(date, null, ':');
});


