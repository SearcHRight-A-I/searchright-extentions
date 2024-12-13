const { mergePeriods, calculateTotalDuration } = require("../content.js");

describe("기간 병합과 총 기간 계산 테스트", () => {
  // 테스트에 사용할 고정 날짜 설정
  const 고정날짜 = new Date("2024-12-13");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(고정날짜);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("기본 기간 계산", () => {
    test("서로 다른 기간들이 주어졌을 때 정확한 기간이 계산되어야 함", () => {
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

    test("동일한 기간이 여러 번 입력되었을 때 중복 제거 후 정확한 기간이 계산되어야 함", () => {
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
  });

  describe("특수한 기간 계산", () => {
    test("종료일이 없는 진행 중인 기간들의 정확한 계산", () => {
      const periods = [
        { start: { year: 2018, month: 3 } },
        { start: { year: 2020, month: 5 } },
        { start: { year: 2021, month: 8 } },
      ];
      const merged = mergePeriods(periods);
      console.log("병합된 기간:", merged);
      const duration = calculateTotalDuration(merged);
      console.log("계산된 기간:", duration);
      // 2024년 12월 13일 기준으로 계산
      expect(duration).toEqual({ years: 6, months: 10 });
    });

    test("빈 배열이 입력되었을 때 빈 배열이 반환되어야 함", () => {
      const periods = [];
      const merged = mergePeriods(periods);
      console.log("병합된 기간:", merged);
      expect(merged).toEqual([]);
      const duration = calculateTotalDuration(merged);
      expect(duration).toEqual({ years: 0, months: 0 });
    });

    test("유효하지 않은 데이터가 포함되었을 때 유효한 데이터만 계산되어야 함", () => {
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
      // 2024년 12월 13일 기준으로 계산
      expect(duration).toEqual({ years: 2, months: 9 });
    });
  });

  describe("복잡한 기간 계산", () => {
    test("매우 긴 기간의 정확한 계산", () => {
      const periods = [
        { start: { year: 1900, month: 1 }, end: { year: 1950, month: 12 } },
        { start: { year: 1960, month: 5 }, end: { year: 2000, month: 11 } },
        { start: { year: 2001, month: 1 } },
      ];
      const merged = mergePeriods(periods);
      console.log("병합된 기간:", merged);
      const duration = calculateTotalDuration(merged);
      console.log("계산된 기간:", duration);
      // 2024년 12월 13일 기준으로 계산
      expect(duration).toEqual({ years: 115, months: 7 });
    });

    test("한 달만 포함된 기간의 정확한 계산", () => {
      const periods = [
        { start: { year: 2022, month: 5 }, end: { year: 2022, month: 5 } },
      ];
      const merged = mergePeriods(periods);
      console.log("병합된 기간:", merged);
      const duration = calculateTotalDuration(merged);
      console.log("계산된 기간:", duration);
      expect(duration).toEqual({ years: 0, months: 1 });
    });

    test("연속된 기간의 정확한 계산", () => {
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

    test("중첩된 기간의 정확한 계산", () => {
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
  });

  describe("연도 기반 계산", () => {
    test("시작 연도만 있는 경우의 정확한 계산", () => {
      const periods = [{ start: { year: 2019 } }, { start: { year: 2021 } }];
      const merged = mergePeriods(periods);
      console.log("병합된 기간:", merged);
      const duration = calculateTotalDuration(merged);
      console.log("계산된 기간:", duration);
      // 2024년 12월 13일 기준으로 계산
      expect(duration).toEqual({ years: 6, months: 0 });
    });

    test("시작과 끝이 연도로만 주어진 경우의 정확한 계산", () => {
      const periods = [
        { start: { year: 2015 }, end: { year: 2017 } },
        { start: { year: 2018 }, end: { year: 2020 } },
        { start: { year: 2021 } },
      ];
      const merged = mergePeriods(periods);
      console.log("병합된 기간:", merged);
      const duration = calculateTotalDuration(merged);
      console.log("계산된 기간:", duration);
      // 2024년 12월 13일 기준으로 계산
      expect(duration).toEqual({ years: 10, months: 0 });
    });
  });
});
