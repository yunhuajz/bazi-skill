declare module 'lunar-javascript' {
  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;

    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    getSecond(): number;

    getLunar(): Lunar;

    toString(): string;
    toFullString(): string;
  }

  export class Lunar {
    static fromYmd(year: number, month: number, day: number): Lunar;
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Lunar;

    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    getSecond(): number;

    getSolar(): Solar;
    getLeapMonth(): number;
    getDaysInMonth(): number;

    toString(): string;
    toFullString(): string;
  }

  export class LunarYear {
    static fromYear(year: number): LunarYear;
    getLeapMonth(): number;
  }

  export class EightChar {
    static fromLunar(lunar: Lunar): EightChar;
    static fromSolar(solar: Solar): EightChar;

    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;

    getYearGanZhi(): string;
    getMonthGanZhi(): string;
    getDayGanZhi(): string;
    getTimeGanZhi(): string;

    toString(): string;
  }

  export class Foto {
    static fromLunar(lunar: Lunar): Foto;
    static fromSolar(solar: Solar): Foto;
  }

  export class Tao {
    static fromLunar(lunar: Lunar): Tao;
    static fromSolar(solar: Solar): Tao;
  }

  export class NineStar {
    static fromLunar(lunar: Lunar): NineStar;
    static fromSolar(solar: Solar): NineStar;
  }

  export class SolarWeek {
    static fromYmd(year: number, month: number, day: number, start: number): SolarWeek;
  }

  export class SolarMonth {
    static fromYm(year: number, month: number): SolarMonth;
  }

  export class SolarSeason {
    static fromYm(year: number, month: number): SolarSeason;
  }

  export class SolarHalfYear {
    static fromYm(year: number, month: number): SolarHalfYear;
  }

  export class SolarYear {
    static fromYear(year: number): SolarYear;
  }

  export class LunarMonth {
    static fromYm(year: number, month: number): LunarMonth;
  }

  export class LunarTime {
    static fromLunar(lunar: Lunar, hour: number, minute: number, second: number): LunarTime;
  }

  export const SolarUtil: {
    getDaysOfMonth(year: number, month: number): number;
    getDaysOfYear(year: number): number;
    getLeapMonth(year: number): number;
    isLeapYear(year: number): boolean;
  };

  export const LunarUtil: {
    getDaysOfMonth(year: number, month: number, leap: boolean): number;
  };

  export const ShouXingUtil: {
    // 寿星天文历工具
  };

  export const FotoUtil: {
    // 佛历工具
  };

  export const TaoUtil: {
    // 道历工具
  };

  export const NineStarUtil: {
    // 九星工具
  };

  export const HolidayUtil: {
    // 节假日工具
    getHoliday(year: number, month: number, day: number): string | null;
  };

  export const I18n: {
    setLanguage(lang: string): void;
    getLanguage(): string;
  };
}
