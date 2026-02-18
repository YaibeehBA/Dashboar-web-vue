import { ref, computed } from 'vue';
import datosAguacates from '../data/aguacates_limpio.json';

export function useAvocadoData() {
  const datos = ref([]);
  const datosFiltrados = ref([]);
  const filtros = ref({
    region: '',
    tipo: '',
    anio: ''
  });

  // Inicializar datos
  const cargarDatos = () => {
    datos.value = datosAguacates
      .filter(item => item.region && item.region.toLowerCase() !== 'totalus')
      .map(item => ({
        ...item,
        fecha: new Date(item.fecha),
        precio_promedio: parseFloat(item.precio_promedio) || 0,
        volumen_total: parseFloat(item.volumen_total) || 0,
        volumen_tipo_4046: parseFloat(item.volumen_plu_4046) || 0,
        volumen_tipo_4225: parseFloat(item.volumen_plu_4225) || 0,
        volumen_tipo_4770: parseFloat(item.volumen_plu_4770) || 0,
        bolsas_pequenas: parseFloat(item.bolsas_pequenas) || 0,
        bolsas_totales: parseFloat(item.bolsas_totales) || 0,
        // Si necesitas calcular ingresos totales, puedes hacerlo aquí
        ingresos_totales: (parseFloat(item.precio_promedio) || 0) * (parseFloat(item.volumen_total) || 0)
      }));

    datosFiltrados.value = [...datos.value];
  };

  // Filtrar datos
  const aplicarFiltros = () => {
    datosFiltrados.value = datos.value.filter(d => {
      let cumple = true;
      if (filtros.value.region) cumple = cumple && d.region === filtros.value.region;
      if (filtros.value.tipo) cumple = cumple && d.tipo_producto === filtros.value.tipo;
      if (filtros.value.anio) {
        const anio = new Date(d.fecha).getFullYear();
        cumple = cumple && anio === parseInt(filtros.value.anio);
      }
      return cumple;
    });
  };

  const limpiarFiltros = () => {
    filtros.value = { region: '', tipo: '', anio: '' };
    datosFiltrados.value = [...datos.value];
  };

  // Valores únicos para filtros
  const regiones = computed(() => [...new Set(datos.value.map(d => d.region))].sort());
  const tiposProducto = computed(() => [...new Set(datos.value.map(d => d.tipo_producto))].sort());
  const anios = computed(() => {
    const años = [...new Set(datos.value.map(d => new Date(d.fecha).getFullYear()))];
    return años.sort((a, b) => a - b);
  });

  // Calcular KPIs
  const calcularKPIs = () => {
    const datosActuales = datosFiltrados.value;
    const totalRegistros = datosActuales.length;
    
    if (totalRegistros === 0) {
      return {
        precioPromedio: '0.00',
        precioCambio: 0,
        volumenTotal: '0.00',
        volumenCambio: 0,
        ingresosTotales: '0.00',
        ingresosCambio: 0,
        rentabilidad: '0.00',
        rentabilidadCambio: 0,
        productoDominante: 'N/A',
        productoDominanteVolumen: '0.00M lb',
        porcentajeBolsasPequenas: '0.0',
        regionesActivas: 0,
        totalRegistros: '0'
      };
    }

    const datosOrdenados = [...datosActuales].sort((a, b) => b.fecha - a.fecha);
    const puntoMedio = Math.floor(datosOrdenados.length / 2);
    const datosRecientes = datosOrdenados.slice(0, puntoMedio);
    const datosAnteriores = datosOrdenados.slice(puntoMedio);

    // Precio promedio
    const sumaPrecio = datosActuales.reduce((sum, d) => sum + d.precio_promedio, 0);
    const precioPromedio = sumaPrecio / totalRegistros;
    
    const precioReciente = datosRecientes.length > 0 
      ? datosRecientes.reduce((sum, d) => sum + d.precio_promedio, 0) / datosRecientes.length 
      : precioPromedio;
    const precioAnterior = datosAnteriores.length > 0 
      ? datosAnteriores.reduce((sum, d) => sum + d.precio_promedio, 0) / datosAnteriores.length 
      : precioPromedio;
    const precioCambio = ((precioReciente - precioAnterior) / precioAnterior) * 100;

    // Volumen total
    const volumenTotal = datosActuales.reduce((sum, d) => sum + d.volumen_total, 0);
    
    const volumenReciente = datosRecientes.reduce((sum, d) => sum + d.volumen_total, 0);
    const volumenAnterior = datosAnteriores.reduce((sum, d) => sum + d.volumen_total, 0);
    const volumenCambio = ((volumenReciente - volumenAnterior) / volumenAnterior) * 100;

    // Ingresos totales (calculados)
    const ingresosTotales = datosActuales.reduce((sum, d) => sum + (d.precio_promedio * d.volumen_total), 0);
    
    const ingresosRecientes = datosRecientes.reduce((sum, d) => sum + (d.precio_promedio * d.volumen_total), 0);
    const ingresosAnteriores = datosAnteriores.reduce((sum, d) => sum + (d.precio_promedio * d.volumen_total), 0);
    const ingresosCambio = ((ingresosRecientes - ingresosAnteriores) / ingresosAnteriores) * 100;

    // Rentabilidad (precio por libra)
    const rentabilidad = ingresosTotales / volumenTotal;
    const rentabilidadReciente = ingresosRecientes / volumenReciente;
    const rentabilidadAnterior = ingresosAnteriores / volumenAnterior;
    const rentabilidadCambio = ((rentabilidadReciente - rentabilidadAnterior) / rentabilidadAnterior) * 100;

    // Producto dominante
    const suma4046 = datosActuales.reduce((sum, d) => sum + d.volumen_tipo_4046, 0);
    const suma4225 = datosActuales.reduce((sum, d) => sum + d.volumen_tipo_4225, 0);
    const suma4770 = datosActuales.reduce((sum, d) => sum + d.volumen_tipo_4770, 0);

    const productos = [
      { codigo: '4046', volumen: suma4046 },
      { codigo: '4225', volumen: suma4225 },
      { codigo: '4770', volumen: suma4770 }
    ];
    
    const productoDominante = productos.reduce((max, p) => p.volumen > max.volumen ? p : max);

    // Bolsas pequeñas
    const totalBolsas = datosActuales.reduce((sum, d) => sum + d.bolsas_totales, 0);
    const totalBolsasPequenas = datosActuales.reduce((sum, d) => sum + d.bolsas_pequenas, 0);
    const porcentajeBolsasPequenas = totalBolsas > 0 
      ? ((totalBolsasPequenas / totalBolsas) * 100).toFixed(1)
      : '0.0';

    const regionesUnicas = new Set(datosFiltrados.value.map(d => d.region));

    return {
      precioPromedio: precioPromedio.toFixed(2),
      precioCambio: isNaN(precioCambio) || !isFinite(precioCambio) ? 0 : parseFloat(precioCambio.toFixed(1)),
      volumenTotal: (volumenTotal / 1000000).toFixed(2),
      volumenCambio: isNaN(volumenCambio) || !isFinite(volumenCambio) ? 0 : parseFloat(volumenCambio.toFixed(1)),
      ingresosTotales: (ingresosTotales / 1000000).toFixed(2),
      ingresosCambio: isNaN(ingresosCambio) || !isFinite(ingresosCambio) ? 0 : parseFloat(ingresosCambio.toFixed(1)),
      rentabilidad: rentabilidad.toFixed(2),
      rentabilidadCambio: isNaN(rentabilidadCambio) || !isFinite(rentabilidadCambio) ? 0 : parseFloat(rentabilidadCambio.toFixed(1)),
      productoDominante: productoDominante.codigo,
      productoDominanteVolumen: (productoDominante.volumen / 1000000).toFixed(2) + 'M lb',
      porcentajeBolsasPequenas: porcentajeBolsasPequenas,
      regionesActivas: regionesUnicas.size,
      totalRegistros: totalRegistros.toLocaleString()
    };
  };

  // Calcular ranking por región
  const calcularRanking = () => {
    const porRegion = {};
    
    datosFiltrados.value.forEach(d => {
      if (!porRegion[d.region]) {
        porRegion[d.region] = {
          region: d.region,
          volumen: 0,
          precio: 0,
          ingresos: 0,
          registros: 0
        };
      }
      porRegion[d.region].volumen += d.volumen_total;
      porRegion[d.region].precio += d.precio_promedio;
      porRegion[d.region].ingresos += d.precio_promedio * d.volumen_total;
      porRegion[d.region].registros++;
    });

    return Object.values(porRegion)
      .map(r => ({
        ...r,
        precio: r.precio / r.registros
      }))
      .sort((a, b) => b.volumen - a.volumen);
  };

  // Generar insights
  const generarInsights = () => {
    const insights = {
      estacionalidad: '',
      concentracion: '',
      elasticidad: ''
    };

    // Insight de estacionalidad
    const porMes = Array(12).fill(0).map(() => ({ 
      precioSuma: 0, 
      volumenSuma: 0, 
      count: 0 
    }));
    
    datosFiltrados.value.forEach(d => {
      const mes = d.fecha.getMonth();
      porMes[mes].precioSuma += d.precio_promedio;
      porMes[mes].volumenSuma += d.volumen_total;
      porMes[mes].count++;
    });

    const promediosPorMes = porMes.map((data, idx) => ({
      mes: idx,
      precio: data.count > 0 ? data.precioSuma / data.count : 0,
      volumen: data.count > 0 ? data.volumenSuma / data.count : 0
    }));

    if (promediosPorMes.some(p => p.count > 0)) {
      const maxPrecioMes = promediosPorMes.reduce((max, m) => m.precio > max.precio ? m : max);
      const maxVolumenMes = promediosPorMes.reduce((max, m) => m.volumen > max.volumen ? m : max);
      const minPrecioMes = promediosPorMes.reduce((min, m) => m.precio < min.precio ? m : maxPrecioMes);

      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

      insights.estacionalidad = `Los precios son más altos en ${meses[maxPrecioMes.mes]} ($${maxPrecioMes.precio.toFixed(2)}) y más bajos en ${meses[minPrecioMes.mes]} ($${minPrecioMes.precio.toFixed(2)}). El mayor volumen se registra en ${meses[maxVolumenMes.mes]}, mostrando clara estacionalidad en el mercado de aguacates.`;
    }

    // Insight de concentración
    const ranking = calcularRanking();
    if (ranking.length >= 3) {
      const top3Regiones = ranking.slice(0, 3);
      const ingresosTop3 = top3Regiones.reduce((sum, r) => sum + r.ingresos, 0);
      const ingresosTotal = ranking.reduce((sum, r) => sum + r.ingresos, 0);
      const porcentajeIngresos = ((ingresosTop3 / ingresosTotal) * 100).toFixed(1);

      insights.concentracion = `Las top 3 regiones (${top3Regiones.map(r => r.region).join(', ')}) generan el ${porcentajeIngresos}% de los ingresos totales, indicando una alta concentración geográfica en el mercado.`;
    }

    // Insight de elasticidad
    const correlacion = calcularCorrelacion();
    if (correlacion < -0.3) {
      insights.elasticidad = `Se observa una relación inversa moderada (correlación: ${correlacion.toFixed(2)}) entre precio y volumen: cuando el precio aumenta, la demanda tiende a disminuir, indicando sensibilidad del consumidor al precio.`;
    } else if (correlacion > 0.3) {
      insights.elasticidad = `Existe una relación positiva (correlación: ${correlacion.toFixed(2)}) entre precio y volumen, lo cual puede indicar que períodos de alta demanda permiten precios más altos.`;
    } else {
      insights.elasticidad = `La elasticidad precio-demanda es baja (correlación: ${correlacion.toFixed(2)}), indicando que la demanda de aguacates es relativamente insensible a cambios de precio en el rango observado.`;
    }

    return insights;
  };

  const calcularCorrelacion = () => {
    const n = datosFiltrados.value.length;
    if (n === 0) return 0;

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    datosFiltrados.value.forEach(d => {
      sumX += d.precio_promedio;
      sumY += d.volumen_total;
      sumXY += d.precio_promedio * d.volumen_total;
      sumX2 += d.precio_promedio * d.precio_promedio;
      sumY2 += d.volumen_total * d.volumen_total;
    });

    const numerador = (n * sumXY) - (sumX * sumY);
    const denominador = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominador === 0 ? 0 : numerador / denominador;
  };

  return {
    datos,
    datosFiltrados,
    filtros,
    regiones,
    tiposProducto,
    anios,
    cargarDatos,
    aplicarFiltros,
    limpiarFiltros,
    calcularKPIs,
    calcularRanking,
    generarInsights
  };
}