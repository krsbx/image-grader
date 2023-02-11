export const resolvePromise = async <T>(callback: T) => {
  try {
    const result = await callback;

    return [result, null] as const;
  } catch (err) {
    return [null, err] as const;
  }
};
