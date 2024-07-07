// Función para calcular el total de productos en una cotización
const calcularTotalProductos = (cotizacion) => {
    let total = 0;
    cotizacion.productos.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });
    return total;
};

// Función para calcular el total de la cotización
const calcularTotalCotizacion = (cotizacion) => {
    let total = calcularTotalProductos(cotizacion);
    // Puedes agregar cualquier otro cálculo necesario, como impuestos, descuentos, etc.
    return total;
};

// Función para calcular el porcentaje de ganancia
const calcularPorcentajeGanancia = (cotizacion) => {
    // Aquí puedes implementar tu lógica real para calcular el porcentaje de ganancia
    // En este ejemplo, suponemos que hay un margen de ganancia fijo del 30%
    const margenGanancia = 0.30;
    let costoTotal = 0;
    cotizacion.productos.forEach(producto => {
        costoTotal += producto.costo * producto.cantidad;
    });
    const totalCotizacion = calcularTotalCotizacion(cotizacion);
    const ganancia = totalCotizacion - costoTotal;
    const porcentajeGanancia = (ganancia / costoTotal) * 100;
    return porcentajeGanancia.toFixed(2); // Redondear a dos decimales
};

module.exports = {
    calcularTotalProductos,
    calcularTotalCotizacion,
    calcularPorcentajeGanancia
};
