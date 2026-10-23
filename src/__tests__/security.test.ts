import { describe, expect, it } from "vitest";
import { Decimal } from "../decimal.js";

describe("complete decimal parsing", () => {
  it.each(["1.2.3", "1..junk", "1.2tail", "", " ", ".", "+", "--1", "0x10", "1e3", "1e999999999"])("rejects malformed fixed-point input %j", (input) => {
    expect(() => Decimal(input)).toThrow(SyntaxError);
  });

  it.each([[" .5 ", "0.5"], ["-.5", "-0.5"], ["1.", "1"], ["+001.20", "1.2"]])("parses %j completely", (input, expected) => {
    expect(Decimal(input).toString()).toBe(expected);
  });

  it.each([1e-7, 1e21, Number.MIN_VALUE, Number.MAX_VALUE, -1e-7, -1e21])("accepts finite numeric notation %s", (input) => {
    expect(Decimal(input).toNumber()).toBe(input);
  });

  it.each([NaN, Infinity, -Infinity])("rejects nonfinite input %s", (input) => {
    expect(() => Decimal(input)).toThrow(RangeError);
  });

  it.each([-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])("rejects invalid precision %s", (precision) => {
    expect(() => Decimal("1.5").round(precision)).toThrow(RangeError);
    expect(() => Decimal("1.5").divide(2, precision)).toThrow(RangeError);
  });

  it.each([["-1.4", "-1"], ["-1.5", "-1"], ["-1.6", "-2"], ["1.4", "1"], ["1.5", "2"], ["1.6", "2"]])("rounds %s with ties toward positive infinity", (input, expected) => {
    expect(Decimal(input).round().toString()).toBe(expected);
  });

  it("rounds negative fractional values at nonzero precision", () => {
    expect(Decimal("-1.235").round(2).toString()).toBe("-1.23");
    expect(Decimal("-1.236").round(2).toString()).toBe("-1.24");
  });
});
