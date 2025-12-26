/**
 * Decimal type with primitive-like API for precise decimal arithmetic
 * Avoids floating-point precision issues
 */
class DecimalValue {
  private readonly value: bigint;
  private readonly scale: number;
  private static readonly DEFAULT_PRECISION = 20;

  constructor(value: number | string | DecimalValue, scale?: number) {
    if (value instanceof DecimalValue) {
      this.value = value.value;
      this.scale = value.scale;
      return;
    }

    const str = typeof value === 'number' ? value.toString() : value;
    const parts = str.split('.');
    const integerPart = parts[0] ?? '0';
    const fractionalPart = parts[1] ?? '';

    if (scale !== undefined) {
      this.scale = scale;
    } else {
      this.scale = fractionalPart.length;
    }

    // Pad or truncate fractional part to match scale
    const adjustedFractional = fractionalPart.padEnd(this.scale, '0').slice(0, this.scale);
    const combined = integerPart + adjustedFractional;
    this.value = BigInt(combined);
  }

  /**
   * Addition
   */
  add(other: number | string | DecimalValue): DecimalValue {
    const [a, b] = DecimalValue.alignScale(this, DecimalValue.from(other));
    const result = new DecimalValue('0', a.scale);
    (result as any).value = a.value + b.value;
    return result.normalize();
  }

  /**
   * Subtraction
   */
  subtract(other: number | string | DecimalValue): DecimalValue {
    const [a, b] = DecimalValue.alignScale(this, DecimalValue.from(other));
    const result = new DecimalValue('0', a.scale);
    (result as any).value = a.value - b.value;
    return result.normalize();
  }

  /**
   * Multiplication
   */
  multiply(other: number | string | DecimalValue): DecimalValue {
    const otherDec = DecimalValue.from(other);
    const result = new DecimalValue('0', this.scale + otherDec.scale);
    (result as any).value = this.value * otherDec.value;
    return result.normalize();
  }

  /**
   * Division
   */
  divide(other: number | string | DecimalValue, precision = DecimalValue.DEFAULT_PRECISION): DecimalValue {
    const otherDec = DecimalValue.from(other);
    if (otherDec.value === 0n) {
      throw new RangeError('Division by zero');
    }

    // Scale up the numerator for precision
    const scaleDiff = precision + this.scale - otherDec.scale;
    const scaledValue = this.value * (10n ** BigInt(scaleDiff));
    const resultValue = scaledValue / otherDec.value;

    const result = new DecimalValue('0', precision);
    (result as any).value = resultValue;
    return result.normalize();
  }

  /**
   * Absolute value
   */
  abs(): DecimalValue {
    if (this.value < 0n) {
      const result = new DecimalValue('0', this.scale);
      (result as any).value = -this.value;
      return result;
    }
    return this;
  }

  /**
   * Negation
   */
  negate(): DecimalValue {
    const result = new DecimalValue('0', this.scale);
    (result as any).value = -this.value;
    return result;
  }

  /**
   * Round to specified decimal places
   */
  round(decimalPlaces = 0): DecimalValue {
    if (decimalPlaces >= this.scale) {
      return this;
    }

    const divisor = 10n ** BigInt(this.scale - decimalPlaces);
    const quotient = this.value / divisor;
    const remainder = this.value % divisor;

    // Round half up
    const halfDivisor = divisor / 2n;
    const rounded = remainder >= halfDivisor ? quotient + 1n : quotient;

    const result = new DecimalValue('0', decimalPlaces);
    (result as any).value = rounded;
    return result;
  }

  /**
   * Floor (round down)
   */
  floor(): DecimalValue {
    const divisor = 10n ** BigInt(this.scale);
    const quotient = this.value / divisor;
    const remainder = this.value % divisor;

    // For negative numbers with remainder, subtract 1
    const floored = remainder !== 0n && this.value < 0n ? quotient - 1n : quotient;
    const result = new DecimalValue('0', 0);
    (result as any).value = floored;
    return result;
  }

  /**
   * Ceil (round up)
   */
  ceil(): DecimalValue {
    const divisor = 10n ** BigInt(this.scale);
    const quotient = this.value / divisor;
    const remainder = this.value % divisor;

    // For positive numbers with remainder, add 1
    const ceiled = remainder !== 0n && this.value > 0n ? quotient + 1n : quotient;
    const result = new DecimalValue('0', 0);
    (result as any).value = ceiled;
    return result;
  }

