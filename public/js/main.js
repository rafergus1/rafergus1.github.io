let addIngredientBtn = document.getElementById('btnAddIngredient');
let ingredientList = document.querySelector('.ingredientList');
let ingredientDiv = document.querySelectorAll('.ingredientDiv')[0];
let btnInitialIngredientRemove = ingredientDiv.querySelector('.ingredient-delete');

function deleteIngredient() {
	// Do not allow to remove the ingredient if it is the only one left
	let ingredientCount = ingredientList.children.length - 1;  // Subtract one so as to not count the main "Ingredients" label.
	if (ingredientCount > 1) {
		// Remove this ingredient element
		this.parentElement.remove();
	}
}

// Add the remeove button event to the initial ingredient's button
btnInitialIngredientRemove.addEventListener('click', deleteIngredient);

addIngredientBtn.addEventListener('click', function() {
	// Copy the first ingredient object
	let newIngredient = ingredientDiv.cloneNode(true);

	// Get the members of the ingredient div so we can do some stuff
	let frmIngredient = newIngredient.querySelector('.ingredient');
	let frmIngredientQty = newIngredient.querySelector('.ingredient-qty');
	let frmIngredientUnit = newIngredient.querySelector('.ingredient-units');
	let btnDeleteIngredient = newIngredient.querySelector('.ingredient-delete');

	// Reset the values from the one we cloned so the new one is empty
	frmIngredient.value = '';
	frmIngredientQty.value = '';
	frmIngredientUnit.value = 'floz';

	// Add the event handler to the delete button
	btnDeleteIngredient.addEventListener('click', deleteIngredient);

	// Add the new ingredient object to the list
	ingredientList.appendChild(newIngredient);
});
