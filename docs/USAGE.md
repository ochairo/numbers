# Usage Guide

## Creating Numbers

### Integers

```ts
import { Int } from '@ochairo/numbers';

// From number
const a = Int(42);

// From string (recommended for large numbers)
const b = Int("99999999999999999999");

// From another Int
const c = Int(a);
```

### Decimals

```ts
import { Decimal } from '@ochairo/numbers';

// From string (recommended)
const price = Decimal("19.99");

// From number
const pi = Decimal(3.14159);

// From another Decimal
const copy = Decimal(price);
```

---

## Arithmetic

All operations are chainable and immutable.

```ts
const result = Int(10)
  .add(5)
  .multiply(2)
  .subtract(3);

console.log(result.toString());  // "27"
```

### Operations Accept Multiple Types

```ts
Int(10).add(5)        // number
Int(10).add("5")      // string
Int(10).add(Int(5))   // Int
```

---

## Comparisons

```ts
const a = Int(5);
const b = Int(10);

a.equals(5)   // true
a.gt(3)       // true
a.gte(5)      // true
a.lt(10)      // true
a.lte(5)      // true
```

---

## Decimals

### Precision

```ts
// JavaScript problem
0.1 + 0.2  // 0.30000000000000004

// Solution
Decimal("0.1").add("0.2").toString()  // "0.3"
```

### Rounding

```ts
const num = Decimal("3.14159");

num.round(2).toString()  // "3.14"
num.round(0).toString()  // "3"
```

---

## Type Usage

Use as types in your domain:

```ts
interface Product {
  id: Int;
  price: Decimal;
  quantity: Int;
}

const product: Product = {
  id: Int(1),
  price: Decimal("29.99"),
  quantity: Int(5)
};
```

---

## Best Practices

### ✅ Do

- Use strings for precise decimals
- Use strings for very large integers
- Chain operations for clarity
- Use as types in domain models

### ❌ Don't

- Convert to number unless necessary
- Mix regular numbers in calculations
- Mutate values (they're immutable)
