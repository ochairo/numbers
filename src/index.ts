/**
 * @levin/numbers - Primitive-like integer and decimal types for safe arithmetic
 *
 * Provides Int and Decimal types that feel like primitives but offer:
 * - Arbitrary precision for integers (no MAX_SAFE_INTEGER limit)
 * - Precise decimal arithmetic (no floating-point errors)
 * - Fluent, chainable API
 *
 * @example Integer arithmetic
 * ```ts
 * const a = Int(42);
 * const b = Int(8);
 * a.add(b).multiply(2).toString(); // "100"
 *
 * // No precision loss with large numbers
 * Int("99999999999999999999").add(1).toString();
 * ```
 *
 * @example Decimal precision
 * ```ts
 * const a = Decimal("0.1");
 * const b = Decimal("0.2");
 * a.add(b).toString(); // "0.3" (not 0.30000000000000004!)
 *
 * // Financial calculations
 * const price = Decimal("19.99");
 * const tax = Decimal("0.08");
 * price.multiply(tax.add("1")).round(2).toString(); // "21.59"
 * ```
 *
 * @example Use as types
 * ```ts
 * interface Product {
 *   id: Int;
 *   price: Decimal;
 *   quantity: Int;
 * }
 *
 * const product: Product = {
 *   id: Int(1),
 *   price: Decimal("29.99"),
 *   quantity: Int(5)
 * };
 * ```
 *
 * @module
 */

export { Int } from './integer';
export { Decimal } from './decimal';
