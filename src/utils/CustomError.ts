class CustomError extends Error {
  code: number;
  custom_code?: string;
  message: string;

  /**
   * @param {string} message Type your message
   * @param {number} code Type your HTTP response status code
   * @param {string} custom_code Type your custom code if needed
   */
  constructor(message: string, code: number, custom_code?: string) {
    super(message);

    this.code = code;
    this.message = message;

    if (custom_code) {
      this.custom_code = custom_code;
    }
  }
}

export default CustomError;
