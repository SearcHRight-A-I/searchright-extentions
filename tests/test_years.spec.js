const { mergePeriods, calculateTotalDuration } = require("../content.js");

describe("mergePeriods와 calculateTotalDuration 다양한 테스트", () => {
  // 테스트 케이스 1: 겹치지 않는 여러 개의 기간
  test("여러 개의 겹치지 않는 기간 병합 및 총 기간 계산", () => {
    const periods = [
      { start: { year: 2010, month: 1 }, end: { year: 2012, month: 5 } },
      { start: { year: 2013, month: 6 }, end: { year: 2015, month: 4 } },
      { start: { year: 2017, month: 2 }, end: { year: 2019, month: 12 } },
    ];
    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    const duration = calculateTotalDuration(merged);
    console.log("계산된 기간:", duration);
    expect(duration).toEqual({ years: 7, months: 3 });
  });

  // 테스트 케이스 2: 동일한 기간 여러 번 반복
  test("동일한 기간이 반복될 때 병합 처리", () => {
    const periods = [
      { start: { year: 2015, month: 1 }, end: { year: 2016, month: 12 } },
      { start: { year: 2015, month: 1 }, end: { year: 2016, month: 12 } },
      { start: { year: 2015, month: 1 }, end: { year: 2016, month: 12 } },
    ];
    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    const duration = calculateTotalDuration(merged);
    console.log("계산된 기간:", duration);
    expect(duration).toEqual({ years: 2, months: 0 });
  });

  // 테스트 케이스 3: 시작일만 있고 종료일이 없는 여러 기간
  test("여러 개의 시작일만 있는 경우 진행 중인 기간 처리", () => {
    const periods = [
      { start: { year: 2018, month: 3 } },
      { start: { year: 2020, month: 5 } },
      { start: { year: 2021, month: 8 } },
    ];
    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    const duration = calculateTotalDuration(merged);
    console.log("계산된 기간:", duration);
    expect(duration).toBeTruthy(); // 현재 날짜 기준으로 유동적인 결과
  });

  // 테스트 케이스 4: 빈 배열 입력
  test("빈 배열을 입력했을 때 빈 배열 반환", () => {
    const periods = [];
    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    expect(merged).toEqual([]);
  });

  // 테스트 케이스 5: 유효하지 않은 입력 데이터
  test("유효하지 않은 데이터가 포함된 경우 처리", () => {
    const periods = [
      null,
      { start: { year: 2021, month: 7 }, end: { year: 2022, month: 3 } },
      undefined,
      { start: { year: 2023, month: 1 } },
    ];
    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    const duration = calculateTotalDuration(merged);
    console.log("계산된 기간:", duration);
    expect(merged.length).toBeGreaterThan(0);
  });

  // 테스트 케이스 6: 매우 오래된 과거와 현재까지의 긴 기간
  test("긴 기간 동안의 병합 및 총 기간 계산", () => {
    const periods = [
      { start: { year: 1900, month: 1 }, end: { year: 1950, month: 12 } },
      { start: { year: 1960, month: 5 }, end: { year: 2000, month: 11 } },
      { start: { year: 2001, month: 1 } }, // 현재까지 진행 중
    ];
    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    const duration = calculateTotalDuration(merged);
    console.log("계산된 기간:", duration);
    expect(duration).toBeTruthy(); // 결과는 현재 날짜에 따라 다를 수 있음
  });

  // 테스트 케이스 7: 단일 월만 포함된 기간
  test("한 달만 포함된 기간 병합 및 계산", () => {
    const periods = [
      { start: { year: 2022, month: 5 }, end: { year: 2022, month: 5 } },
    ];
    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    const duration = calculateTotalDuration(merged);
    console.log("계산된 기간:", duration);
    expect(duration).toEqual({ years: 0, months: 1 });
  });

  test("연속된 기간 병합 및 총 기간 계산", () => {
    const periods = [
      { start: { year: 2015, month: 1 }, end: { year: 2015, month: 12 } },
      { start: { year: 2016, month: 1 }, end: { year: 2016, month: 12 } },
    ];
    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    const duration = calculateTotalDuration(merged);
    console.log("계산된 기간:", duration);
    expect(duration).toEqual({ years: 2, months: 0 });
  });

  test("중첩된 기간 병합 및 총 기간 계산", () => {
    const periods = [
      { start: { year: 2018, month: 1 }, end: { year: 2019, month: 6 } },
      { start: { year: 2019, month: 1 }, end: { year: 2020, month: 12 } },
    ];
    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    const duration = calculateTotalDuration(merged);
    console.log("계산된 기간:", duration);
    expect(duration).toEqual({ years: 3, months: 0 });
  });

  test("단일 기간 병합 및 총 기간 계산", () => {
    const periods = [
      { start: { year: 2020, month: 1 }, end: { year: 2021, month: 6 } },
    ];
    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    const duration = calculateTotalDuration(merged);
    console.log("계산된 기간:", duration);
    expect(duration).toEqual({ years: 1, months: 6 });
  });

  test("연도가 다른 동일 월의 기간 병합 및 계산", () => {
    const periods = [
      { start: { year: 2021, month: 5 }, end: { year: 2021, month: 8 } },
      { start: { year: 2022, month: 5 }, end: { year: 2022, month: 8 } },
    ];
    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    const duration = calculateTotalDuration(merged);
    console.log("계산된 기간:", duration);
    expect(duration).toEqual({ years: 0, months: 8 });
  });

  test("비정상적인 순서의 데이터 병합 및 총 기간 계산", () => {
    const periods = [
      { start: { year: 2019, month: 5 }, end: { year: 2020, month: 4 } },
      { start: { year: 2018, month: 7 }, end: { year: 2019, month: 4 } },
    ];
    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    const duration = calculateTotalDuration(merged);
    console.log("계산된 기간:", duration);
    expect(duration).toEqual({ years: 1, months: 10 });
  });

  // 테스트 케이스 13: 시작 년도만 있는 경우 현재까지의 기간 계산
  test("시작 년도만 있는 경우 현재까지의 기간 계산", () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1

    const periods = [{ start: { year: 2019 } }, { start: { year: 2021 } }];
    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    const duration = calculateTotalDuration(merged);
    console.log("계산된 기간:", duration);

    // 첫 번째 기간의 예상 계산
    const startYear1 = 2019;
    const expectedYears1 = currentYear - startYear1;
    const expectedMonths1 = currentMonth - 1; // 시작 월이 1월이므로 0이 됩니다.

    // 두 번째 기간의 예상 계산
    const startYear2 = 2021;
    const expectedYears2 = currentYear - startYear2;
    const expectedMonths2 = currentMonth - 1;

    // 예상 총 기간 계산
    const totalExpectedMonths = expectedYears1 * 12 + expectedMonths1;
    const additionalExpectedMonths = expectedYears2 * 12 + expectedMonths2;
    const combinedTotalMonths = Math.max(
      totalExpectedMonths,
      additionalExpectedMonths
    );

    const combinedYears = Math.floor(combinedTotalMonths / 12);
    const combinedMonths = combinedTotalMonths % 12;

    expect(duration).toEqual({
      years: combinedYears,
      months: combinedMonths + 1, // 시작월 포함해서 1월+
    });
  });

  // 테스트 케이스 14: 시작과 끝이 모두 년도로만 있는 경우 기간 계산
  test("시작과 끝이 모두 년도로만 있는 경우 기간 계산", () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1

    const periods = [
      { start: { year: 2015 }, end: { year: 2017 } },
      { start: { year: 2018 }, end: { year: 2020 } },
      { start: { year: 2021 } }, // 현재까지 진행 중인 기간
    ];

    const merged = mergePeriods(periods);
    console.log("병합된 기간:", merged);
    const duration = calculateTotalDuration(merged);
    console.log("계산된 기간:", duration);

    // 현재 날짜 기준으로 총 기간 계산
    const expectedYears = currentYear - 2015;
    const expectedMonths = ((currentMonth - 1) % 12) + 1;

    expect(duration).toEqual({ years: expectedYears, months: expectedMonths });
  });
});
