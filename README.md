<!-- markdownlint-disable MD033 MD041 -->

<div align="center">

# numbers

Primitive-like integer and decimal types for safe arithmetic.<br>

[![npm version](https://img.shields.io/npm/v/@ochairo/numbers)](https://www.npmjs.com/package/@ochairo/numbers)
[![npm downloads](https://img.shields.io/npm/dm/@ochairo/numbers)](https://www.npmjs.com/package/@ochairo/numbers)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@ochairo/numbers)](https://bundlephobia.com/package/@ochairo/numbers)
![CI](https://github.com/ochairo/numbers/workflows/CI/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

## Features

- **Arbitrary Precision**: No `MAX_SAFE_INTEGER` limit
- **Precise Decimals**: No floating-point errors
- **Fluent API**: Chainable operations
- **Simple**: Just `Int()` and `Decimal()`

## Install

```bash
pnpm add @ochairo/numbers
```

## Quick Start

```ts
import { Int, Decimal } from '@ochairo/numbers';

const integer: Int = Int("9007199254740992");
const decimal: Decimal = Decimal("12345678901234567890.123456790");

integer.add(decimal).toString();       // "12345679901912442382.123456782"
decimal.subtract(integer).toString();  // "12345678901234567889.223456798"
```

## Documentation

`Decimal` validates the entire trimmed string. Signed decimal forms such as
`"-1.25"`, `".5"`, and `"1."` are accepted; malformed suffixes and scientific
notation strings throw `SyntaxError`. Finite JavaScript numbers are accepted,
including values whose shortest representation uses an exponent. Non-finite
numbers throw `RangeError`.

Division and rounding precision must be a nonnegative safe integer. Rounding
chooses the nearest value, with ties toward positive infinity. Arbitrary precision
arithmetic is not resource bounded: applications accepting untrusted input must
limit input length and requested precision before calling these APIs.

- [API Reference](./docs/API.md)
