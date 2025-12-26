# API Reference

## Int

### Constructor

```ts
Int(value: number | string | Int): Int
```

Create arbitrary precision integer.

**Example:**

```ts
Int(42)
Int("99999999999999")
Int(anotherInt)
```

---

### Arithmetic Operations

#### `.add(other)`

```ts
add(other: number | string | Int): Int
```

#### `.subtract(other)`

```ts
subtract(other: number | string | Int): Int
```

#### `.multiply(other)`

```ts
multiply(other: number | string | Int): Int
```

#### `.divide(other)`

```ts
divide(other: number | string | Int): Int
```

Integer division (truncates decimal).

#### `.mod(other)`

```ts
mod(other: number | string | Int): Int
```

#### `.negate()`

```ts
negate(): Int
```

#### `.abs()`

```ts
abs(): Int
```

---

### Comparison Methods

#### `.equals(other)`

```ts
equals(other: number | string | Int): boolean
```

#### `.gt(other)` / `.gte(other)`

```ts
gt(other: number | string | Int): boolean
gte(other: number | string | Int): boolean
```

#### `.lt(other)` / `.lte(other)`

```ts
lt(other: number | string | Int): boolean
lte(other: number | string | Int): boolean
```

---

### Conversion Methods

#### `.toString()`

```ts
toString(): string
```

#### `.toNumber()`

```ts
toNumber(): number
```

⚠️ May lose precision for large numbers.

---

## Decimal

### Constructor

```ts
Decimal(value: number | string | Decimal): Decimal
```

Create precise decimal number.

**Example:**

```ts
Decimal("0.1")
Decimal(3.14)
Decimal(anotherDecimal)
```

---

### Arithmetic Operations

Same as Int, plus:

#### `.round(decimalPlaces)`

```ts
round(decimalPlaces: number): Decimal
```

**Example:**

```ts
Decimal("3.14159").round(2).toString()  // "3.14"
```

---

### Comparison & Conversion

Same methods as Int.
