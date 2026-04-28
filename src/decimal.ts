/**
 * Decimal type with primitive-like API for precise decimal arithmetic
 * Avoids floating-point precision issues
 */
class DecimalValue {
  private readonly value: bigint;
  private readonly scale: number;
  private static readonly DEFAULT_PRECISION = 20;

  /**
   * Public path: accepts number | string | DecimalValue.
   * Internal fast-path: accepts bigint + scale (used only by _make()).
   */
  constructor(value: number | string | DecimalValue | bigint, scale?: number) {
    if (typeof value === "bigint") {
      // Internal construction — direct bigint + scale, bypasses string parsing
      this.value = value;
      this.scale = scale ?? 0;
      return;
    }

    if (value instanceof DecimalValue) {
      this.value = value.value;
      this.scale = value.scale;
      return;
    }

    const str = typeof value === "number" ? value.toString() : value;
    const parts = str.split(".");
    const integerPart = parts[0] ?? "0";
    const fractionalPart = parts[1] ?? "";

    if (scale !== undefined) {
      this.scale = scale;
    } else {
      this.scale = fractionalPart.length;
    }

    // Pad or truncate fractional part to match scale
    const adjustedFractional = fractionalPart
      .padEnd(this.scale, "0")
      .slice(0, this.scale);
    const combined = integerPart + adjustedFractional;
    this.value = BigInt(combined);
  }

  /** Internal factory — avoids any-casts by using the bigint constructor path. */
  private static _make(value: bigint, scale: number): DecimalValue {
    return new DecimalValue(value, scale);
  }

  /**
   * Addition
   */
  add(other: number | string | DecimalValue): DecimalValue {
    const [a, b] = DecimalValue.alignScale(this, DecimalValue.from(other));
    return DecimalValue._make(a.value + b.value, a.scale).normalize();
  }

  /**
   * Subtraction
   */
  subtract(other: number | string | DecimalValue): DecimalValue {
    const [a, b] = DecimalValue.alignScale(this, DecimalValue.from(other));
    return DecimalValue._make(a.value - b.value, a.scale).normalize();
  }

  /**
   * Multiplication
   */
  multiply(other: number | string | DecimalValue): DecimalValue {
    const otherDec = DecimalValue.from(other);
    return DecimalValue._make(
      this.value * otherDec.value,
      this.scale + otherDec.scale,
    ).normalize();
  }

  /**
   * Division
   *
   * result = (this.value / 10^thisScale) / (other.value / 10^otherScale)
   *        = this.value * 10^(otherScale - thisScale) / other.value
   *
   * To express the result at `precision` decimal places:
   *   resultValue = this.value * 10^(precision + otherScale - thisScale) / other.value
   */
  divide(
    other: number | string | DecimalValue,
    precision = DecimalValue.DEFAULT_PRECISION,
  ): DecimalValue {
    const otherDec = DecimalValue.from(other);
    if (otherDec.value === 0n) {
      throw new RangeError("Division by zero");
    }

    const scaleDiff = precision + otherDec.scale - this.scale;
    if (scaleDiff < 0) {
      const minPrecision = this.scale - otherDec.scale;
      throw new RangeError(
        `divide() precision (${precision}) is too low — must be at least ${minPrecision} to represent this quotient`,
      );
    }
    const scaledValue = this.value * 10n ** BigInt(scaleDiff);
    const resultValue = scaledValue / otherDec.value;

    return DecimalValue._make(resultValue, precision).normalize();
  }

  /**
   * Absolute value
   */
  abs(): DecimalValue {
    if (this.value < 0n) {
      return DecimalValue._make(-this.value, this.scale);
    }
    return this;
  }

  /**
   * Negation
   */
  negate(): DecimalValue {
    return DecimalValue._make(-this.value, this.scale);
  }

  /**
   * Round to specified decimal places (round half toward +∞)
   */
  round(decimalPlaces = 0): DecimalValue {
    if (decimalPlaces >= this.scale) {
      return this;
    }

    const divisor = 10n ** BigInt(this.scale - decimalPlaces);
    const quotient = this.value / divisor;
    const remainder = this.value % divisor;

    // Round half up (toward +∞)
    const halfDivisor = divisor / 2n;
    const rounded = remainder >= halfDivisor ? quotient + 1n : quotient;

    return DecimalValue._make(rounded, decimalPlaces);
  }

  /**
   * Floor (round toward −∞)
   */
  floor(): DecimalValue {
    if (this.scale === 0) return this;

    const divisor = 10n ** BigInt(this.scale);
    const quotient = this.value / divisor;
    const remainder = this.value % divisor;

    // For negative numbers with a remainder, subtract 1 (truncation goes toward zero, floor goes toward −∞)
    const floored =
      remainder !== 0n && this.value < 0n ? quotient - 1n : quotient;
    return DecimalValue._make(floored, 0);
  }

  /**
   * Ceil (round toward +∞)
   */
  ceil(): DecimalValue {
    if (this.scale === 0) return this;

    const divisor = 10n ** BigInt(this.scale);
    const quotient = this.value / divisor;
    const remainder = this.value % divisor;

    // For positive numbers with a remainder, add 1
    const ceiled =
      remainder !== 0n && this.value > 0n ? quotient + 1n : quotient;
    return DecimalValue._make(ceiled, 0);
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
    const isNegative = str.startsWith("-");
    const absStr = isNegative ? str.slice(1) : str;

    if (this.scale === 0) {
      return str;
    }

    const padded = absStr.padStart(this.scale + 1, "0");
    const integerPart = padded.slice(0, -this.scale) || "0";
    const fractionalPart = padded.slice(-this.scale);

    // Remove trailing zeros
    const trimmedFractional = fractionalPart.replace(/0+$/, "");

    if (trimmedFractional === "") {
      return (isNegative ? "-" : "") + integerPart;
    }

    return (isNegative ? "-" : "") + integerPart + "." + trimmedFractional;
  }

  /**
   * Convert to JSON
   */
  toJSON(): string {
    return this.toString();
  }

  /**
   * node-postgres custom serializer — returns the decimal as a plain string
   * so it can be passed as a query parameter to PostgreSQL numeric columns.
   */
  toPostgres(): string {
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

    return DecimalValue._make(newValue, newScale);
  }

  /**
   * Helper: convert to DecimalValue
   */
  private static from(value: number | string | DecimalValue): DecimalValue {
    return value instanceof DecimalValue ? value : new DecimalValue(value);
  }

  /**
   * Helper: align two decimals to the same scale
   */
  private static alignScale(
    a: DecimalValue,
    b: DecimalValue,
  ): [DecimalValue, DecimalValue] {
    if (a.scale === b.scale) {
      return [a, b];
    }

    if (a.scale > b.scale) {
      const factor = 10n ** BigInt(a.scale - b.scale);
      return [a, DecimalValue._make(b.value * factor, a.scale)];
    }

    const factor = 10n ** BigInt(b.scale - a.scale);
    return [DecimalValue._make(a.value * factor, b.scale), b];
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
