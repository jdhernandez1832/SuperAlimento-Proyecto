import { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net';

const useDataTable = (tableRef, data) => {
  useEffect(() => {
    if (data.length > 0) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      $(tableRef.current).DataTable({
        language: {
          processing: "Procesando...",
          search: "Buscar:",
          lengthMenu: "Mostrar _MENU_ registros",
          info: "Mostrando de _START_ a _END_ de _TOTAL_ registros",
          infoEmpty: "Mostrando de 0 a 0 de 0 registros",
          infoFiltered: "(filtrado de _MAX_ registros totales)",
          loadingRecords: "Cargando...",
          zeroRecords: "No se encontraron registros coincidentes",
          emptyTable: "No hay datos disponibles en la tabla",
          paginate: {
            first: "Primero",
            previous: "Anterior",
            next: "Siguiente",
            last: "Último"
          },
          aria: {
            sortAscending: ": activar para ordenar la columna de manera ascendente",
            sortDescending: ": activar para ordenar la columna de manera descendente"
          }
        },
        paging: true, // Activa la paginación
        lengthMenu: [5, 10, 25, 50], // Opciones para el número de registros mostrados por página
        info: true // Muestra la información de registros
      });
    }
  }, [tableRef, data]);
};

export default useDataTable;