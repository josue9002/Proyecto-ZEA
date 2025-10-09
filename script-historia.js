const texts = {
    inicio: `
         <p>La institución fue creada el 14 de junio de 1.993, después de haberse realizado un censo en el sector, 
         en el cual se observó un déficit de establecimientos educativos que cubriera la totalidad de la cobertura 
         en los niveles de preescolar, primaria y bachillerato. Su propietario, preocupado por el futuro de estos
          jóvenes, quiso crear una institución donde se beneficiara gran parte de esta población que se estaba 
          quedando sin estudios por las distintas dificultades que había para ingresar a los pocos colegios públicos,
           y que por falta de recursos no tenían oportunidad en los colegios privados del sector.</p>
 
 
         <p>Pensando en un nombre que impactara grandeza en el campo de la educación, superioridad 
                     ante otras instituciones y a la vez que significara formación integral para hombres y 
                     mujeres, orientada por docentes normalistas y profesionales en las distintas áreas de 
                     la educación; la institución fue creada con el nombre de <span class="highlight-text">LICEO MIXTO EMPERADOR DE CALI </span>
                     Y fue así como empezó a funcionar el 6 de septiembre de 1993 en la diagonal 26 P15 N° 
                     93-32 del barrio Marroquín I. Y desde entonces, la institución ha venido mostrando su 
                     superioridad en la educación preescolar, básica y media vocacional, se sufre una 
                     problemática muy variada en algunos hogares como la desintegración familiar, maltrato 
                     infantil, violencia, pandillas, drogadicción y otros.</p>
         <p class="quote">
             "Pon en manos del SEÑOR todas tus obras, y tus proyectos se cumplirán." – Proverbios 17: 3
         </p>
     `,
     uno: `
         <p>En el 2004 se implementó la banda marcial generando un auge positivo a la institución. 
                         En el 2005, se inauguró una nueva sede en la transversal 101 N° 26 0-18 del mismo barrio, 
                         abarcando toda la población necesitada del sector la cual estaba en espera de una planta 
                         física con las características que posee la institución, las cuales son: infraestructura 
                         propia, espacios educativos apropiados, laboratorio de química y física, laboratorio de 
                         inglés, sala de sistemas, salón multipropósito.</p>
     `,
     dos: `
         <p>En el 2008, se logró el convenio con el SENA denominado: "ARTICULACIÓN CON LA MEDIA TÉCNICA", 
                         en donde hasta el momento se han certificado 3 promociones otorgando el título de técnicos 
                         en las especialidades de (asistencia administrativa, instalaciones eléctricas Residenciales 
                         y sistemas), los cuales se encuentran estudiando y laborando en diferentes instituciones 
                         y empresas reconocidas en la ciudad de Cali. Y también se obtiene la certificación en el 
                         nivel de acceso por el modelo europeo de certificación EFQM.</p>
     `,
     tres: `
         <p>En el 2009, gracias al crecimiento de la población se logró la inauguración de otro nuevo 
                         bloque que permitió a los padres de familia y comunidad en general acceder a la educación 
                         con los niños de seis meses en adelante, este nuevo bloque conocido en el sector como LICEO 
                         MIXTO EMPERADOR: MI PRIMERA INFANCIA, ubicada en la transversal 101 # 100- 06, del barrio 
                         Marroquín I en la ciudad de Cali. En el mismo año se realizaron convenios a nivel tecnológico 
                         y universitario con la corporación educativa Antonio Nariño y la Fundación Centro Colombiano 
                         de Estudios Profesionales (FCECEP).</p>
     `,
     cuatro: `
         <p>En el 2012, se logra la certificación de calidad en el Nivel II de excelencia otorgada por 
                         la entidad europea EFQM. También se adquirió una nueva sede ubicada en el barrio urbanización 
                         manantial de la comuna 21 en la ciudad de Cali, denominada LICEO MIXTO EMPERADOR DE CALI SEDE 3.</p>
     `
 };
 
 function changeText(section) {
    const imageContent = document.querySelector('.image-content img');
    const textContent = document.querySelector('.text-content');
    
    if (section === 'inicio') {
        imageContent.classList.add('hidden-image');
        textContent.style.flex = '100'; // Expande más el texto cuando la imagen está oculta
    } else {
        imageContent.classList.remove('hidden-image');
        textContent.style.flex = '1.1'; // Restaura el tamaño original del texto
    }
    
    document.getElementById('history-text').innerHTML = texts[section];
}

// Cargar el texto y la visibilidad de la imagen al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    changeText('inicio');
});
