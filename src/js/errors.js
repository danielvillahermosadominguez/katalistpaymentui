export const NO_SERVER_CONNECTION = -2

export function getErrorMessage(code, parameter, translator) {
    let message = "";
    if (code == NO_SERVER_CONNECTION) {
        message = translator("there_is_not_connection");
    } else {
        message = translator("backend_error_code_" + code);
        message = message.replace("{1}", parameter);
        message = translator("backend_error_code_" + code);
    }

    return message;
}