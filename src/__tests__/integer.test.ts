import { describe, it, expect } from 'vitest';
import { Int } from '../integer';

describe('Int', () => {
  describe('construction', () => {
    it('should create from number', () => {
      const x = Int(42);
      expect(x.toNumber()).toBe(42);
    });

    it('should create from bigint', () => {
      const x = Int(42n);
      expect(x.toBigInt()).toBe(42n);
    });

    it('should create from string', () => {
      const x = Int('999999999999999999');
      expect(x.toString()).toBe('999999999999999999');
    });

    it('should create from another Int', () => {
      const x = Int(42);
      const y = Int(x);
      expect(y.toNumber()).toBe(42);
    });

    it('should truncate decimals from numbers', () => {
      expect(Int(42.7).toNumber()).toBe(42);
      expect(Int(-42.7).toNumber()).toBe(-42);
      expect(Int(0.9).toNumber()).toBe(0);
    });
  });

  describe('arithmetic operations', () => {
    it('should add integers', () => {
      expect(Int(5).add(3).toNumber()).toBe(8);
      expect(Int(10).add(-5).toNumber()).toBe(5);
      expect(Int(-5).add(-3).toNumber()).toBe(-8);
    });

    it('should subtract integers', () => {
      expect(Int(10).subtract(3).toNumber()).toBe(7);
      expect(Int(5).subtract(10).toNumber()).toBe(-5);
      expect(Int(-5).subtract(3).toNumber()).toBe(-8);
    });

    it('should multiply integers', () => {
      expect(Int(5).multiply(3).toNumber()).toBe(15);
      expect(Int(-5).multiply(3).toNumber()).toBe(-15);
      expect(Int(-5).multiply(-3).toNumber()).toBe(15);
    });

    it('should divide integers', () => {
      expect(Int(10).divide(2).toNumber()).toBe(5);
      expect(Int(10).divide(3).toNumber()).toBe(3); // Truncates
      expect(Int(-10).divide(3).toNumber()).toBe(-3);
    });

    it('should calculate modulo', () => {
      expect(Int(10).mod(3).toNumber()).toBe(1);
      expect(Int(10).mod(5).toNumber()).toBe(0);
      expect(Int(-10).mod(3).toNumber()).toBe(-1);
    });

    it('should calculate power', () => {
      expect(Int(2).pow(3).toNumber()).toBe(8);
      expect(Int(10).pow(0).toNumber()).toBe(1);
      expect(Int(5).pow(2).toNumber()).toBe(25);
    });

    it('should throw on negative exponent', () => {
      expect(() => Int(2).pow(-1)).toThrow(RangeError);
    });

    it('should handle very large numbers', () => {
      const large = Int('999999999999999999');
      const result = large.add(1);
      expect(result.toString()).toBe('1000000000000000000');
    });
  });

  describe('unary operations', () => {
    it('should calculate absolute value', () => {
      expect(Int(5).abs().toNumber()).toBe(5);
      expect(Int(-5).abs().toNumber()).toBe(5);
      expect(Int(0).abs().toNumber()).toBe(0);
    });

    it('should negate', () => {
      expect(Int(5).negate().toNumber()).toBe(-5);
      expect(Int(-5).negate().toNumber()).toBe(5);
      expect(Int(0).negate().toNumber()).toBe(0);
    });
  });

  describe('comparisons', () => {
    it('should check equality', () => {
      expect(Int(5).equals(5)).toBe(true);
      expect(Int(5).equals(3)).toBe(false);
      expect(Int(-5).equals(-5)).toBe(true);
    });

    it('should compare less than', () => {
      expect(Int(3).lt(5)).toBe(true);
      expect(Int(5).lt(3)).toBe(false);
      expect(Int(5).lt(5)).toBe(false);
    });

    it('should compare less than or equal', () => {
      expect(Int(3).lte(5)).toBe(true);
      expect(Int(5).lte(5)).toBe(true);
      expect(Int(5).lte(3)).toBe(false);
    });

    it('should compare greater than', () => {
      expect(Int(5).gt(3)).toBe(true);
      expect(Int(3).gt(5)).toBe(false);
      expect(Int(5).gt(5)).toBe(false);
    });

    it('should compare greater than or equal', () => {
      expect(Int(5).gte(3)).toBe(true);
      expect(Int(5).gte(5)).toBe(true);
      expect(Int(3).gte(5)).toBe(false);
    });

    it('should work with different input types', () => {
      const x = Int(10);
      expect(x.equals(10)).toBe(true);
      expect(x.equals(10n)).toBe(true);
      expect(x.equals('10')).toBe(true);
      expect(x.equals(Int(10))).toBe(true);
    });
  });

  describe('predicates', () => {
    it('should check if zero', () => {
      expect(Int(0).isZero()).toBe(true);
      expect(Int(5).isZero()).toBe(false);
      expect(Int(-5).isZero()).toBe(false);
    });

    it('should check if positive', () => {
      expect(Int(5).isPositive()).toBe(true);
      expect(Int(0).isPositive()).toBe(false);
      expect(Int(-5).isPositive()).toBe(false);
    });

    it('should check if negative', () => {
      expect(Int(-5).isNegative()).toBe(true);
      expect(Int(0).isNegative()).toBe(false);
      expect(Int(5).isNegative()).toBe(false);
    });

    it('should check if even', () => {
      expect(Int(4).isEven()).toBe(true);
      expect(Int(0).isEven()).toBe(true);
      expect(Int(-4).isEven()).toBe(true);
      expect(Int(5).isEven()).toBe(false);
    });

    it('should check if odd', () => {
      expect(Int(5).isOdd()).toBe(true);
      expect(Int(-5).isOdd()).toBe(true);
      expect(Int(4).isOdd()).toBe(false);
      expect(Int(0).isOdd()).toBe(false);
    });

    it('should get sign', () => {
      expect(Int(5).sign()).toBe(1);
      expect(Int(-5).sign()).toBe(-1);
      expect(Int(0).sign()).toBe(0);
    });
  });

  describe('conversions', () => {
    it('should convert to number', () => {
      expect(Int(42).toNumber()).toBe(42);
      expect(Int(-42).toNumber()).toBe(-42);
    });

    it('should convert to bigint', () => {
      expect(Int(42).toBigInt()).toBe(42n);
      expect(Int('999999999999999999').toBigInt()).toBe(999999999999999999n);
    });

    it('should convert to string', () => {
      expect(Int(42).toString()).toBe('42');
      expect(Int(-42).toString()).toBe('-42');
      expect(Int('999999999999999999').toString()).toBe('999999999999999999');
    });

    it('should convert to string with radix', () => {
      expect(Int(255).toString(16)).toBe('ff');
      expect(Int(8).toString(2)).toBe('1000');
      expect(Int(100).toString(8)).toBe('144');
    });

    it('should convert to JSON', () => {
      expect(Int(42).toJSON()).toBe('42');
      expect(JSON.stringify({ value: Int(42) })).toBe('{"value":"42"}');
    });

    it('should valueOf', () => {
      expect(Int(42).valueOf()).toBe(42n);
    });
  });

  describe('chaining', () => {
    it('should chain operations', () => {
      const result = Int(10)
        .add(5)
        .multiply(2)
        .subtract(10)
        .divide(2);

      expect(result.toNumber()).toBe(10);
    });

    it('should work with complex expressions', () => {
      const result = Int(2)
        .pow(10)
        .add(100)
        .divide(3);

      expect(result.toNumber()).toBe(374); // (1024 + 100) / 3 = 374
    });
  });

  describe('edge cases', () => {
    it('should handle zero', () => {
      expect(Int(0).add(0).toNumber()).toBe(0);
      expect(Int(0).multiply(100).toNumber()).toBe(0);
      expect(Int(5).multiply(0).toNumber()).toBe(0);
    });

    it('should handle one', () => {
      expect(Int(5).multiply(1).toNumber()).toBe(5);
      expect(Int(5).divide(1).toNumber()).toBe(5);
    });

    it('should throw on division by zero', () => {
      expect(() => Int(10).divide(0)).toThrow();
    });

    it('should handle MAX_SAFE_INTEGER boundaries', () => {
      const max = Int(Number.MAX_SAFE_INTEGER);
      const result = max.add(1);
      expect(result.toString()).toBe('9007199254740992');
    });

    it('should handle MySQL BIGINT range (19 digits)', () => {
      // MySQL unsigned BIGINT max: 18446744073709551615
      const mysqlMax = Int('18446744073709551615');
      expect(mysqlMax.toString()).toBe('18446744073709551615');

      const result = mysqlMax.add(1);
      expect(result.toString()).toBe('18446744073709551616');
    });

    it('should handle numbers beyond JavaScript number range', () => {
      const huge = Int('99999999999999999999999999999999');
      const result = huge.multiply(2);
      expect(result.toString()).toBe('199999999999999999999999999999998');
    });
  });
});
