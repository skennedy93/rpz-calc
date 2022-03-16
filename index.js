//Calculate Feasibility for all rows in table
$("#calculate").click(function(){
  const rPZ10SystemNote = document.getElementById("rPZ10Result");
  rPZ10SystemNote.innerHTML = '';
  var table = document.getElementById("caseTable");
  var tbodyRowCount = table.tBodies[0].rows.length;

  let rPZ10SystemNotes = new Array(22);
  var m = Number(0);
  for (let m=0;m<=rPZ10SystemNotes.length-1;m++){
    rPZ10SystemNotes[m] = 0;
  }

  var k = Number(0);
  var palletSpacerWidth = Number(0);
  var maxOverhangY = Number(0);
  for (let k=0;k<=tbodyRowCount-1;k++){
    var overhangX = Number(document.getElementsByClassName("overhangX")[k].value);
    var overhangY = Number(document.getElementsByClassName("overhangY")[k].value)
    if( overhangX > palletSpacerWidth){
      palletSpacerWidth = overhangX;
    }
    if( overhangY > maxOverhangY){
      maxOverhangY = overhangY;
    }
  }
  palletSpacerWidth = Math.ceil(palletSpacerWidth*2)/2;

  if(palletSpacerWidth > 0){
    rPZ10SystemNotes[1] = 1;
  }
  if(maxOverhangY > 0){
    rPZ10SystemNotes[2] = 1;
  }

  var n = Number(0);
  var conveyorWidth = Number(0);
  for (let n=0;n<=tbodyRowCount-1;n++){
    var caseWidth = Number(document.getElementsByClassName("boxWidth")[n].value);
    if(caseWidth > conveyorWidth){
      conveyorWidth = caseWidth;
    }
  }
  if(conveyorWidth < 17){
    conveyorWidth = 18;
  } else if(conveyorWidth < 20){
    conveyorWidth = 21;
  } else {
    conveyorWidth = 0;
  }

  var j = Number(0);
  for (let j=0;j<=tbodyRowCount-1;j++){
    var palletWidth = Number(40);
    var palletLength = Number(48);
    var robot_X_Offset = Number(11.5);
    var robot_Z_Offset = Number(28.395)+11.2;
    var maxLiftkitHeight = Number(27.559);
    var maxRobotReach = Number(51.1811);
    var liftkitRaisedHeight = Number(0);
    var minSingleCenterLength = Number(12);
    var maxBoxLength_Double = Number(16);
    var maxBoxLength_Single = Number(32);
    var minBoxWidth = Number(6);
    var conveyorXOffset = Number(10.5);
    var conveyorYOffset = Number(24.15);
    var eoAT_X_Offset = Number(document.getElementById("eoAT_X_Offset").value); //inches
    var eoAT_Y_Offset = Number(document.getElementById("eoAT_Y_Offset").value); //inches
    var eoAT_Z_Offset = Number(document.getElementById("eoAT_Z_Offset").value); //inches
    var app_X_Offset = Number(document.getElementById("app_X_Offset").value); //inches
    var app_Y_Offset = Number(document.getElementById("app_Y_Offset").value); //inches
    var app_Z_Offset = Number(document.getElementById("app_Z_Offset").value); //inches
    var conveyorHeight = Number(document.getElementById("conveyorHeight").value);
    var conveyorOrientation = Number(document.getElementById("conveyorOrientation").value);
    var palletOverhangX = Number(document.getElementsByClassName("overhangX")[j].value);
    var palletOverhangY = Number(document.getElementsByClassName("overhangY")[j].value);
    var boxLength = Number(document.getElementsByClassName("boxLength")[j].value); //inches
    var boxWidth = Number(document.getElementsByClassName("boxWidth")[j].value); //inches
    var boxHeight = Number(document.getElementsByClassName("boxHeight")[j].value); //inches
    var palletHeight = Number(document.getElementsByClassName("palletHeight")[j].value); //inches
    var layerCount = Number(document.getElementsByClassName("layerCount")[j].value);
    var boxWeight = Number(document.getElementsByClassName("boxWeight")[j].value); //lbs
    var boxRate = Number(document.getElementsByClassName("boxRate")[j].value); //case per minute
    var sKU = document.getElementsByClassName("SKU")[j].value;
    const note = document.getElementsByClassName("RPZ10NoteText")[j];
    const rPZ10_result = document.getElementsByClassName("RPZ-10")[j];
    const rPZMAX_result = document.getElementsByClassName("RPZ-MAX")[j];
    note.innerHTML = '';
    rPZ10_result.innerHTML = '';
    rPZMAX_result.innerHTML = '';
    let notes = new Array(22);
    var l = Number(0);
    for (let l=0;l<=notes.length-1;l++){
      notes[l] = 0;
    }

    //Check for valid inputs:
    if(sKU != '' && boxWeight > 0 && boxRate > 0 && boxLength > 0 && boxWidth > 0 && boxHeight > 0 && palletHeight > 0 && layerCount > 0 && conveyorHeight > 0 && conveyorOrientation >0 && eoAT_X_Offset > 0 && eoAT_Y_Offset > 0 && eoAT_Z_Offset > 0 && app_X_Offset >= 0 && app_Y_Offset > 0 && app_Z_Offset > 0 ){

    } else {
      note.innerHTML = 'Please enter Valid information. <br>'
      //notes[1] = 1;
      continue //Exit FOR Loop and move to next case
    }

    // Calculate RPZ-10 Center of Gravity:
    var boxCOG_X = Number(eoAT_X_Offset); //inches
    var boxCOG_Y = Number(eoAT_Y_Offset); //inches
    var boxCOG_Z = Number(eoAT_Z_Offset + (0.5 * boxHeight)); //inches
    var eoAT_COG_X = Number(0); //inches
    var eoAT_COG_Y = Number(72.5/25.4); //inches
    var eoAT_COG_Z = Number(66.544/25.4); //inches
    var eoAT_Weight = Number(7.194); // lbs
    var systemWeight = boxWeight + eoAT_Weight;
    var systemCOG_X = ((boxCOG_X*boxWeight)+(eoAT_COG_X*eoAT_Weight))/systemWeight;
    var systemCOG_Y = ((boxCOG_Y*boxWeight)+(eoAT_COG_Y*eoAT_Weight))/systemWeight;
    var systemCOG_Z = ((boxCOG_Z*boxWeight)+(eoAT_COG_Z*eoAT_Weight))/systemWeight;
    var distanceCOG = Math.sqrt(systemCOG_X**2 + systemCOG_Y**2 + systemCOG_Z**2);

    //Calculate RPZ-10 Max Offset Payload based on COG and Case Weight
    if(distanceCOG <= 3.94){
      var maxOffsetPayload = 27.5 - 7.194;
    } else if(distanceCOG <= 5.91){
      var maxOffsetPayload = 38.5 - (2.792 * distanceCOG) - 7.194;
    } else if(distanceCOG <= 13.78){
      var maxOffsetPayload = 25.30 - (0.559 * distanceCOG) - 7.194;
    } else{
      var maxOffsetPayload = 22.73 - (0.372 * distanceCOG) - 7.194;
    }

    //Determine RPZ-10 Singe Pick Type (Offset or Center)
    var singlePickType = Number(0);
    if(boxWeight <= maxOffsetPayload){
      singlePickType = 1; //Single Offset
    } else if(boxWeight > maxOffsetPayload && boxLength >= minSingleCenterLength){
      singlePickType = 0; //Single Center
    } else if(boxWeight > maxOffsetPayload && boxLength < minSingleCenterLength){
      singlePickType = 0; //Single Center
      //note.innerHTML = 'Modified SpiderPik EoAT would be needed to accomodate Single Center Pick. ';
      notes[18] = 1;
    }

    //RPZ-10 Rate & Weight Check
    var pickType_RPZ10 = Number(0);
    if(boxWeight > 20.3){
      pickType_RPZ10 = 0; //Weight is NOT VALID for RPZ-10
      note.innerHTML = 'Case Weight is too heavy for Standard System. <br>'
      //notes[2] = 1;
      rPZ10_result.innerHTML = "&#10060;";
      continue //Exit FOR Loop and move to next case
    }
    if(boxRate > 15){
      pickType_RPZ10 = 0; //Rate is NOT VALID for RPZ-10
      note.innerHTML = 'Case Rate is too fast for Standard System.  <br>'
      //notes[3] = 1;
      rPZ10_result.innerHTML = '<i class="far fa-question-circle"></i>';
      continue //Exit FOR Loop and move to next case
    }
    if(boxLength > maxBoxLength_Single){//Don't Exit FOR LOOP
      pickType_RPZ10 = 0; //Case is too Long for Standard RPZ-10 System
      //note.innerHTML = 'RPZ-10: Case is too Long for Standard System, Extended Guarding Required. '
      notes[19] = 1;
      rPZ10SystemNotes[4] = 1;
      rPZ10_result.innerHTML = '<i class="far fa-question-circle"></i>';
    }
    if(boxWidth < minBoxWidth){//Don't Exit FOR LOOP
      pickType_RPZ10 = 0; //Box is too narrow for Standard SpiderPik EoAT
      //note.innerHTML = 'RPZ-10: Case is too narrow for Standard SpiderPik EoAT, Custom EoAT Required. '
      notes[20] = 1;
      rPZ10SystemNotes[5] = 1;
      rPZ10_result.innerHTML = '<i class="far fa-question-circle"></i>';
      //continue //Exit FOR Loop and move to next case
    }
    if(boxRate > 0 && boxRate <= 5 && boxWeight > 0 && boxWeight <= 20.3){
      pickType_RPZ10 = 11; //Single Pick is VALID
    } else if(boxRate > 5 && boxRate <= 7.5 && boxWeight > 10.15 && boxWeight <= 20.3){
      pickType_RPZ10 = 10; //Single Pick is BORDERLINE
      //note.innerHTML = 'RPZ-10: Single Pick Rate is Borderline (Case Weight too Heavy for Double Pick) for Standard System. ';
      notes[15] = 1;
    } else if(boxRate > 5 && boxRate <= 7.5 && boxWeight > 0 && boxWeight <= 10.15 && boxLength > maxBoxLength_Double){
      pickType_RPZ10 = 10; //Single Pick is BORDERLINE
      //note.innerHTML = 'RPZ-10: Single Pick Rate is Borderline (Case Length too Long for Double Pick) for Standard System. ';
      notes[16] = 1;
    } else if(boxRate > 7.5 && boxWeight > 10.15 && boxWeight <= 20.3){
      pickType_RPZ10 = 0; //Too fast for single pick and too heavy for double
      note.innerHTML = 'Case Weight requires Single Pick, and Rate is too fast for single pick Standard System. <br>'
      //notes[4] = 1;
      rPZ10_result.innerHTML = '<i class="far fa-question-circle"></i>';
      continue //Exit FOR Loop and move to next case
    } else if(boxRate > 5 && boxRate <= 10 && boxWeight > 0 && boxWeight <= 10.15 && boxLength <= maxBoxLength_Double){
      pickType_RPZ10 = 21; //Double Pick is VALID
    } else if(boxRate > 10 && boxRate <= 15 && boxWeight > 0 && boxWeight <= 10.15 && boxLength <= maxBoxLength_Double){
      pickType_RPZ10 = 20; //Double Pick is BORDERLINE
      //note.innerHTML = 'RPZ-10: Double Pick Rate is Borderline for Standard System. ';
      notes[17] = 1;
    } else if(boxRate > 7.5 && boxWeight > 0 && boxWeight <= 10.15 && boxLength > maxBoxLength_Double){
      pickType_RPZ10 = 20; //Rate is too Fast for Single Pick, Box is too Long for Double Pick
      //note.innerHTML = 'RPZ-10: Case Rate is too Fast for Single Pick, and Case is too Long for a Double Pick Standard System, Extended Guarding Required. '
      notes[21] = 1;
      rPZ10SystemNotes[4] = 1;
      rPZ10_result.innerHTML = '<i class="far fa-question-circle"></i>';
      //continue //Exit FOR Loop and move to next case
    }

    if(pickType_RPZ10 == 20 || pickType_RPZ10 == 21){
      var rPZ10_Pick_Type = 'RPZ-10 Pick Type: Double Pick. '
      notes[5] = 1;
    } else if(pickType_RPZ10 == 10 || pickType_RPZ10 == 11){
      if(singlePickType == 1){
        var rPZ10_Pick_Type = 'RPZ-10 Pick Type: Single (Offset). '
        notes[6] = 1;
      } else if(singlePickType == 0){
        var rPZ10_Pick_Type = 'RPZ-10 Pick Type: Single (Center) Pick. '
        notes[7] = 1;
      }
    }

    //Layer Calculations:
    var l1 = Number(1); //First Layer
    var l2 = Math.floor(layerCount/2); //Last Layer with Liftkit DOWN
    var l3 = l2 + 1; //First Layer with Liftkit UP
    var l4 = layerCount; //Last Layer of Pallet

    //RPZ-10 Calculate the Liftkit Height when UP
    //If height of pallet at the time of liftkit move is greater than 700mm, Liftkit will move to 700mm
    if (l2 * boxHeight > maxLiftkitHeight) {
    liftkitRaisedHeight = maxLiftkitHeight;
    } else {
    liftkitRaisedHeight = l2 * boxHeight;
    }

    //Conveyor Reach Checks:
    //Center Conveyor Calculations:
    var pickY_Double_Center = conveyorYOffset + boxLength + maxOverhangY;
    var pickY_SingleOffset_Center = conveyorYOffset + (0.5 * boxLength) + eoAT_X_Offset + maxOverhangY;
    var pickY_SingleCenter_Center = conveyorYOffset + (0.5 * boxLength) + maxOverhangY;
    var pickX_Center = conveyorXOffset + eoAT_Y_Offset - (0.5 * boxWidth);

    //Side Infeed Conveyor Calculations:
    var pickX_Double_Side = conveyorXOffset - boxLength;
    var pickX_SingleOffset_Side_1 = conveyorXOffset - (0.5 * boxLength) + eoAT_X_Offset;
    var pickX_SingleOffset_Side_2 = conveyorXOffset - (0.5 * boxLength) - eoAT_X_Offset;
    var pickX_SingleCenter_Side = conveyorXOffset - (0.5 * boxLength);
    var pickY_Side = conveyorYOffset + (0.5 * boxWidth) + eoAT_Y_Offset + maxOverhangY;

    //Z Pick Height Calculations
    var pickZ1 = conveyorHeight + (2 * boxHeight) + eoAT_Z_Offset - robot_Z_Offset + 2; //Height of Pick Approach at Liftkit Down
    var pickZ2 = conveyorHeight + boxHeight + eoAT_Z_Offset - robot_Z_Offset - liftkitRaisedHeight; //Height of Pick at Liftkit Up

    if(boxLength <= 15){
      var cd1 = Math.sqrt(pickX_Center**2 + pickY_Double_Center**2 + pickZ1**2); //Double Center - LK Down
      var cd2 = Math.sqrt(pickX_Center**2 + pickY_Double_Center**2 + pickZ2**2); //Double Center - LK UP
    }
    else {
      var cd1 = Number(0); //Double Center - LK Down
      var cd2 = Number(0); //Double Center - LK UP
    }
    var cd3 = Math.sqrt(pickX_Center**2 + pickY_SingleOffset_Center**2 + pickZ1**2); //SingleOffset Center - LK Down
    var cd4 = Math.sqrt(pickX_Center**2 + pickY_SingleOffset_Center**2 + pickZ2**2); //SingleOffset Center - LK UP
    var cd5 = Math.sqrt(pickX_Center**2 + pickY_SingleCenter_Center**2 + pickZ1**2); //SingleCenter Center - LK Down
    var cd6 = Math.sqrt(pickX_Center**2 + pickY_SingleCenter_Center**2 + pickZ2**2); //SingleCenter Center - LK UP
    if(boxLength <= 15){
      var cd7 = Math.sqrt(pickX_Double_Side**2 + pickY_Side**2 + pickZ1**2); //Double Side - LK Down
      var cd8 = Math.sqrt(pickX_Double_Side**2 + pickY_Side**2 + pickZ2**2); //Double Side - LK UP
    } else {
      var cd7 = Number(0); //Double Side - LK Down
      var cd8 = Number(0); //Double Side - LK UP
    }
    var cd9 = Math.sqrt(pickX_SingleOffset_Side_1**2 + pickY_Side**2 + pickZ1**2); //SingleOffset Side - LK Down
    var cd10 = Math.sqrt(pickX_SingleOffset_Side_1**2 + pickY_Side**2 + pickZ2**2); //SingleOffset Side - LK UP
    var cd13 = Math.sqrt(pickX_SingleOffset_Side_2**2 + pickY_Side**2 + pickZ1**2); //SingleOffset Side - LK Down
    var cd14 = Math.sqrt(pickX_SingleOffset_Side_2**2 + pickY_Side**2 + pickZ2**2); //SingleOffset Side - LK UP
    var cd11 = Math.sqrt(pickX_SingleCenter_Side**2 + pickY_Side**2 + pickZ1**2); //SingleCenter Side - LK Down
    var cd12 = Math.sqrt(pickX_SingleCenter_Side**2 + pickY_Side**2 + pickZ2**2); //SingleCenter Side - LK UP

    var neededReachPick = Number(0);

    if(conveyorOrientation == 1){
      if(rPZ10_Pick_Type == 'RPZ-10 Pick Type: Double Pick. '){
        neededReachPick = Math.max(cd1,cd2);
      }
      if(rPZ10_Pick_Type == 'RPZ-10 Pick Type: Single (Offset). '){
        neededReachPick = Math.max(cd3,cd4);
        if(neededReachPick > maxRobotReach){
          rPZ10_Pick_Type = 'RPZ-10 Pick Type: Single (Center) Pick. ';
          singlePickType = 0;
          notes[6] = 0;
          notes[7] = 1;
        }
      }
      if(rPZ10_Pick_Type == 'RPZ-10 Pick Type: Single (Center) Pick. '){
        neededReachPick = Math.max(cd5,cd6);
      }
    } else if(conveyorOrientation == 2 || conveyorOrientation == 3){
      if(rPZ10_Pick_Type == 'RPZ-10 Pick Type: Double Pick. '){
        neededReachPick = Math.max(cd7,cd8);
      }
      if(rPZ10_Pick_Type == 'RPZ-10 Pick Type: Single (Offset). '){
        neededReachPick = Math.max(cd9,cd10,cd13,cd14);
        if(neededReachPick > maxRobotReach){
          rPZ10_Pick_Type = 'RPZ-10 Pick Type: Single (Center) Pick. ';
          singlePickType = 0;
          notes[6] = 0;
          notes[7] = 1;
        }
      }
      if(rPZ10_Pick_Type == 'RPZ-10 Pick Type: Single (Center) Pick. '){
        neededReachPick = Math.max(cd11,cd12);
      }
    }

    if(neededReachPick > maxRobotReach){
        //note.innerHTML = note.innerHTML + 'Pick Reach is not valid (' + parseFloat(neededReachPick).toFixed(2) + '"). ';
        notes[8] = 1;
        rPZ10_result.innerHTML = '<i class="far fa-question-circle"></i>';
    }

    //RPZ-10 Reach Calculation:

    //Loop through 4 potential reach calculations for RPZ-10
    //Stop Loop once a valid reach condition is met
    //1. Normal reach
    //2. Reduce Y Approach by 1"
    //3. Reduce Z Approach by 1"
    //4. Increase EoAT Y Offset by 1"
    var layerAboveApproach = Number(1);
    for(let i=1;i<=5;i++){
      if(i==2){
        layerAboveApproach = Number(0);
      } else if(i==3){
        app_Y_Offset--;
      } else if (i==4) {
        app_Z_Offset--;
      } else if (i==5) {
        eoAT_Y_Offset++;
      }

      //Calculate X and Y Coordinate of Robot Tool Flange for a Horizontal and Vertical box at the far back corner of the pallet:
      //Calculation of X & Y is dependant on Pick Type:
      if(pickType_RPZ10 == 20 || pickType_RPZ10 == 21){
        var xHorizontal = palletWidth + robot_X_Offset - boxLength + app_X_Offset + palletSpacerWidth + palletOverhangX;
        var xVertical = palletWidth + robot_X_Offset - eoAT_Y_Offset - (0.5*boxWidth) + app_X_Offset + palletSpacerWidth + palletOverhangX;
        var yHorizontal = (0.5 * palletLength) - eoAT_Y_Offset - (0.5 * boxWidth) + app_Y_Offset + palletOverhangY;
        var yVertical = (0.5 * palletLength) - boxLength + app_Y_Offset + palletOverhangY;
        rPZ10_Pick_Type = 'RPZ-10 Pick Type: Double Pick. ';
      } else if(pickType_RPZ10 == 10 || pickType_RPZ10 == 11){
        if(singlePickType == 1){
          var xHorizontal = palletWidth + robot_X_Offset - eoAT_X_Offset - (0.5 * boxLength) + app_X_Offset + palletSpacerWidth + palletOverhangX;
          var xVertical = palletWidth + robot_X_Offset - eoAT_Y_Offset - (0.5*boxWidth) + app_X_Offset + palletSpacerWidth + palletOverhangX;
          var yHorizontal = (0.5 * palletLength) - eoAT_Y_Offset - (0.5 * boxWidth) + app_Y_Offset + palletOverhangY;
          var yVertical = (0.5 * palletLength) - eoAT_X_Offset - (0.5*boxLength) + app_Y_Offset + palletOverhangY;
          rPZ10_Pick_Type = 'RPZ-10 Pick Type: Single (Offset). ';
        } else if(singlePickType == 0){
          var xHorizontal = palletWidth + robot_X_Offset - (0.5 * boxLength) + app_X_Offset + palletSpacerWidth + palletOverhangX;
          var xVertical = palletWidth + robot_X_Offset - eoAT_Y_Offset - (0.5*boxWidth) + app_X_Offset + palletSpacerWidth + palletOverhangX;
          var yHorizontal = (0.5 * palletLength) - eoAT_Y_Offset - (0.5 * boxWidth) + app_Y_Offset + palletOverhangY;
          var yVertical = (0.5 * palletLength) - (0.5*boxLength) + app_Y_Offset + palletOverhangY;
          rPZ10_Pick_Type = 'RPZ-10 Pick Type: Single (Center) Pick. ';
        }
      }

      var z1 = palletHeight + eoAT_Z_Offset - robot_Z_Offset + boxHeight;
      var z2 = palletHeight + eoAT_Z_Offset - robot_Z_Offset + app_Z_Offset + (boxHeight * (l2 + layerAboveApproach));
      var z3 = palletHeight + eoAT_Z_Offset - robot_Z_Offset - liftkitRaisedHeight + (boxHeight * l3);
      var z4 = palletHeight + eoAT_Z_Offset - robot_Z_Offset - liftkitRaisedHeight + app_Z_Offset + (boxHeight * (l4 + layerAboveApproach));
      var d1 = Math.sqrt(xHorizontal**2 + yHorizontal**2 + z1**2);
      var d2 = Math.sqrt(xVertical**2 + yVertical**2 + z1**2);
      var d3 = Math.sqrt(xHorizontal**2 + yHorizontal**2 + z2**2);
      var d4 = Math.sqrt(xVertical**2 + yVertical**2 + z2**2);
      var d5 = Math.sqrt(xHorizontal**2 + yHorizontal**2 + z3**2);
      var d6 = Math.sqrt(xVertical**2 + yVertical**2 + z3**2);
      var d7 = Math.sqrt(xHorizontal**2 + yHorizontal**2 + z4**2);
      var d8 = Math.sqrt(xVertical**2 + yVertical**2 + z4**2);
      var neededReach = Math.max(d1,d2,d3,d4,d5,d6,d7,d8);

      if(neededReach<maxRobotReach){
        if(i==1){
          //note.innerHTML = note.innerHTML + rPZ10_Pick_Type + "RPZ-10: Standard Setup. ";
          notes[9] = 1;
        } else if(i==2){
          //note.innerHTML = note.innerHTML + rPZ10_Pick_Type + 'RPZ-10: Same Layer Approach Needed. ';
          notes[10] = 1;
        } else if(i==3){
          //note.innerHTML = note.innerHTML + rPZ10_Pick_Type + 'RPZ-10: Same Layer Approach Needed, Y Approach Reduced to ' + app_Y_Offset + '". ';
          notes[10] = 1;
          notes[11] = 1;
        } else if(i==4){
          //note.innerHTML = note.innerHTML + rPZ10_Pick_Type + 'RPZ-10: Same Layer Approach Needed, Y Approach Reduced to ' + app_Y_Offset + '" AND Z Approach Reduced to ' + app_Z_Offset + '". ';
          notes[10] = 1;
          notes[11] = 1;
          notes[12] = 1;
        } else if(i==5){
          //note.innerHTML = note.innerHTML + rPZ10_Pick_Type + 'RPZ-10: Same Layer Approach Needed, Y Approach Reduced to ' + app_Y_Offset + '" AND Z Approach Reduced to ' + app_Z_Offset + '" AND EoAT Y Offset Increased to ' + eoAT_Y_Offset + '". ';
          notes[10] = 1;
          notes[11] = 1;
          notes[12] = 1;
          notes[13] = 1;
          rPZ10SystemNotes[6] = eoAT_Y_Offset;
        }
        break;
      } else {
        if(i==5){
          //note.innerHTML = note.innerHTML + 'RPZ-10: Further review of Pallet Pattern is required. ' + 'Needed Reach: ' + parseFloat(neededReach).toFixed(2) + '". ';
          notes[14] = 1;
          break;
        }
        continue;
      }
    }

    //RPZ-10 Results:
    if(neededReach<maxRobotReach){
      if(pickType_RPZ10 == 11 || pickType_RPZ10 == 21){
        if(rPZ10_result.innerHTML != '<i class="far fa-question-circle"></i>'){
        rPZ10_result.innerHTML = "&#10004;";
        }
      } else if(pickType_RPZ10 == 10 || pickType_RPZ10 == 20){
        rPZ10_result.innerHTML = '<i class="far fa-question-circle"></i>';
      }
    } else {
      rPZ10_result.innerHTML = '<i class="far fa-question-circle"></i>';
    }

    //RPZ-10 Notes:
    if(notes[5] == 1){
      note.innerHTML = "Pick Type: Double Pick. <br>";
    }
    if(notes[6] == 1){
      note.innerHTML = "Pick Type: Single (Offset) Pick. <br>";
    }
    if(notes[7] == 1){
      note.innerHTML = "Pick Type: Single (Center) Pick. <br>";
    }
    if(notes[8] == 1){
      note.innerHTML = note.innerHTML + 'Pick Reach is not valid (' + parseFloat(neededReachPick).toFixed(2) + '"). <br>';
    }
    if(notes[9] == 1){
      note.innerHTML = note.innerHTML + 'Standard Setup. <br>';
    }
    if(notes[10] == 1){
      note.innerHTML = note.innerHTML + 'Same Layer Approach Needed. <br>';
    }
    if(notes[11] == 1){
      note.innerHTML = note.innerHTML + 'Y Approach Reduced to ' + app_Y_Offset + '". <br>';
    }
    if(notes[12] == 1){
      note.innerHTML = note.innerHTML + 'Z Approach Reduced to ' + app_Z_Offset + '". <br>';
    }
    if(notes[13] == 1){
      note.innerHTML = note.innerHTML + 'EoAT Y Offset Increased to ' + eoAT_Y_Offset + '". <br>';
    }
    if(notes[14] == 1){
      note.innerHTML = note.innerHTML + 'Further review of Pallet Pattern is required. ' + 'Needed Reach: ' + parseFloat(neededReach).toFixed(2) + '". <br>';
    }
    if(notes[15] == 1){
      note.innerHTML = note.innerHTML + 'Single Pick Rate is Borderline (Case Weight too Heavy for Double Pick) for Standard System. <br>';
    }
    if(notes[16] == 1){
      note.innerHTML = note.innerHTML + 'Single Pick Rate is Borderline (Case Length too Long for Double Pick) for Standard System. <br>';
    }
    if(notes[17] == 1){
      note.innerHTML = note.innerHTML + 'Double Pick Rate is Borderline for Standard System. <br>';
    }
    if(notes[18] == 1){
      note.innerHTML = note.innerHTML + 'Modified SpiderPik EoAT would be needed to accomodate Single Center Pick (Case too Short for Standard). <br>';
    }
    if(notes[19] == 1){
      note.innerHTML = note.innerHTML + 'Case is too Long for Standard System, Extended Guarding Required. <br>';
    }
    if(notes[20] == 1){
      note.innerHTML = note.innerHTML + 'Case is too narrow for Standard SpiderPik EoAT, Custom EoAT Required. <br>';
    }
    if(notes[21] == 1){
      note.innerHTML = note.innerHTML + 'Case Rate is too Fast for Single Pick, and Case is too Long for a Double Pick Standard System, Extended Guarding Required. <br>';
    }

//System Notes (RPZ-10)
    if(conveyorWidth > 0){
      rPZ10SystemNote.innerHTML = '&#8226; System will need a(n) ' + conveyorWidth + '"BF Conveyor. <br>';
    } else {
      rPZ10SystemNote.innerHTML = '&#8226; Cases too wide for Standard Conveyor';
    }
    if(rPZ10SystemNotes[1] == 1){
      rPZ10SystemNote.innerHTML = rPZ10SystemNote.innerHTML + '&#8226; System will need a ' + palletSpacerWidth + '" Pallet Spacer. <br>';
    }
    if(rPZ10SystemNotes[2] == 1){
      rPZ10SystemNote.innerHTML = rPZ10SystemNote.innerHTML + '&#8226; System will need a ' + maxOverhangY + '" Conveyor Space. <br>';
    }
    if(rPZ10SystemNotes[4] == 1){
      rPZ10SystemNote.innerHTML = rPZ10SystemNote.innerHTML + '&#8226; Extended Guarding Required for Longer Cases. <br>';
    }
    if(rPZ10SystemNotes[5] == 1){
      rPZ10SystemNote.innerHTML = rPZ10SystemNote.innerHTML + '&#8226; Custom EoAT Required for Narrow Cases. <br>';
    }
    if(rPZ10SystemNotes[6] > 0){
      rPZ10SystemNote.innerHTML = rPZ10SystemNote.innerHTML + '&#8226; Custom EoAT Required (Y Offset: ' + rPZ10SystemNotes[6] + '"). <br>';
    }

  }

  rPZ_MAX_Check();
})

