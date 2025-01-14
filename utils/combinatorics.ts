// This module is browser compatible.
/** * Yields `r` length `Arrays` from the input `iterable`. Order of selection is
 * * important and elements are chosen with replacement.
 * * ```ts * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 * * import { permutationsWithReplacement } from "https://deno.land/x/combinatorics/mod.ts";
 * * const sequences = [...permutationsWithReplacement([1, 2, 3, 4], 2)];
 * * assertEquals(sequences, [
 *    [1, 1], [1, 2], [1, 3], [1, 4],
 *    [2, 1], [2, 2], [2, 3], [2, 4],
 *    [3, 1], [3, 2], [3, 3], [3, 4],
 *    [4, 1], [4, 2], [4, 3], [4, 4], * ]);
 *  ``` */

export function* permutationsWithReplacement<T>(
  iterable: Iterable<T>,
  r: number
): Generator<T[]> {
  if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  }
  const pool = [...iterable];
  const n = pool.length;
  if (r === 0) {
    yield [];
    return;
  }
  if (n === 0 && r > 0) return;
  const indices = new Uint32Array(r);
  yield Array(r).fill(pool[0]);
  while (true) {
    let i: number;
    loop: {
      for (i = r - 1; i >= 0; i--) {
        if (indices[i] === n - 1) continue;
        const result: T[] = Array(r);
        for (let j = 0; j < i; j++) result[j] = pool[indices[j]];
        const index = (indices[i] += 1);
        result[i] = pool[index];
        for (let j = i + 1; j < r; j++) {
          indices[j] = 0;
          result[j] = pool[0];
        }
        yield result;
        break loop;
      }
      return;
    }
  }
} // This module is browser compatible.

/**
 * Yields `r` length `Arrays` from the input `iterable`. Order of selection is
 * important and elements are chosen without replacement. If `r` is undefined, then
 * the length of the `iterable` is used.
 *
 * ```ts
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 * import { permutations } from "https://deno.land/x/combinatorics/mod.ts";
 *
 * const sequences = [...permutations([1, 2, 3, 4], 2)];
 *
 * assertEquals(sequences, [
 *   [1, 2], [1, 3], [1, 4],
 *   [2, 1], [2, 3], [2, 4],
 *   [3, 1], [3, 2], [3, 4],
 *   [4, 1], [4, 2], [4, 3],
 * ]);
 * ```
 */
export function* permutations<T>(
  iterable: Iterable<T>,
  r?: number
): Generator<T[]> {
  const pool = [...iterable];
  const n = pool.length;
  if (r === undefined) {
    r = n;
  } else if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  } else if (r > n) {
    return;
  }
  const cycles = Array(r)
    .fill(0)
    .map((_, index) => n - index);
  const indices = new Uint32Array(n).map((_, index) => index);
  yield pool.slice(0, r);
  while (true) {
    loop: {
      for (let i = r - 1; i >= 0; i--) {
        cycles[i] -= 1;
        if (cycles[i] === 0) {
          let index = indices[i];
          for (let j = n - 1; j >= i; j--) {
            const temp = index;
            index = indices[j];
            indices[j] = temp;
          }
          cycles[i] = n - i;
        } else {
          const j = n - cycles[i];
          const temp = indices[i];
          indices[i] = indices[j];
          indices[j] = temp;
          const result = Array(r);
          for (i = 0; i < r; i++) {
            result[i] = pool[indices[i]];
          }
          yield result;
          break loop;
        }
      }
      return;
    }
  }
}

// This module is browser compatible.

/**
 * Yields `r` length `Arrays` from the input `iterable`. Order of selection does
 * not matter and elements are chosen without replacement.
 *
 * ```ts
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 * import { combinations } from "https://deno.land/x/combinatorics/mod.ts";
 *
 * const sequences = [...combinations([1, 2, 3, 4], 2)];
 *
 * assertEquals(sequences, [
 *   [1, 2],
 *   [1, 3],
 *   [1, 4],
 *   [2, 3],
 *   [2, 4],
 *   [3, 4],
 * ]);
 * ```
 */
export function* combinations<T>(
  iterable: Iterable<T>,
  r: number
): Generator<T[]> {
  if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  }
  const pool = [...iterable];
  const n = pool.length;
  if (r > n) {
    return;
  }
  const indices = new Uint32Array(r).map((_, index) => index);
  yield pool.slice(0, r);
  while (true) {
    let i: number;
    loop: {
      for (i = r - 1; i >= 0; i--) {
        if (indices[i] !== i + n - r) {
          break loop;
        }
      }
      return;
    }
    const result: T[] = Array(r);
    for (let j = 0; j < i; j++) {
      result[j] = pool[indices[j]];
    }
    let index = (indices[i] += 1);
    result[i] = pool[index];
    for (let j = i + 1; j < r; j++) {
      indices[j] = index += 1;
      result[j] = pool[index];
    }
    yield result;
  }
}
