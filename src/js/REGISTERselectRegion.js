document.addEventListener("DOMContentLoaded", function () {
    const provinciasPorComunidad = {
      madrid: ["Madrid"],
      valencia: ["Alicante", "Castellón", "Valencia"],
      cataluna: ["Barcelona", "Tarragona", "Girona", "Lleida"]
    };

    const comunidadSelect = document.getElementById("comunidad");
    const provinciaSelect = document.getElementById("provincia");

    comunidadSelect.addEventListener("change", function () {
      const comunidad = comunidadSelect.value;
      provinciaSelect.innerHTML = '<option value="">Selecciona una provincia</option>';
      
      if (comunidad && provinciasPorComunidad[comunidad]) {
        provinciasPorComunidad[comunidad].forEach(provincia => {
          let option = document.createElement("option");
          option.value = provincia.toLowerCase();
          option.textContent = provincia;
          provinciaSelect.appendChild(option);
        });
      }
    });
  });