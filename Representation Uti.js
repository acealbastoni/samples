//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function getWearRepresentation(todayWearValue, last30WearSumsArr) {
    var comparedArray = removeMinusOnes_(last30WearSumsArr)// new array without -1 Ones Values,
    var wearAnomally = getWearFenceRepresentation_(todayWearValue, comparedArray);
    last30WearSumsArr.shift();
    last30WearSumsArr.push(todayWearValue);
    return wearAnomally;
}

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function getActivtiyRepresentation(todayPeriodValue, last30PeriodSumsArr) {
    var comparedArray = removeMinusOnes_(last30PeriodSumsArr)// new array without -1 Ones Values,
    var periodAnomally = getActivityFenceRepresentation_(todayPeriodValue, comparedArray);
    last30PeriodSumsArr.shift();
    last30PeriodSumsArr.push(todayPeriodValue);
    return periodAnomally;
}

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function getWearFenceRepresentation_(todayHoursSummitionValue, las30DaySumms)  {
  var mean = getAverage_(las30DaySumms);
  var SD = standardDeviation_(las30DaySumms, mean);
  if ((mean == 0 && SD == 0) || countOfZeros_(las30DaySumms) > 15  || countOfMinusOnes_(las30DaySumms)>15  ) {
    return "ID";
  }
  else if (todayHoursSummitionValue >= mean + (4 * SD))
  return "W+++";
  else if ((todayHoursSummitionValue >= mean + (3* SD)) && (todayHoursSummitionValue < (mean + (4 * SD)))  )
  return "W++";
  else if ((todayHoursSummitionValue >= mean + (2 * SD)) && (todayHoursSummitionValue < (mean + (3 * SD))) )
  return "W+";
  else if (todayHoursSummitionValue <= mean - (4 * SD))
  return "W---";
  else if ((todayHoursSummitionValue <= mean - (3 * SD)) && (todayHoursSummitionValue > (mean - (4 * SD))) )
  return "W--";
  else if ((todayHoursSummitionValue <= mean - (2* SD)) && (todayHoursSummitionValue >  (mean - (3 * SD))) )
  return "W-";
  else
    return "N";  //Not Anomall
}

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function getActivityFenceRepresentation_(todayPeriodSummitionValue, last30PeriodSumsArr) {
    var mean = getAverage_(last30PeriodSumsArr);
    var SD = standardDeviation_(last30PeriodSumsArr, mean);

    if ((mean == 0 && SD == 0) || countOfZeros_(last30PeriodSumsArr) > 15 || countOfMinusOnes_(last30PeriodSumsArr) > 15) {
        return "ID";
    }
    else if (todayPeriodSummitionValue >= mean + (4 * SD))
        return "A+++";
    else if ((todayPeriodSummitionValue >= mean + (3 * SD)) && (todayPeriodSummitionValue < (mean + (4 * SD))))
        return "A++";
    else if ((todayPeriodSummitionValue >= mean + (2 * SD)) && (todayPeriodSummitionValue < mean + (3 * SD)))
        return "A+";
    else if (todayPeriodSummitionValue <= mean - (4 * SD))
        return "A---";
    else if ((todayPeriodSummitionValue <= mean - (3 * SD)) && (todayPeriodSummitionValue > mean - (4 * SD)))
        return "A--";
    else if ((todayPeriodSummitionValue <= mean - (2 * SD)) && (todayPeriodSummitionValue > mean - (3 * SD)))
        return "A-";
    else
        return "N";
}
