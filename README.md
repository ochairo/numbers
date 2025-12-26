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

- [API Reference](./docs/API.md)
- [Usage Guide](./docs/USAGE.md)
- [Examples](./docs/EXAMPLES.md)

<br><br>

<div align="center">

[Report Bug](https://github.com/ochairo/numbers/issues) • [Request Feature](https://github.com/ochairo/numbers/issues)

**Made with ❤︎ by [ochairo](https://github.com/ochairo)**

</div>
