export const resolvePromise = async <T>(callback: T) => {
  try {
    const result = await callback;

    return [result, null] as const;
  } catch (err) {
    return [null, err] as const;
  }
};

export const sequentialPromise = async <
  T extends unknown[],
  U = Awaited<T[number]>
>(
  tasks: T
) => {
  const results: U[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const task of tasks) {
    // eslint-disable-next-line no-await-in-loop
    results.push((await task) as U);
  }

  return results;
};
