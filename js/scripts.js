// $(document).ready(function(){

// })

// $(window).resize(function() {
//     // Window resize event listener
// });

// $(document).keydown(function(e){
//     // keydown script
//     // Website for all key codes:
//     // http://gcctech.org/csc/javascript/javascript_keycodes.htm
// 	if (e.which == 81 && rotateTileAllowed == true) { 
// 		rotateTileCounterClockwiseFunction();
// 		return false;
// 	}
// });

// $(document).on('mouseenter','#el',function(){
// 	// mouseenter event listener
// });

// $(document).on('mouseleave','#el',function(){
// 	// mouseleave event listener
// });


function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function openInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
  }

function returnDuplicates(arr, arr2) {
    var ret = [];
    for(var i in arr) {   
        if(arr2.indexOf(arr[i]) > -1){
            ret.push(arr[i]);
        }
    }
    return ret.toString();
};


function allPossibleCases(arr) {
	if (arr.length === 0) {
		return [];
	} else if (arr.length ===1) {
		return arr[0];
	} else {
		var result = [];
		var allCasesOfRest = allPossibleCases(arr.slice(1));  // recur with the rest of array
		for (var c in allCasesOfRest) {
			for (var i = 0; i < arr[0].length; i++) {
				result.push(`${arr[0][i]} ${allCasesOfRest[c]}`);
			}
		}
		return result;
	}
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}