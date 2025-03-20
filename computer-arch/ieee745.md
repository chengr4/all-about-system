# IEEE 754 Floating Point Format

- Floating point number = interger part + fractional part (including  radix point) => e.g. 3 + .14
- 若遇到循環小數需要截斷 aka. 有誤差
- There are some architectures that handle the integer part and fractional part as separate integer values, but this slows floating point calculations down considerably. Most architectures have a discrete logical block (separate from the ALU) whose circuitry is designed to handle numbers in the IEEE 754 standard. This block is called the floating point unit (FPU).

## Encoding an IEEE 754 Float

To encode a **32-bit** float you’ll first need to convert from decimal to binary, then to binary scientific notation. Take note of the three important components of the value you will be converting; sign, normalized mantissa, and exponent. Now for the fancy part:

- Check the sign.

A negative value will have a set (1) sign bit, a positive value will have a clear (0) sign bit.

- Extract the normalized mantissa and pad it with zeros (to the right) to fill the proper number of mantissa bits. If it is a repeating fraction, calculate enough repeats to fill the mantissa.

> NOTE: We truncate the residual bits of the pattern to fit the mantissa in this course, but some calculators use a rounding algorithm based on the repeating binary.

- Add the value 127 to the exponent.

This is called biasing the exponent and is the amazing mathematical trick that allows floats to have such a large value range or be so precise. Negative exponents represent precise values, and positive exponents represent large values, and centering them on 127 allows a binary value to represent either.

- Convert the biased exponent to binary.
- Concatenate the three binary numbers in the order sign, biased exponent, normalized mantissa to form the IEEE 754 float value.
- Convert this from binary to hex for easy readability.

E.g. for -21.1875:

1. Convert decimal to binary fraction. => `-21.1875d = -10101.0011b`
2. Check the sign. => Negative, so Sign Bit is `1`
3. Convert to binary scientific notation. => `-10101.0011 = -1.01010011 x 24`
4. Extract and zero-pad normalized mantissa (drop the leading 1) to 23 bits. =>  `01010011000000000000000b`
5. Bias the exponent (add the exponent to 127) and convert to binary. => `4 + 127 = 131d = 10000011b`
6. Concatenate sign bit, biased exponent, normalized mantissa.
`1 10000011 01010011000000000000000 = 1100 0001 1010 1001 1000 0000 0000 0000b`
7. Convert to hex. => `C1 A9 80 00 hex`

## Decoding an IEEE 754 Float

