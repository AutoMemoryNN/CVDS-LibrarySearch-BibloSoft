/**
 * Represents a mapping of errors for each property of a given type `T`.
 * Each key corresponds to a property of `T`, and the value is a string
 * describing the error associated with that property.
 *
 * @template T - The type whose properties are being mapped to error messages.
 */
type Errors<T> = Record<keyof T, string>;

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
export type SuccessResponse<T = null> = T extends null
	? { message: string }
	: { data: T; message?: string };

/**
 * Represents a client error response from a controller
 *
 * @template T - The type of the errors.
 *
 * Contains a dictionary of errors where the key is the field name and the value is the error message.
 */
export interface ClientErrorResponse<T> {
	errors: Errors<T>;
	message?: string;
}

/**
 * Represents an error response from the server.
 *
 * Contains a message that describes the error.
 */
export interface ServerErrorResponse {
	message: string;
}

/**
 * Represents the response from a controller, which can be either a success or an error response.
 *
 * @template S - The type of the success response data.
 * @template E - The type of the client error response data. Defaults to null.
 *
 * If `E` is null, the response can be either a `SuccessResponse<S>` or a `ServerErrorResponse`.
 * If `E` is not null, the response can be a `SuccessResponse<S>`, `ClientErrorResponse<E>`, or `ServerErrorResponse`.
 */
export type ControllerResponse<S = null, E = null> = E extends null
	? SuccessResponse<S> | ServerErrorResponse
	: SuccessResponse<S> | ClientErrorResponse<E> | ServerErrorResponse;
