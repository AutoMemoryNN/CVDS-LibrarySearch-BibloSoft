/**
 * Represents a mapping of errors for each property of a given type `T`.
 * Each key corresponds to a property of `T`, and the value is a string
 * describing the error associated with that property.
 *
 * @template T - The type whose properties are being mapped to error messages.
 */
export type Errors<T> = Partial<Record<keyof T, string>>;

/**
 * Represents a successful response from an controller
 *
 * @template T - The type of the data in the response. Defaults to `null`.
 *
 * If `T` is `null`, the response will contain only a message.
 * If `T` is not `null`, the response will contain both data and an optional message.
 *
 * @example
 * // Example with data
 * const response: SuccessResponse<{ id: number }> = {
 *   data: { id: 1 },
 *   message: "Operation successful"
 * };
 *
 * @example
 * // Example without data
 * const response: SuccessResponse = {
 *   message: "Operation successful"
 * };
 */
export type ControllerResponse<T = null> = T extends null
	? { message: string }
	: { data: T; message?: string };