  /**
   * Comparison: equals
   */
  equals(other: number | string | DecimalValue): boolean {
    const [a, b] = DecimalValue.alignScale(this, DecimalValue.from(other));
    return a.value === b.value;
  }

  /**
   * Comparison: less than
   */
  lt(other: number | string | DecimalValue): boolean {
    const [a, b] = DecimalValue.alignScale(this, DecimalValue.from(other));
    return a.value < b.value;
  }

  /**
   * Comparison: less than or equal
   */
  lte(other: number | string | DecimalValue): boolean {
    const [a, b] = DecimalValue.alignScale(this, DecimalValue.from(other));
    return a.value <= b.value;
  }

  /**
   * Comparison: greater than
   */
  gt(other: number | string | DecimalValue): boolean {
    const [a, b] = DecimalValue.alignScale(this, DecimalValue.from(other));
    return a.value > b.value;
  }

  /**
   * Comparison: greater than or equal
   */
  gte(other: number | string | DecimalValue): boolean {
    const [a, b] = DecimalValue.alignScale(this, DecimalValue.from(other));
    return a.value >= b.value;
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
   * Get sign (-1, 0, or 1)
   */
  sign(): number {
    if (this.value > 0n) return 1;
    if (this.value < 0n) return -1;
    return 0;
  }

  /**
   * Convert to number (may lose precision)
   */
  toNumber(): number {
    return Number(this.toString());
  }

  /**
   * Convert to string
   */
  toString(): string {
    const str = this.value.toString();
    const isNegative = str.startsWith('-');
    const absStr = isNegative ? str.slice(1) : str;

    if (this.scale === 0) {
      return str;
    }

    const padded = absStr.padStart(this.scale + 1, '0');
    const integerPart = padded.slice(0, -this.scale) || '0';
    const fractionalPart = padded.slice(-this.scale);

    // Remove trailing zeros
    const trimmedFractional = fractionalPart.replace(/0+$/, '');

    if (trimmedFractional === '') {
      return (isNegative ? '-' : '') + integerPart;
    }

    return (isNegative ? '-' : '') + integerPart + '.' + trimmedFractional;
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
  valueOf(): number {
    return this.toNumber();
  }

  /**
   * Normalize: remove trailing zeros from scale
   */
  private normalize(): DecimalValue {
    if (this.scale === 0 || this.value === 0n) {
      return this;
    }

    let newValue = this.value;
    let newScale = this.scale;

    while (newScale > 0 && newValue % 10n === 0n) {
      newValue /= 10n;
      newScale--;
    }

    if (newScale === this.scale) {
      return this;
    }

    const result = new DecimalValue('0', newScale);
    (result as any).value = newValue;
    return result;
  }

  /**
   * Helper: convert to Decimal
   */
  private static from(value: number | string | DecimalValue): DecimalValue {
    return value instanceof Decimal ? value : new DecimalValue(value);
  }

  /**
   * Helper: align two decimals to the same scale
   */
  private static alignScale(a: DecimalValue, b: DecimalValue): [Decimal, Decimal] {
    if (a.scale === b.scale) {
      return [a, b];
    }

    if (a.scale > b.scale) {
      const factor = 10n ** BigInt(a.scale - b.scale);
      const alignedB = new DecimalValue('0', a.scale);
      (alignedB as any).value = b.value * factor;
      return [a, alignedB];
    }

    const factor = 10n ** BigInt(b.scale - a.scale);
    const alignedA = new DecimalValue('0', b.scale);
    (alignedA as any).value = a.value * factor;
    return [alignedA, b];
  }
}

/**
 * Decimal type alias
 */
export type Decimal = DecimalValue;

/**
 * Factory function for creating Decimal instances (feels more primitive-like)
 *
 * @example
 * const a = Decimal("0.1");
 * const b = Decimal("0.2");
 * a.add(b).toString();  // "0.3" (not 0.30000000000000004)
 *
 * @example
 * // Works like a primitive
 * Decimal(10.5).multiply(3).toString(); // "31.5"
 */
export function Decimal(value: number | string | Decimal): Decimal {
  return new DecimalValue(value);
}
