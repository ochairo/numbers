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

// Integers
Int(42).add(8).toString();  // "50"

// Decimals
Decimal("0.1").add("0.2").toString();  // "0.3"

// Mix types freely
Int(10).add("5").multiply(Int(2)).toString();  // "30"
Decimal("3.5").add(2.5).subtract(Decimal("1")).toString();  // "5"
```

## Documentation

- [API Reference](./docs/API.md)
- [Usage Guide](./docs/USAGE.md)
- [Examples](./docs/EXAMPLES.md)

<br><br>

<div align="center">

[Report Bug](https://github.com/ochairo/numbers/issues) • [Request Feature](https://github.com/ochairo/numbers/issues)

**Made with ❤︎ by [ochairo](https://github.com/ochairo)**

</div>
