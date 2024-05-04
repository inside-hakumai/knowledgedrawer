export type Result<S = void, F = void> = Success<S> | Failure<F>

export const Ok = () => Success(undefined)
export const Success = <S>(data: S): Success<S> => {
  return {
    isSuccess: true,
    data,
  }
}

export type Success<S = void> = {
  isSuccess: true
  data: S
}

export const Failure = <F = void>(data: F): Failure<F> => ({
  isSuccess: false,
  data,
})
export type Failure<F> = {
  isSuccess: false
  data: F
}