function rPZ_MAX_Check(){
  var table = document.getElementById("caseTable");
  var tbodyRowCount = table.tBodies[0].rows.length;

  var conveyorHeight = Number(document.getElementById("conveyorHeight").value);
  var conveyorOrientation = Number(document.getElementById("conveyorOrientation").value);
  const rPZMAXSystemNote = document.getElementById("rPZMAXResult");
  rPZMAXSystemNote.innerHTML = '';

  var j = Number(0);
  for (let j=0;j<=tbodyRowCount-1;j++){
    var maxBoxLength_Double = Number(16);
    var maxBoxLength_Single = Number(32);
    var minBoxWidth = Number(6);
    var eoAT_Weight_RpzMax_Single = Number(16); // lbs
    var eoAT_Weight_RpzMax_Double = Number(24); // lbs
    var boxLength = Number(document.getElementsByClassName("boxLength")[j].value); //inches
    var boxWidth = Number(document.getElementsByClassName("boxWidth")[j].value); //inches
    var boxHeight = Number(document.getElementsByClassName("boxHeight")[j].value); //inches
    var boxWeight = Number(document.getElementsByClassName("boxWeight")[j].value); //lbs
    var boxRate = Number(document.getElementsByClassName("boxRate")[j].value); //case per minute
    var palletHeight = Number(document.getElementsByClassName("palletHeight")[j].value); //inches
    var layerCount = Number(document.getElementsByClassName("layerCount")[j].value);
    var palletOverhangX = Number(document.getElementsByClassName("overhangX")[j].value);
    var palletOverhangY = Number(document.getElementsByClassName("overhangY")[j].value);
    var sKU = document.getElementsByClassName("SKU")[j].value;
    const note = document.getElementsByClassName("RPZMaxNoteText")[j];
    const rPZMAX_result = document.getElementsByClassName("RPZ-MAX")[j];
    note.innerHTML = '';

    //Check for valid inputs:
    if(sKU != '' && boxWeight > 0 && boxRate > 0 && boxLength > 0 && boxWidth > 0 && boxHeight > 0 && palletHeight > 0 && layerCount > 0 && conveyorHeight > 0 && conveyorOrientation >0){

    } else {
      note.innerHTML = 'Please enter Valid information. '
      continue //Exit FOR Loop and move to next case
    }


    //RPZ-MAX Weight / Rate / Length Checks:
    var maxSingleCaseWeight = Number(66 - eoAT_Weight_RpzMax_Single);
    var maxDoubleCaseWeight = Number((66 - eoAT_Weight_RpzMax_Double)/2);


    if(boxRate > 20){
      note.innerHTML = note.innerHTML + 'Case Rate is too Fast for Standard System. <br>';
      rPZMAX_result.innerHTML = '<i class="far fa-question-circle"></i>';
    } else if(boxWeight > maxSingleCaseWeight){
      note.innerHTML = note.innerHTML + 'Case Weight is too Heavy for Standard System. <br>';
      rPZMAX_result.innerHTML = "&#10060;";
    } else if(boxLength > maxBoxLength_Single && boxRate <= 8){
      note.innerHTML = note.innerHTML + 'Pick Type: Single Pick. <br> Case is too Long for Standard System, Extended Guarding Required. <br>';
      rPZMAXSystemNote.innerHTML = 'Extended Guarding Required for Longer Cases. <br>';
      rPZMAX_result.innerHTML = '<i class="far fa-question-circle"></i>';
    } else if(boxLength > maxBoxLength_Single && boxRate > 8 && boxRate <= 10){
      note.innerHTML = note.innerHTML + 'Pick Type: Single Pick. <br> Single Pick Rate is Borderline for Standard RPZ-MAX System. <br> Case is too Long for Standard System, Extended Guarding Required. <br>';
      rPZMAXSystemNote.innerHTML = 'Extended Guarding Required for Longer Cases. <br>';
      rPZMAX_result.innerHTML = '<i class="far fa-question-circle"></i>';
    } else if(boxLength > maxBoxLength_Single && boxRate > 10 && boxWeight <= maxDoubleCaseWeight){
      note.innerHTML = note.innerHTML + 'Case Length requires Single Pick, and Case Rate is too Fast for Standard System. <br>';
      rPZMAX_result.innerHTML = '<i class="far fa-question-circle"></i>';
    } else if(boxLength > maxBoxLength_Single && boxRate > 10 && boxWeight > maxDoubleCaseWeight){
      note.innerHTML = note.innerHTML + 'Case Length and Weight requires Single Pick, and Case Rate is too Fast for Standard System. <br>';
      rPZMAX_result.innerHTML = '<i class="far fa-question-circle"></i>';
    } else if(boxRate > 10 && boxWeight > maxDoubleCaseWeight){
      note.innerHTML = note.innerHTML + 'Case Weight requires Single Pick, and Case Rate is too fast for single pick Standard System. <br>';
      rPZMAX_result.innerHTML = '<i class="far fa-question-circle"></i>';
    } else if(boxRate <= 8 && boxWeight <= maxSingleCaseWeight){
      note.innerHTML = note.innerHTML + 'Pick Type: Single Pick. <br> Standard Setup. <br>';
      rPZMAX_result.innerHTML = "&#10004;";
    } else if(boxRate > 8 && boxRate <= 16 && boxWeight <= maxDoubleCaseWeight && boxLength <= maxBoxLength_Double){
      note.innerHTML = note.innerHTML + 'Pick Type: Double Pick. <br> Standard Setup. <br>';
      rPZMAX_result.innerHTML = "&#10004;";
    } else if(boxRate > 8 && boxRate <=10){
      note.innerHTML = note.innerHTML + 'Pick Type: Single Pick. <br> Single Pick Rate is Borderline for Standard System. <br>';
      rPZMAX_result.innerHTML = '<i class="far fa-question-circle"></i>';
    } else if(boxRate > 16 && boxWeight <= maxDoubleCaseWeight && boxLength <= maxBoxLength_Double){
      note.innerHTML = note.innerHTML + 'Pick Type: Double Pick. <br> Double Pick Rate is Borderline for Standard System. <br>';
      rPZMAX_result.innerHTML = '<i class="far fa-question-circle"></i>';
    } else if(boxRate > 10 && boxLength > maxBoxLength_Double) {
      note.innerHTML = note.innerHTML + 'Case Rate requires Double Pick, and Case Length is too Long for Double Pick Standard System, Extended Guarding Required.  <br>';
      rPZMAXSystemNote.innerHTML = 'Extended Guarding Required for Longer Cases. <br>';
      rPZMAX_result.innerHTML = '<i class="far fa-question-circle"></i>';
    }
  }

  const rPZ10SystemNote = document.getElementById("rPZ10Result");
  var rPZ10NotesDisplay = document.getElementsByClassName("rPZ10SystemNotes")[0];
  if(rPZ10SystemNote.innerHTML != ''){
    rPZ10NotesDisplay.style.display = "block";
  } else {
    rPZ10NotesDisplay.style.display = "none";
  }

  var rPZMAXNotesDisplay = document.getElementsByClassName("rPZMAXSystemNotes")[0];
  if(rPZMAXSystemNote.innerHTML != ''){
    rPZMAXNotesDisplay.style.display = "block";
  } else {
    rPZMAXNotesDisplay.style.display = "none";
  }

}

