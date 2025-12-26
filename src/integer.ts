/**
 * Integer type with primitive-like API for safe integer operations
 * Uses BigInt internally for arbitrary precision
 */
class IntValue {
  private readonly value: bigint;

  constructor(value: number | bigint | string | IntValue) {
    if (value instanceof IntValue) {
      this.value = value.value;
    } else if (typeof value === 'bigint') {
      this.value = value;
    } else if (typeof value === 'string') {
      this.value = BigInt(value);
    } else {
      // Convert number to bigint, truncating decimals
      this.value = BigInt(Math.trunc(value));
    }
  }

  /**
   * Addition
   */
  add(other: number | bigint | string | IntValue): IntValue {
    return new IntValue(this.value + IntValue.toBigInt(other));
  }

  /**
   * Subtraction
   */
  subtract(other: number | bigint | string | IntValue): IntValue {
    return new IntValue(this.value - IntValue.toBigInt(other));
  }

  /**
   * Multiplication
   */
  multiply(other: number | bigint | string | IntValue): IntValue {
    return new IntValue(this.value * IntValue.toBigInt(other));
  }

  /**
   * Division (integer division, truncates toward zero)
   */
  divide(other: number | bigint | string | IntValue): IntValue {
    return new IntValue(this.value / IntValue.toBigInt(other));
  }

  /**
   * Modulo
   */
  mod(other: number | bigint | string | IntValue): IntValue {
    return new IntValue(this.value % IntValue.toBigInt(other));
  }

  /**
   * Power
   */
  pow(exponent: number | bigint | string | IntValue): IntValue {
    const exp = IntValue.toBigInt(exponent);
    if (exp < 0n) {
      throw new RangeError('Exponent must be non-negative');
    }
    return new IntValue(this.value ** exp);
  }

  /**
   * Absolute value
   */
  abs(): IntValue {
    return new IntValue(this.value < 0n ? -this.value : this.value);
  }

  /**
   * Negation
   */
  negate(): IntValue {
    return new IntValue(-this.value);
  }

  /**
   * Comparison: equals
   */
  equals(other: number | bigint | string | IntValue): boolean {
    return this.value === IntValue.toBigInt(other);
  }

  /**
   * Comparison: less than
   */
  lt(other: number | bigint | string | IntValue): boolean {
    return this.value < IntValue.toBigInt(other);
  }

  /**
   * Comparison: less than or equal
   */
  lte(other: number | bigint | string | IntValue): boolean {
    return this.value <= IntValue.toBigInt(other);
  }

  /**
   * Comparison: greater than
   */
  gt(other: number | bigint | string | IntValue): boolean {
    return this.value > IntValue.toBigInt(other);
  }

  /**
   * Comparison: greater than or equal
   */
  gte(other: number | bigint | string | IntValue): boolean {
    return this.value >= IntValue.toBigInt(other);
  }

  /**
   * Check if zero
   */
  isZero(): boolean {
    return this.value === 0n;
  }

  /**
   * Check if positive (> 0)
   */
  isPositive(): boolean {
    return this.value > 0n;
  }

  /**
   * Check if negative (< 0)
   */
  isNegative(): boolean {
    return this.value < 0n;
  }

  /**
   * Check if even
   */
  isEven(): boolean {
    return this.value % 2n === 0n;
  }

  /**
   * Check if odd
   */
  isOdd(): boolean {
    return this.value % 2n !== 0n;
  }

  /**
   * Get sign (-1, 0, or 1)
   */
  sign(): number {
    if (this.value > 0n) return 1;
    if (this.value < 0n) return -1;
    return 0;
  }

  /**
   * Convert to number (may lose precision for large values)
   */
  toNumber(): number {
    return Number(this.value);
  }

  /**
   * Convert to BigInt
   */
  toBigInt(): bigint {
    return this.value;
  }

  /**
   * Convert to string
   */
  toString(radix?: number): string {
    if (radix === undefined) {
      return this.value.toString();
    }
    return this.value.toString(radix);
  }

  /**
   * Convert to JSON
   */
  toJSON(): string {
    return this.toString();
  }

  /**
   * Value for primitive conversion
   */
  valueOf(): bigint {
    return this.value;
  }

  /**
   * Helper: convert various types to bigint
   */
  private static toBigInt(value: number | bigint | string | IntValue): bigint {
    if (value instanceof IntValue) {
      return value.value;
    }
    if (typeof value === 'bigint') {
      return value;
    }
    if (typeof value === 'string') {
      return BigInt(value);
    }
    return BigInt(Math.trunc(value));
  }
}

/**
 * Integer type alias
 */
export type Int = IntValue;

/**
 * Factory function for creating Int instances (feels more primitive-like)
 *
 * @example
 * const a = Int(42);
 * const b = Int(8);
 * a.add(b);        // Int(50)
 * a.multiply(b);   // Int(336)
 * a.toString();    // "42"
 * a.toNumber();    // 42
 *
 * @example
 * // Works like a primitive
 * Int(10).pow(100).toString(); // Very large number
 */
export function Int(value: number | bigint | string | Int): Int {
  return new IntValue(value);
}
