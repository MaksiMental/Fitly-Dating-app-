/**
 * O notation
 * O (n*Log n)
 * Merge sort følger "Divide and Conquer" til at sortere elementer rekursivt. Vi opdeler således problemer i mindre
 * - subproblemer og kombinerer løsningerne af dem til at finde den samlede løsning
 */

//MERGESORT
// Split the array into halves and merge them recursively
function mergeSort(array) {
  if (array.length === 1) {
    // Return once we hit an array with a single item
    return array;
  }

  // Get the middle item of the array rounded down by creating a variable
  const middle = Math.floor(array.length / 2);
  // Create a variable for the items on the left side
  const left = array.slice(0, middle);
  // Create a variable for the items on the right side
  const right = array.slice(middle);

  return merge(mergeSort(left), mergeSort(right));
}

// Compare the arrays item by item and return the concatenated result
//Man sammenligner left og right for at rykke de mindste mod venstre og største mod højre
//Hvis fx. tallet til venstre er mindre end det til højre skal det tal tilføjes til result arrayet som er det uden duplikater
//Hvis det allerede findes, loopes videre.
function merge(left, right) {
  let result = [];
  let indexLeft = 0;
  let indexRight = 0;
  //Mens indexleft er mindre end længden på left og index right er mindre end længden på right, så kører if statememtet.
  while (indexLeft < left.length && indexRight < right.length) {
    //Hvis venstre index er mindre end højre og resultatet allerede har left index i arrayet, så hopper vi videre (altså undgår at tilføje en der allerede er i arrayet)
    if (left[indexLeft] < right[indexRight]) {
      if (result.includes(left[indexLeft])) {
        indexLeft++;
        //Hvis indexleft ikke er i result arrayet så pushes den ind og vi itterer videre i loopet
      } else {
        result.push(left[indexLeft]);
        indexLeft++;
      }
      //Det samme gælder for right, at hvis den er mindre end left, tjekkes det om det er i result arrayet, hvis den er tilføjers den ikke og der loopes videre
    } else {
      if (result.includes(right[indexRight])) {
        indexRight++;
        //Ellers pushes den til result
      } else {
        result.push(right[indexRight]);
        indexRight++;
      }
    }
  }

  //Her samles de to arrays
  return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight));
}

// Eksporter moduler til brug i dbConnect
module.exports.mergeSort = mergeSort;
module.exports.merge = merge