// Add new Row to Case Scope Table:
$("#addRow").click(function(){
  var table = document.getElementById("caseTable");
  var row = table.insertRow(-1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  var cell8 = row.insertCell(7);
  var cell9 = row.insertCell(8);
  var cell10 = row.insertCell(9);
  var cell11 = row.insertCell(10);
  cell1.innerHTML = '<input type="text" class="form-control input-sm SKU" name="">';
  cell2.innerHTML = '<input type="number" class="form-control input-sm boxWeight" name="">';
  cell3.innerHTML = '<input type="number" class="form-control input-sm boxRate" name="">';
  cell4.innerHTML = '<input type="number" class="form-control input-sm boxLength" name=""><input type="number" class="form-control input-sm boxWidth" name=""><input type="number" class="form-control input-sm boxHeight" name="">';
  cell5.innerHTML = '<input type="number" class="form-control input-sm palletHeight" name="" value=5.6>';
  cell6.innerHTML = '<input type="number" class="form-control input-sm layerCount" name="">';
  cell7.innerHTML = '<input type="number" class="form-control input-sm overhangX" name="" value=0><input type="number" class="form-control input-sm overhangY" name="" value=0>';
  cell8.innerHTML = '<p class="RPZ-10 icon"></p>';
  cell9.innerHTML = '<p class="RPZ-MAX icon"></p>';
  cell10.innerHTML = '<p class="RPZ10NoteText"></p>';
  cell11.innerHTML = '<p class="RPZMaxNoteText"></p>';
})
