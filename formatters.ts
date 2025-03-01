/**
 * Utilidades para formateo de datos
 */

/**
 * Formatea un número como moneda
 * @param value Valor a formatear
 * @param currency Símbolo de moneda
 * @returns String formateado como moneda
 */
export const formatCurrency = (value: number, currency: string = '$'): string => {
  return `${currency} ${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

/**
 * Formatea una fecha en formato local
 * @param date Fecha a formatear (string ISO o Date)
 * @param includeTime Si se debe incluir la hora
 * @returns String con fecha formateada
 */
export const formatDate = (date: string | Date, includeTime: boolean = false): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' })
  };
  
  return dateObj.toLocaleDateString('es-ES', options);
};

/**
 * Trunca un texto a la longitud especificada
 * @param text Texto a truncar
 * @param maxLength Longitud máxima
 * @returns Texto truncado con elipsis si excede maxLength
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Formatea un número como porcentaje
 * @param value Valor a formatear
 * @param decimals Número de decimales
 * @returns String formateado como porcentaje
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Formatea un estado en texto amigable
 * @param status Estado a formatear
 * @returns String con el estado formateado
 */
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Activo': 'Activo',
    'Inactivo': 'Inactivo',
    'Pendiente': 'Pendiente',
    'Entregado': 'Entregado',
    'Cancelado': 'Cancelado',
    'Entrada': 'Entrada',
    'Salida': 'Salida',
    'Ajuste': 'Ajuste'
  };
  
  return statusMap[status] || status;
};

/**
 * Formatea un nombre para mostrar en formato "Apellido, Nombre"
 * @param firstName Nombre
 * @param lastName Apellido
 * @returns String con nombre formateado
 */
export const formatName = (firstName: string, lastName: string): string => {
  return `${lastName}, ${firstName}`;
};

/**
 * Calcula el tiempo transcurrido desde una fecha hasta ahora
 * @param date Fecha desde la que calcular
 * @returns String con tiempo transcurrido
 */
export const timeAgo = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return `hace ${interval} ${interval === 1 ? 'año' : 'años'}`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `hace ${interval} ${interval === 1 ? 'mes' : 'meses'}`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `hace ${interval} ${interval === 1 ? 'día' : 'días'}`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `hace ${interval} ${interval === 1 ? 'hora' : 'horas'}`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `hace ${interval} ${interval === 1 ? 'minuto' : 'minutos'}`;
  }
  
  return 'hace unos segundos';
};