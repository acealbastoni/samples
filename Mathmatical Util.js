function sumArrayElements_(inputArr) {
  var sum = 0;
  for (var i = 0; i < inputArr.length; i++) {
    sum = sum + inputArr[i];
  }
  return sum;
}

function standardDeviation_(values,avg) {
  var squareDiffs = values.map(function (value) { var diff = value - avg; var sqrDiff = diff * diff; return sqrDiff; });
  var sum = sumArrayElements_(squareDiffs);
  var nMinus1 = (values.length - 1);
  var variance = sum / nMinus1;
  return Math.sqrt(variance);
}

function getAverage_(data) {
  var sum = data.reduce(function (sum, value) {
    return sum + value;
  }, 0);
  var avg = sum / data.length;
  return avg;
}


function countOfMinusOnes_(last30DaySumsArr) {
    var count = 0;
    for (var i = 0; i < last30DaySumsArr.length; ++i) {
        if (last30DaySumsArr[i] == -1)
            count++;
    }
    return count;
}

function countOfZeros_(last30DaySumsArr) {
  var count = 0;
  for (var i = 0; i < last30DaySumsArr.length; ++i) {
    if (last30DaySumsArr[i] == 0)
      count++;
  }
  return count;
}

function returnID_(recentValue,last30DaySumsArr)
{
    last30DaySumsArr.shift();
    last30DaySumsArr.push(recentValue);
    return "ID";
}
function removeMinusOnes_(last30WearSumsArr) {
    var newArrWithoutMinusOnes = last30WearSumsArr.slice();
    for (var i = 0; i < newArrWithoutMinusOnes.length; i++) {
        if (newArrWithoutMinusOnes[i] === -1) {
            newArrWithoutMinusOnes.splice(i, 1);
        }
    }
    return newArrWithoutMinusOnes  // the Comppared Array
}
