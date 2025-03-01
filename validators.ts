/**
 * Utilidades para validación de datos
 */

/**
 * Valida si un correo electrónico tiene formato válido
 * @param email Correo electrónico a validar
 * @returns true si es válido, false en caso contrario
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

/**
 * Valida si una contraseña cumple con requisitos mínimos de seguridad
 * @param password Contraseña a validar
 * @returns true si es válida, false en caso contrario
 */
export const isValidPassword = (password: string): boolean => {
  // Al menos 8 caracteres, una letra mayúscula, una minúscula y un número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

/**
 * Valida si un número de teléfono tiene formato válido
 * @param phone Número de teléfono a validar
 * @returns true si es válido, false en caso contrario
 */
export const isValidPhone = (phone: string): boolean => {
  // Acepta formatos: +1234567890, 123-456-7890, (123) 456-7890, etc.
  const regex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return regex.test(phone);
};

/**
 * Valida si un campo obligatorio tiene valor
 * @param value Valor a validar
 * @returns true si tiene valor, false en caso contrario
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Valida si un valor numérico está dentro de un rango
 * @param value Valor a validar
 * @param min Valor mínimo (inclusivo)
 * @param max Valor máximo (inclusivo)
 * @returns true si está en el rango, false en caso contrario
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Valida un RUC (Registro Único de Contribuyentes) peruano
 * @param ruc RUC a validar
 * @returns true si es válido, false en caso contrario
 */
export const isValidRUC = (ruc: string): boolean => {
  // Ejemplo simple para RUC - adaptar según país
  if (!ruc) return false;
  const cleanRuc = ruc.replace(/\D/g, '');
  return cleanRuc.length === 11 && /^[1-2][0-9]{10}$/.test(cleanRuc);
};

/**
 * Valida una URL
 * @param url URL a validar
 * @returns true si es válida, false en caso contrario
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Valida si un objeto tiene todas las propiedades requeridas
 * @param obj Objeto a validar
 * @param requiredProps Array de propiedades requeridas
 * @returns true si tiene todas las propiedades, false en caso contrario
 */
export const hasRequiredProps = (obj: Record<string, any>, requiredProps: string[]): boolean => {
  return requiredProps.every(prop => 
    Object.prototype.hasOwnProperty.call(obj, prop) && 
    isRequired(obj[prop])
  );
};

/**
 * Valida formato de código de barras EAN-13
 * @param barcode Código de barras a validar
 * @returns true si es válido, false en caso contrario
 */
export const isValidBarcode = (barcode: string): boolean => {
  // Validación simple para EAN-13
  return /^\d{13}$/.test(barcode);
};