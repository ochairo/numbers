import { describe, it, expect } from 'vitest';
import { Decimal } from '../decimal';

describe('Decimal', () => {
  describe('construction', () => {
    it('should create from number', () => {
      const x = Decimal(0.5);
      expect(x.toNumber()).toBe(0.5);
    });

    it('should create from string', () => {
      const x = Decimal('0.1');
      expect(x.toString()).toBe('0.1');
    });

    it('should create from another Decimal', () => {
      const x = Decimal('0.5');
      const y = Decimal(x);
      expect(y.toString()).toBe('0.5');
    });

    it('should handle integers', () => {
      expect(Decimal(42).toString()).toBe('42');
      expect(Decimal('100').toString()).toBe('100');
    });
  });

  describe('precision issues', () => {
    it('should solve 0.1 + 0.2 problem', () => {
      const result = Decimal('0.1').add('0.2');
      expect(result.toString()).toBe('0.3');
    });

    it('should handle precise multiplication', () => {
      const result = Decimal('0.1').multiply('0.1');
      expect(result.toString()).toBe('0.01');
    });

    it('should handle precise division', () => {
      const result = Decimal('1').divide('3', 10);
      expect(result.toString()).toBe('0.3333333333');
    });
  });

  describe('arithmetic operations', () => {
    it('should add decimals', () => {
      expect(Decimal('1.5').add('2.3').toString()).toBe('3.8');
      expect(Decimal('10.25').add('5.75').toString()).toBe('16');
      expect(Decimal('-1.5').add('0.5').toString()).toBe('-1');
    });

    it('should subtract decimals', () => {
      expect(Decimal('5.5').subtract('2.3').toString()).toBe('3.2');
      expect(Decimal('10').subtract('5.5').toString()).toBe('4.5');
      expect(Decimal('1.5').subtract('2.5').toString()).toBe('-1');
    });

    it('should multiply decimals', () => {
      expect(Decimal('2.5').multiply('2').toString()).toBe('5');
      expect(Decimal('1.5').multiply('1.5').toString()).toBe('2.25');
      expect(Decimal('-2.5').multiply('2').toString()).toBe('-5');
    });

    it('should divide decimals', () => {
      expect(Decimal('10').divide('2').toString()).toBe('5');
      expect(Decimal('1').divide('2').toString()).toBe('0.5');
      expect(Decimal('10').divide('3', 5).toString()).toBe('3.33333');
    });

    it('should throw on division by zero', () => {
      expect(() => Decimal('10').divide('0')).toThrow(RangeError);
    });

    it('should handle mixed input types', () => {
      const x = Decimal('5.5');
      expect(x.add(2.5).toString()).toBe('8');
      expect(x.subtract(1.5).toString()).toBe('4');
      expect(x.multiply(2).toString()).toBe('11');
    });
  });

  describe('unary operations', () => {
    it('should calculate absolute value', () => {
      expect(Decimal('5.5').abs().toString()).toBe('5.5');
      expect(Decimal('-5.5').abs().toString()).toBe('5.5');
      expect(Decimal('0').abs().toString()).toBe('0');
    });

    it('should negate', () => {
      expect(Decimal('5.5').negate().toString()).toBe('-5.5');
      expect(Decimal('-5.5').negate().toString()).toBe('5.5');
      expect(Decimal('0').negate().toString()).toBe('0');
    });
  });

  describe('rounding', () => {
    it('should round to decimal places', () => {
      expect(Decimal('3.14159').round(2).toString()).toBe('3.14');
      expect(Decimal('3.14559').round(2).toString()).toBe('3.15');
      expect(Decimal('3.5').round(0).toString()).toBe('4');
    });

    it('should floor', () => {
      expect(Decimal('3.7').floor().toString()).toBe('3');
      expect(Decimal('-3.7').floor().toString()).toBe('-4');
      expect(Decimal('5').floor().toString()).toBe('5');
    });

    it('should ceil', () => {
      expect(Decimal('3.2').ceil().toString()).toBe('4');
      expect(Decimal('-3.2').ceil().toString()).toBe('-3');
      expect(Decimal('5').ceil().toString()).toBe('5');
    });
  });

  describe('comparisons', () => {
    it('should check equality', () => {
      expect(Decimal('5.5').equals('5.5')).toBe(true);
      expect(Decimal('5.5').equals('5.50')).toBe(true);
      expect(Decimal('5.5').equals('3.2')).toBe(false);
    });

    it('should compare less than', () => {
      expect(Decimal('3.5').lt('5.5')).toBe(true);
      expect(Decimal('5.5').lt('3.5')).toBe(false);
      expect(Decimal('5.5').lt('5.5')).toBe(false);
    });

    it('should compare less than or equal', () => {
      expect(Decimal('3.5').lte('5.5')).toBe(true);
      expect(Decimal('5.5').lte('5.5')).toBe(true);
      expect(Decimal('5.5').lte('3.5')).toBe(false);
    });

    it('should compare greater than', () => {
      expect(Decimal('5.5').gt('3.5')).toBe(true);
      expect(Decimal('3.5').gt('5.5')).toBe(false);
      expect(Decimal('5.5').gt('5.5')).toBe(false);
    });

    it('should compare greater than or equal', () => {
      expect(Decimal('5.5').gte('3.5')).toBe(true);
      expect(Decimal('5.5').gte('5.5')).toBe(true);
      expect(Decimal('3.5').gte('5.5')).toBe(false);
    });

    it('should work with different scales', () => {
      expect(Decimal('5').equals('5.0')).toBe(true);
      expect(Decimal('5.50').equals('5.5')).toBe(true);
      expect(Decimal('0.1').add('0.2').equals('0.3')).toBe(true);
    });
  });

  describe('predicates', () => {
    it('should check if zero', () => {
      expect(Decimal('0').isZero()).toBe(true);
      expect(Decimal('0.0').isZero()).toBe(true);
      expect(Decimal('5.5').isZero()).toBe(false);
      expect(Decimal('-5.5').isZero()).toBe(false);
    });

    it('should check if positive', () => {
      expect(Decimal('5.5').isPositive()).toBe(true);
      expect(Decimal('0.1').isPositive()).toBe(true);
      expect(Decimal('0').isPositive()).toBe(false);
      expect(Decimal('-5.5').isPositive()).toBe(false);
    });

    it('should check if negative', () => {
      expect(Decimal('-5.5').isNegative()).toBe(true);
      expect(Decimal('-0.1').isNegative()).toBe(true);
      expect(Decimal('0').isNegative()).toBe(false);
      expect(Decimal('5.5').isNegative()).toBe(false);
    });

    it('should get sign', () => {
      expect(Decimal('5.5').sign()).toBe(1);
      expect(Decimal('-5.5').sign()).toBe(-1);
      expect(Decimal('0').sign()).toBe(0);
    });
  });

  describe('conversions', () => {
    it('should convert to number', () => {
      expect(Decimal('42.5').toNumber()).toBe(42.5);
      expect(Decimal('-3.14').toNumber()).toBeCloseTo(-3.14);
    });

    it('should convert to string', () => {
      expect(Decimal('42.5').toString()).toBe('42.5');
      expect(Decimal('-3.14').toString()).toBe('-3.14');
      expect(Decimal('100').toString()).toBe('100');
    });

    it('should remove trailing zeros', () => {
      expect(Decimal('5.00').toString()).toBe('5');
      expect(Decimal('3.140').toString()).toBe('3.14');
      expect(Decimal('0.10').toString()).toBe('0.1');
    });

    it('should convert to JSON', () => {
      expect(Decimal('42.5').toJSON()).toBe('42.5');
      expect(JSON.stringify({ value: Decimal('3.14') })).toBe('{"value":"3.14"}');
    });

    it('should valueOf', () => {
      expect(Decimal('42.5').valueOf()).toBe(42.5);
    });
  });

  describe('chaining', () => {
    it('should chain operations', () => {
      const result = Decimal('10')
        .add('5')
        .multiply('2')
        .subtract('10')
        .divide('2');

      expect(result.toString()).toBe('10');
    });

    it('should work with complex expressions', () => {
      const result = Decimal('100')
        .multiply('0.15')
        .add('50')
        .divide('2');

      expect(result.toString()).toBe('32.5');
    });
  });

  describe('edge cases', () => {
    it('should handle zero', () => {
      expect(Decimal('0').add('0').toString()).toBe('0');
      expect(Decimal('0').multiply('100').toString()).toBe('0');
      expect(Decimal('5.5').multiply('0').toString()).toBe('0');
    });

    it('should handle very small decimals', () => {
      const small = Decimal('0.00000001');
      expect(small.toString()).toBe('0.00000001');
      expect(small.multiply('2').toString()).toBe('0.00000002');
    });

    it('should handle large decimals', () => {
      const large = Decimal('999999999999.999999');
      expect(large.add('0.000001').toString()).toBe('1000000000000');
    });

    it('should handle negative zero', () => {
      const result = Decimal('0').negate();
      expect(result.toString()).toBe('0');
      expect(result.isZero()).toBe(true);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle currency calculations', () => {
      const price = Decimal('19.99');
      const tax = Decimal('0.08');
      const total = price.multiply(tax.add('1'));

      expect(total.round(2).toString()).toBe('21.59');
    });

    it('should handle percentage calculations', () => {
      const amount = Decimal('1000');
      const rate = Decimal('0.025');
      const interest = amount.multiply(rate);

      expect(interest.toString()).toBe('25');
    });

    it('should handle financial calculations without rounding errors', () => {
      // Calculate 10% discount on $9.99
      const price = Decimal('9.99');
      const discount = price.multiply('0.1');
      const final = price.subtract(discount);

      expect(final.round(2).toString()).toBe('8.99');
    });
  });
});
