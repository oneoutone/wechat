/**
 * Created by harris on 16/8/24.
 */
function to_csv(workbook) {
  var result = [];
  workbook.SheetNames.forEach(function(sheetName) {
    //var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    if(csv.length > 0){
      result.push("SHEET: " + sheetName);
      result.push("");
      result.push(csv);
      console.log(">>>>>>get csv");
      console.log(csv);
    }
  });
  return result.join("\n");
}

function to_json(workbook) {
  var result = {};
  workbook.SheetNames.forEach(function(sheetName) {
    var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    //var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if(roa.length > 0){
      result[sheetName] = roa;
    }
  });
  return result;
}

function process_wb(wb, type) {
  var output = "";
  switch(type) {
    case "json":
      //output = JSON.stringify(to_json(wb), 2, 2);
      output = to_json(wb);
      break;
    case "form":
      output = to_formulae(wb);
      break;
    default:
      output = to_csv(wb);
  }
  return output;
}
