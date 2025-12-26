# Examples

## Financial Calculations

```ts
import { Decimal } from '@ochairo/numbers';

const subtotal = Decimal("99.99");
const taxRate = Decimal("0.0875");  // 8.75%
const shipping = Decimal("5.99");

const tax = subtotal.multiply(taxRate).round(2);
const total = subtotal.add(tax).add(shipping);

console.log(total.toString());  // "111.73"
```

---

## Game Scoring

```ts
import { Int } from '@ochairo/numbers';

let score = Int(0);

// Base points
score = score.add(100);

// Double points power-up
score = score.multiply(2);

// Bonus
score = score.add(500);

console.log(score.toString());  // "700"
```

---

## Scientific Computing

```ts
import { Int } from '@ochairo/numbers';

const avogadro = Int("602214076000000000000000");
const molecules = Int("1000000");

const moles = avogadro.divide(molecules);
console.log(moles.toString());
```

---

## Shopping Cart

```ts
import { Decimal } from '@ochairo/numbers';

interface CartItem {
  name: string;
  price: Decimal;
  quantity: number;
}

function calculateTotal(items: CartItem[]): Decimal {
  return items.reduce((sum, item) =>
    sum.add(item.price.multiply(item.quantity.toString())),
    Decimal("0")
  );
}

const cart: CartItem[] = [
  { name: 'Widget', price: Decimal("29.99"), quantity: 2 },
  { name: 'Gadget', price: Decimal("19.99"), quantity: 1 },
];

const total = calculateTotal(cart);
console.log(total.toString());  // "79.97"
```

---

## Currency Conversion

```ts
import { Decimal } from '@ochairo/numbers';

function convertCurrency(
  amount: Decimal,
  rate: Decimal
): Decimal {
  return amount.multiply(rate).round(2);
}

const usd = Decimal("100.00");
const exchangeRate = Decimal("0.85");  // USD to EUR

const eur = convertCurrency(usd, exchangeRate);
console.log(eur.toString());  // "85.00"
```

---

## Compound Interest

```ts
import { Decimal } from '@ochairo/numbers';

function compoundInterest(
  principal: Decimal,
  rate: Decimal,
  years: number
): Decimal {
  let amount = principal;
  const multiplier = Decimal("1").add(rate);

  for (let i = 0; i < years; i++) {
    amount = amount.multiply(multiplier);
  }

  return amount.round(2);
}

const initial = Decimal("1000.00");
const annualRate = Decimal("0.05");  // 5%

const final = compoundInterest(initial, annualRate, 10);
console.log(final.toString());  // "1628.89"
```

---

## Crypto Calculations

```ts
import { Int } from '@ochairo/numbers';

// Bitcoin has 100,000,000 satoshis per BTC
const SATOSHIS_PER_BTC = Int("100000000");

function btcToSatoshis(btc: string): Int {
  const btcAmount = Decimal(btc);
  const satoshis = btcAmount.multiply(SATOSHIS_PER_BTC.toString());
  return Int(satoshis.round(0).toString());
}

const sats = btcToSatoshis("0.00123456");
console.log(sats.toString());  // "123456"
```
