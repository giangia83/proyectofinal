function calcularTotalCotizacion(cotizacion) {
    let total = 0;
    cotizacion.productos.forEach(producto => {
      total += producto.cantidad * producto.precio;
    });
    return total;
  }