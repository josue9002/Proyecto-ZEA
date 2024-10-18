function showBranch(branchId) {
    // Ocultar todas las sedes
    var branches = document.querySelectorAll('.branch');
    branches.forEach(function(branch) {
        branch.classList.remove('active');
    });

    // Quitar la clase activa de todos los botones
    var buttons = document.querySelectorAll('.branch-btn');
    buttons.forEach(function(button) {
        button.classList.remove('active');
    });

    // Mostrar la sede seleccionada
    document.getElementById(branchId).classList.add('active');

    // Activar el botón correspondiente
    event.currentTarget.classList.add('active');
}
