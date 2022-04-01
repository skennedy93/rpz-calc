(function ($) {

  let rPZ10SystemNote = $("#rPZ10Result");

  let rPZ_MAX_Check = function () {

    var conveyorHeight = Number($("#conveyorHeight").val());
    var conveyorOrientation = Number($("#conveyorOrientation").val());
    const rPZMAXSystemNote = $("#rPZMAXResult");
    rPZMAXSystemnote.html('');

    let caseTables = $(".casetable");

    let maxBoxLength_Double = Number(16);
    let maxBoxLength_Single = Number(32);
    let minBoxWidth = Number(6);
    let eoAT_Weight_RpzMax_Single = Number(16); // lbs
    let eoAT_Weight_RpzMax_Double = Number(24); // lbs

    caseTables.each(function () {
      let el = $(this);

      let boxLength = Number(el.find(".boxLength").val()); //inches
      let boxWidth = Number(el.find(".boxWidth").val()); //inches
      let boxHeight = Number(el.find(".boxHeight").val());  //inches
      let boxWeight = Number(el.find(".boxWeight").val());   //lbs
      let boxRate = Number(el.find(".boxRate").val());  //case per minute
      let palletHeight = Number(el.find(".palletHeight").val());   //inches
      let layerCount = Number(el.find(".layerCount").val());
      let palletOverhangX = Number(el.find(".overhangX").val());
      let palletOverhangY = Number(el.find(".overhangY").val());
      let sKU = el.find(".SKU").val();

      let note = el.find(".RPZMaxNoteText");
      note.html('');

      let rPZMAX_result = el.find(".RPZ-MAX");

      //Check for valid inputs:
      if (sKU != '' && boxWeight > 0 && boxRate > 0 && boxLength > 0 && boxWidth > 0 && boxHeight > 0 && palletHeight > 0 && layerCount > 0 && conveyorHeight > 0 && conveyorOrientation > 0) {

      } else {
        note.html('Please enter Valid information. ');
      }


      //RPZ-MAX Weight / Rate / Length Checks:
      let maxSingleCaseWeight = Number(66 - eoAT_Weight_RpzMax_Single);
      let maxDoubleCaseWeight = Number((66 - eoAT_Weight_RpzMax_Double) / 2);


      if (boxRate > 20) {
        note.html(note.html() + 'Case Rate is too Fast for Standard System. <br>');

        rPZMAX_result.html('<i class="far fa-question-circle"></i>');
      } else if (boxWeight > maxSingleCaseWeight) {

        note.html(note.html() + 'Case Weight is too Heavy for Standard System. <br>');

        rPZMAX_result.html("&#10060;");

      } else if (boxLength > maxBoxLength_Single && boxRate <= 8) {
        note.html(note.html() + 'Pick Type: Single Pick. <br> Case is too Long for Standard System, Extended Guarding Required. <br>');

        rPZMAXSystemnote.html('Extended Guarding Required for Longer Cases. <br>');
        rPZMAX_result.html('<i class="far fa-question-circle"></i>');


      } else if (boxLength > maxBoxLength_Single && boxRate > 8 && boxRate <= 10) {
        note.html(note.html() + 'Pick Type: Single Pick. <br> Single Pick Rate is Borderline for Standard RPZ-MAX System. <br> Case is too Long for Standard System, Extended Guarding Required. <br>');

        rPZMAXSystemnote.html('Extended Guarding Required for Longer Cases. <br>');

        rPZMAX_result.html('<i class="far fa-question-circle"></i>');

      } else if (boxLength > maxBoxLength_Single && boxRate > 10 && boxWeight <= maxDoubleCaseWeight) {

        note.html(note.html() + 'Case Length requires Single Pick, and Case Rate is too Fast for Standard System. <br>');
        rPZMAX_result.html('<i class="far fa-question-circle"></i>');

      } else if (boxLength > maxBoxLength_Single && boxRate > 10 && boxWeight > maxDoubleCaseWeight) {

        note.html(note.html() + 'Case Length and Weight requires Single Pick, and Case Rate is too Fast for Standard System. <br>');
        rPZMAX_result.html('<i class="far fa-question-circle"></i>');

      } else if (boxRate > 10 && boxWeight > maxDoubleCaseWeight) {

        note.html(note.html() + 'Case Weight requires Single Pick, and Case Rate is too fast for single pick Standard System. <br>');
        rPZMAX_result.html('<i class="far fa-question-circle"></i>');

      } else if (boxRate <= 8 && boxWeight <= maxSingleCaseWeight) {

        note.html(note.html() + 'Pick Type: Single Pick. <br> Standard Setup. <br>');
        rPZMAX_result.html("&#10004;");

      } else if (boxRate > 8 && boxRate <= 16 && boxWeight <= maxDoubleCaseWeight && boxLength <= maxBoxLength_Double) {

        note.html(note.html() + 'Pick Type: Double Pick. <br> Standard Setup. <br>');
        rPZMAX_result.html("&#10004;");

      } else if (boxRate > 8 && boxRate <= 10) {

        note.html(note.html() + 'Pick Type: Single Pick. <br> Single Pick Rate is Borderline for Standard System. <br>');
        rPZMAX_result.html('<i class="far fa-question-circle"></i>');

      } else if (boxRate > 16 && boxWeight <= maxDoubleCaseWeight && boxLength <= maxBoxLength_Double) {

        note.html(note.html() + 'Pick Type: Double Pick. <br> Double Pick Rate is Borderline for Standard System. <br>');
        rPZMAX_result.html('<i class="far fa-question-circle"></i>');

      } else if (boxRate > 10 && boxLength > maxBoxLength_Double) {

        note.html(note.html() + 'Case Rate requires Double Pick, and Case Length is too Long for Double Pick Standard System, Extended Guarding Required.  <br>');

        rPZMAXSystemnote.html('Extended Guarding Required for Longer Cases. <br>');

        rPZMAX_result.html('<i class="far fa-question-circle"></i>');
      }
    });

    let rPZ10NotesDisplay = $(".rPZ10SystemNotes");

    if (rPZ10SystemNote.html() != '') {
      rPZ10NotesDisplay.show();
    } else {
      rPZ10NotesDisplay.hide();
    }

    let rPZMAXNotesDisplay = $(".rPZMAXSystemNotes");
    if (rPZMAXSystemNote.html() != '') {
      rPZMAXNotesDisplay.show();
    } else {
      rPZMAXNotesDisplay.hide();
    }

  };

  let RemoveRow = function (row) {
    row.closest("table").remove();
  };

  let RunCalculations = function () {

    let caseTables = $(".casetable");

    let rPZ10SystemNote = $("#rPZ10Result");
    rPZ10SystemNote.html("");


    let rPZ10SystemNotes = new Array(22).fill(0);

    let k = Number(0);
    let palletSpacerWidth = Number(0);
    let maxOverhangY = Number(0);

    caseTables.each(function () {
      let el = $(this);
      let overhangX = Number(el.find(".overhangX").val());
      let overhangY = Number(el.find(".overhangY").val());
      if (overhangX > palletSpacerWidth) {
        palletSpacerWidth = overhangX;
      }
      if (overhangY > maxOverhangY) {
        maxOverhangY = overhangY;
      }
    });

    palletSpacerWidth = Math.ceil(palletSpacerWidth * 2) / 2;

    if (palletSpacerWidth > 0) {
      rPZ10SystemNotes[1] = 1;
    }
    if (maxOverhangY > 0) {
      rPZ10SystemNotes[2] = 1;
    }

    let n = Number(0);
    let conveyorWidth = Number(0);

    caseTables.each(function () {
      let el = $(this);
      let caseWidth = Number(el.find(".boxWidth").val());
      if (caseWidth > conveyorWidth) {
        conveyorWidth = caseWidth;
      }
    });

    if (conveyorWidth < 17) {
      conveyorWidth = 18;
    } else if (conveyorWidth < 20) {
      conveyorWidth = 21;
    } else {
      conveyorWidth = 0;
    }

    let eoAT_X_Offset = Number($("#eoAT_X_Offset").val()); //inches
    let eoAT_Y_Offset = Number($("#eoAT_Y_Offset").val());  //inches
    let eoAT_Z_Offset = Number($("#eoAT_Z_Offset").val()); //inches
    let app_X_Offset = Number($("#app_X_Offset").val());  //inches
    let app_Y_Offset = Number($("#app_Y_Offset").val()); //inches
    let app_Z_Offset = Number($("#app_Z_Offset").val());  //inches
    let conveyorHeight = Number($("#conveyorHeight").val());
    let conveyorOrientation = Number($("#conveyorOrientation").val());

    caseTables.each(function () {

      //el is a reference to current row(Table)
      let el = $(this);

      let palletWidth = Number(40);
      let palletLength = Number(48);
      let robot_X_Offset = Number(11.5);
      let robot_Z_Offset = Number(28.395) + 11.2;
      let maxLiftkitHeight = Number(27.559);
      let maxRobotReach = Number(51.1811);
      let liftkitRaisedHeight = Number(0);
      let minSingleCenterLength = Number(12);
      let maxBoxLength_Double = Number(16);
      let maxBoxLength_Single = Number(32);
      let minBoxWidth = Number(6);
      let conveyorXOffset = Number(10.5);
      let conveyorYOffset = Number(24.15);

      let palletOverhangX = Number(el.find(".overhangX").val());
      let palletOverhangY = Number(el.find(".overhangY").val());
      let boxLength = Number(el.find(".boxLength").val());
      let boxWidth = Number(el.find(".boxWidth").val());
      let boxHeight = Number(el.find(".boxHeight").val());
      let palletHeight = Number(el.find(".palletHeight").val());
      let layerCount = Number(el.find(".layerCount").val());
      let boxWeight = Number(el.find(".boxWeight").val());
      let boxRate = Number(el.find(".boxRate").val());

      let sKU = el.find(".SKU").val();

      let note = el.find(".RPZ10NoteText");
      note.html("");

      let rPZ10_result = el.find(".RPZ-10");
      let rPZMAX_result = el.find(".RPZ-MAX");

      rPZ10_result.html("");
      rPZMAX_result.html("");


      let notes = new Array(22).fill(0);

      //Check for valid inputs:
      if (sKU != '' && boxWeight > 0 && boxRate > 0 && boxLength > 0 && boxWidth > 0 && boxHeight > 0 && palletHeight > 0 && layerCount > 0 && conveyorHeight > 0 && conveyorOrientation > 0 && eoAT_X_Offset > 0 && eoAT_Y_Offset > 0 && eoAT_Z_Offset > 0 && app_X_Offset >= 0 && app_Y_Offset > 0 && app_Z_Offset > 0) {

      } else {
        note.html('Please enter Valid information. <br>');
      }

      // Calculate RPZ-10 Center of Gravity:
      let boxCOG_X = Number(eoAT_X_Offset); //inches
      let boxCOG_Y = Number(eoAT_Y_Offset); //inches
      let boxCOG_Z = Number(eoAT_Z_Offset + (0.5 * boxHeight)); //inches
      let eoAT_COG_X = Number(0); //inches
      let eoAT_COG_Y = Number(72.5 / 25.4); //inches
      let eoAT_COG_Z = Number(66.544 / 25.4); //inches
      let eoAT_Weight = Number(7.194); // lbs
      let systemWeight = boxWeight + eoAT_Weight;
      let systemCOG_X = ((boxCOG_X * boxWeight) + (eoAT_COG_X * eoAT_Weight)) / systemWeight;
      let systemCOG_Y = ((boxCOG_Y * boxWeight) + (eoAT_COG_Y * eoAT_Weight)) / systemWeight;
      let systemCOG_Z = ((boxCOG_Z * boxWeight) + (eoAT_COG_Z * eoAT_Weight)) / systemWeight;
      let distanceCOG = Math.sqrt(systemCOG_X ** 2 + systemCOG_Y ** 2 + systemCOG_Z ** 2);

      //Calculate RPZ-10 Max Offset Payload based on COG and Case Weight
      let maxOffsetPayload = Number(0);

      if (distanceCOG <= 3.94) {
        maxOffsetPayload = 27.5 - 7.194;
      } else if (distanceCOG <= 5.91) {
        maxOffsetPayload = 38.5 - (2.792 * distanceCOG) - 7.194;
      } else if (distanceCOG <= 13.78) {
        maxOffsetPayload = 25.30 - (0.559 * distanceCOG) - 7.194;
      } else {
        maxOffsetPayload = 22.73 - (0.372 * distanceCOG) - 7.194;
      }

      //Determine RPZ-10 Singe Pick Type (Offset or Center)
      let singlePickType = Number(0);
      if (boxWeight <= maxOffsetPayload) {
        singlePickType = 1; //Single Offset
      } else if (boxWeight > maxOffsetPayload && boxLength >= minSingleCenterLength) {
        singlePickType = 0; //Single Center
      } else if (boxWeight > maxOffsetPayload && boxLength < minSingleCenterLength) {
        singlePickType = 0; //Single Center
        //note.html('Modified SpiderPik EoAT would be needed to accomodate Single Center Pick. ';
        notes[18] = 1;
      }

      //RPZ-10 Rate & Weight Check
      let pickType_RPZ10 = Number(0);
      if (boxWeight > 20.3) {
        pickType_RPZ10 = 0; //Weight is NOT VALID for RPZ-10
        note.html('Case Weight is too heavy for Standard System. <br>');
        //notes[2] = 1;
        rPZ10_result.html("&#10060;");
      }
      if (boxRate > 15) {
        pickType_RPZ10 = 0; //Rate is NOT VALID for RPZ-10
        note.html('Case Rate is too fast for Standard System.  <br>');
        //notes[3] = 1;
        rPZ10_result.html('<i class="far fa-question-circle"></i>');
      }
      if (boxLength > maxBoxLength_Single) {//Don't Exit FOR LOOP
        pickType_RPZ10 = 0; //Case is too Long for Standard RPZ-10 System
        //note.html('RPZ-10: Case is too Long for Standard System, Extended Guarding Required. '
        notes[19] = 1;
        rPZ10SystemNotes[4] = 1;
        rPZ10_result.html('<i class="far fa-question-circle"></i>');
      }
      if (boxWidth < minBoxWidth) {//Don't Exit FOR LOOP
        pickType_RPZ10 = 0; //Box is too narrow for Standard SpiderPik EoAT
        //note.html('RPZ-10: Case is too narrow for Standard SpiderPik EoAT, Custom EoAT Required. '
        notes[20] = 1;
        rPZ10SystemNotes[5] = 1;
        rPZ10_result.html('<i class="far fa-question-circle"></i>');
      }
      if (boxRate > 0 && boxRate <= 5 && boxWeight > 0 && boxWeight <= 20.3) {
        pickType_RPZ10 = 11; //Single Pick is VALID
      } else if (boxRate > 5 && boxRate <= 7.5 && boxWeight > 10.15 && boxWeight <= 20.3) {
        pickType_RPZ10 = 10; //Single Pick is BORDERLINE
        //note.html('RPZ-10: Single Pick Rate is Borderline (Case Weight too Heavy for Double Pick) for Standard System. ';
        notes[15] = 1;
      } else if (boxRate > 5 && boxRate <= 7.5 && boxWeight > 0 && boxWeight <= 10.15 && boxLength > maxBoxLength_Double) {
        pickType_RPZ10 = 10; //Single Pick is BORDERLINE
        //note.html('RPZ-10: Single Pick Rate is Borderline (Case Length too Long for Double Pick) for Standard System. ';
        notes[16] = 1;
      } else if (boxRate > 7.5 && boxWeight > 10.15 && boxWeight <= 20.3) {
        pickType_RPZ10 = 0; //Too fast for single pick and too heavy for double
        note.html('Case Weight requires Single Pick, and Rate is too fast for single pick Standard System. <br>');
        //notes[4] = 1;
        rPZ10_result.html('<i class="far fa-question-circle"></i>');
      } else if (boxRate > 5 && boxRate <= 10 && boxWeight > 0 && boxWeight <= 10.15 && boxLength <= maxBoxLength_Double) {
        pickType_RPZ10 = 21; //Double Pick is VALID
      } else if (boxRate > 10 && boxRate <= 15 && boxWeight > 0 && boxWeight <= 10.15 && boxLength <= maxBoxLength_Double) {
        pickType_RPZ10 = 20; //Double Pick is BORDERLINE
        //note.html('RPZ-10: Double Pick Rate is Borderline for Standard System. ';
        notes[17] = 1;
      } else if (boxRate > 7.5 && boxWeight > 0 && boxWeight <= 10.15 && boxLength > maxBoxLength_Double) {
        pickType_RPZ10 = 20; //Rate is too Fast for Single Pick, Box is too Long for Double Pick
        //note.html('RPZ-10: Case Rate is too Fast for Single Pick, and Case is too Long for a Double Pick Standard System, Extended Guarding Required. '
        notes[21] = 1;
        rPZ10SystemNotes[4] = 1;
        rPZ10_result.html('<i class="far fa-question-circle"></i>');
      }

      let rPZ10_Pick_Type = "";
      if (pickType_RPZ10 == 20 || pickType_RPZ10 == 21) {
        rPZ10_Pick_Type = 'RPZ-10 Pick Type: Double Pick. ';
        notes[5] = 1;
      } else if (pickType_RPZ10 == 10 || pickType_RPZ10 == 11) {
        if (singlePickType == 1) {
          rPZ10_Pick_Type = 'RPZ-10 Pick Type: Single (Offset). ';
          notes[6] = 1;
        } else if (singlePickType == 0) {
          rPZ10_Pick_Type = 'RPZ-10 Pick Type: Single (Center) Pick. ';
          notes[7] = 1;
        }
      }

      //Layer Calculations:
      let l1 = Number(1); //First Layer
      let l2 = Math.floor(layerCount / 2); //Last Layer with Liftkit DOWN
      let l3 = l2 + 1; //First Layer with Liftkit UP
      let l4 = layerCount; //Last Layer of Pallet

      //RPZ-10 Calculate the Liftkit Height when UP
      //If height of pallet at the time of liftkit move is greater than 700mm, Liftkit will move to 700mm
      if (l2 * boxHeight > maxLiftkitHeight) {
        liftkitRaisedHeight = maxLiftkitHeight;
      } else {
        liftkitRaisedHeight = l2 * boxHeight;
      }

      //Conveyor Reach Checks:
      //Center Conveyor Calculations:
      let pickY_Double_Center = conveyorYOffset + boxLength + maxOverhangY;
      let pickY_SingleOffset_Center = conveyorYOffset + (0.5 * boxLength) + eoAT_X_Offset + maxOverhangY;
      let pickY_SingleCenter_Center = conveyorYOffset + (0.5 * boxLength) + maxOverhangY;
      let pickX_Center = conveyorXOffset + eoAT_Y_Offset - (0.5 * boxWidth);

      //Side Infeed Conveyor Calculations:
      let pickX_Double_Side = conveyorXOffset - boxLength;
      let pickX_SingleOffset_Side_1 = conveyorXOffset - (0.5 * boxLength) + eoAT_X_Offset;
      let pickX_SingleOffset_Side_2 = conveyorXOffset - (0.5 * boxLength) - eoAT_X_Offset;
      let pickX_SingleCenter_Side = conveyorXOffset - (0.5 * boxLength);
      let pickY_Side = conveyorYOffset + (0.5 * boxWidth) + eoAT_Y_Offset + maxOverhangY;

      //Z Pick Height Calculations
      let pickZ1 = conveyorHeight + (2 * boxHeight) + eoAT_Z_Offset - robot_Z_Offset + 2; //Height of Pick Approach at Liftkit Down
      let pickZ2 = conveyorHeight + boxHeight + eoAT_Z_Offset - robot_Z_Offset - liftkitRaisedHeight; //Height of Pick at Liftkit Up

      if (boxLength <= 15) {
        let cd1 = Math.sqrt(pickX_Center ** 2 + pickY_Double_Center ** 2 + pickZ1 ** 2); //Double Center - LK Down
        let cd2 = Math.sqrt(pickX_Center ** 2 + pickY_Double_Center ** 2 + pickZ2 ** 2); //Double Center - LK UP
      }
      else {
        let cd1 = Number(0); //Double Center - LK Down
        let cd2 = Number(0); //Double Center - LK UP
      }
      let cd3 = Math.sqrt(pickX_Center ** 2 + pickY_SingleOffset_Center ** 2 + pickZ1 ** 2); //SingleOffset Center - LK Down
      let cd4 = Math.sqrt(pickX_Center ** 2 + pickY_SingleOffset_Center ** 2 + pickZ2 ** 2); //SingleOffset Center - LK UP
      let cd5 = Math.sqrt(pickX_Center ** 2 + pickY_SingleCenter_Center ** 2 + pickZ1 ** 2); //SingleCenter Center - LK Down
      let cd6 = Math.sqrt(pickX_Center ** 2 + pickY_SingleCenter_Center ** 2 + pickZ2 ** 2); //SingleCenter Center - LK UP
      if (boxLength <= 15) {
        let cd7 = Math.sqrt(pickX_Double_Side ** 2 + pickY_Side ** 2 + pickZ1 ** 2); //Double Side - LK Down
        let cd8 = Math.sqrt(pickX_Double_Side ** 2 + pickY_Side ** 2 + pickZ2 ** 2); //Double Side - LK UP
      } else {
        let cd7 = Number(0); //Double Side - LK Down
        let cd8 = Number(0); //Double Side - LK UP
      }
      let cd9 = Math.sqrt(pickX_SingleOffset_Side_1 ** 2 + pickY_Side ** 2 + pickZ1 ** 2); //SingleOffset Side - LK Down
      let cd10 = Math.sqrt(pickX_SingleOffset_Side_1 ** 2 + pickY_Side ** 2 + pickZ2 ** 2); //SingleOffset Side - LK UP
      let cd13 = Math.sqrt(pickX_SingleOffset_Side_2 ** 2 + pickY_Side ** 2 + pickZ1 ** 2); //SingleOffset Side - LK Down
      let cd14 = Math.sqrt(pickX_SingleOffset_Side_2 ** 2 + pickY_Side ** 2 + pickZ2 ** 2); //SingleOffset Side - LK UP
      let cd11 = Math.sqrt(pickX_SingleCenter_Side ** 2 + pickY_Side ** 2 + pickZ1 ** 2); //SingleCenter Side - LK Down
      let cd12 = Math.sqrt(pickX_SingleCenter_Side ** 2 + pickY_Side ** 2 + pickZ2 ** 2); //SingleCenter Side - LK UP

      let neededReachPick = Number(0);

      if (conveyorOrientation == 1) {
        if (rPZ10_Pick_Type == 'RPZ-10 Pick Type: Double Pick. ') {
          neededReachPick = Math.max(cd1, cd2);
        }
        if (rPZ10_Pick_Type == 'RPZ-10 Pick Type: Single (Offset). ') {
          neededReachPick = Math.max(cd3, cd4);
          if (neededReachPick > maxRobotReach) {
            rPZ10_Pick_Type = 'RPZ-10 Pick Type: Single (Center) Pick. ';
            singlePickType = 0;
            notes[6] = 0;
            notes[7] = 1;
          }
        }
        if (rPZ10_Pick_Type == 'RPZ-10 Pick Type: Single (Center) Pick. ') {
          neededReachPick = Math.max(cd5, cd6);
        }
      } else if (conveyorOrientation == 2 || conveyorOrientation == 3) {
        if (rPZ10_Pick_Type == 'RPZ-10 Pick Type: Double Pick. ') {
          neededReachPick = Math.max(cd7, cd8);
        }
        if (rPZ10_Pick_Type == 'RPZ-10 Pick Type: Single (Offset). ') {
          neededReachPick = Math.max(cd9, cd10, cd13, cd14);
          if (neededReachPick > maxRobotReach) {
            rPZ10_Pick_Type = 'RPZ-10 Pick Type: Single (Center) Pick. ';
            singlePickType = 0;
            notes[6] = 0;
            notes[7] = 1;
          }
        }
        if (rPZ10_Pick_Type == 'RPZ-10 Pick Type: Single (Center) Pick. ') {
          neededReachPick = Math.max(cd11, cd12);
        }
      }

      if (neededReachPick > maxRobotReach) {
        //note.html(note.innerHTML + 'Pick Reach is not valid (' + parseFloat(neededReachPick).toFixed(2) + '"). ';
        notes[8] = 1;
        rPZ10_result.html('<i class="far fa-question-circle"></i>');
      }

      //RPZ-10 Reach Calculation:

      //Loop through 4 potential reach calculations for RPZ-10
      //Stop Loop once a valid reach condition is met
      //1. Normal reach
      //2. Reduce Y Approach by 1"
      //3. Reduce Z Approach by 1"
      //4. Increase EoAT Y Offset by 1"
      let layerAboveApproach = Number(1);
      for (let i = 1; i <= 5; i++) {
        if (i == 2) {
          layerAboveApproach = Number(0);
        } else if (i == 3) {
          app_Y_Offset--;
        } else if (i == 4) {
          app_Z_Offset--;
        } else if (i == 5) {
          eoAT_Y_Offset++;
        }

        //Calculate X and Y Coordinate of Robot Tool Flange for a Horizontal and Vertical box at the far back corner of the pallet:
        //Calculation of X & Y is dependant on Pick Type:

        let xHorizontal = 0;
        let xVertical = 0;
        let yHorizontal = 0;
        let yVertical = 0;


        if (pickType_RPZ10 == 20 || pickType_RPZ10 == 21) {
          xHorizontal = palletWidth + robot_X_Offset - boxLength + app_X_Offset + palletSpacerWidth + palletOverhangX;
          xVertical = palletWidth + robot_X_Offset - eoAT_Y_Offset - (0.5 * boxWidth) + app_X_Offset + palletSpacerWidth + palletOverhangX;
          yHorizontal = (0.5 * palletLength) - eoAT_Y_Offset - (0.5 * boxWidth) + app_Y_Offset + palletOverhangY;
          yVertical = (0.5 * palletLength) - boxLength + app_Y_Offset + palletOverhangY;
          rPZ10_Pick_Type = 'RPZ-10 Pick Type: Double Pick. ';
        } else if (pickType_RPZ10 == 10 || pickType_RPZ10 == 11) {
          if (singlePickType == 1) {
            xHorizontal = palletWidth + robot_X_Offset - eoAT_X_Offset - (0.5 * boxLength) + app_X_Offset + palletSpacerWidth + palletOverhangX;
            xVertical = palletWidth + robot_X_Offset - eoAT_Y_Offset - (0.5 * boxWidth) + app_X_Offset + palletSpacerWidth + palletOverhangX;
            yHorizontal = (0.5 * palletLength) - eoAT_Y_Offset - (0.5 * boxWidth) + app_Y_Offset + palletOverhangY;
            yVertical = (0.5 * palletLength) - eoAT_X_Offset - (0.5 * boxLength) + app_Y_Offset + palletOverhangY;
            rPZ10_Pick_Type = 'RPZ-10 Pick Type: Single (Offset). ';
          } else if (singlePickType == 0) {
            xHorizontal = palletWidth + robot_X_Offset - (0.5 * boxLength) + app_X_Offset + palletSpacerWidth + palletOverhangX;
            xVertical = palletWidth + robot_X_Offset - eoAT_Y_Offset - (0.5 * boxWidth) + app_X_Offset + palletSpacerWidth + palletOverhangX;
            yHorizontal = (0.5 * palletLength) - eoAT_Y_Offset - (0.5 * boxWidth) + app_Y_Offset + palletOverhangY;
            yVertical = (0.5 * palletLength) - (0.5 * boxLength) + app_Y_Offset + palletOverhangY;
            rPZ10_Pick_Type = 'RPZ-10 Pick Type: Single (Center) Pick. ';
          }
        }

        let z1 = palletHeight + eoAT_Z_Offset - robot_Z_Offset + boxHeight;
        let z2 = palletHeight + eoAT_Z_Offset - robot_Z_Offset + app_Z_Offset + (boxHeight * (l2 + layerAboveApproach));
        let z3 = palletHeight + eoAT_Z_Offset - robot_Z_Offset - liftkitRaisedHeight + (boxHeight * l3);
        let z4 = palletHeight + eoAT_Z_Offset - robot_Z_Offset - liftkitRaisedHeight + app_Z_Offset + (boxHeight * (l4 + layerAboveApproach));

        let d1 = Math.sqrt(xHorizontal ** 2 + yHorizontal ** 2 + z1 ** 2);
        let d2 = Math.sqrt(xVertical ** 2 + yVertical ** 2 + z1 ** 2);
        let d3 = Math.sqrt(xHorizontal ** 2 + yHorizontal ** 2 + z2 ** 2);
        let d4 = Math.sqrt(xVertical ** 2 + yVertical ** 2 + z2 ** 2);
        let d5 = Math.sqrt(xHorizontal ** 2 + yHorizontal ** 2 + z3 ** 2);
        let d6 = Math.sqrt(xVertical ** 2 + yVertical ** 2 + z3 ** 2);
        let d7 = Math.sqrt(xHorizontal ** 2 + yHorizontal ** 2 + z4 ** 2);
        let d8 = Math.sqrt(xVertical ** 2 + yVertical ** 2 + z4 ** 2);

        let neededReach = Math.max(d1, d2, d3, d4, d5, d6, d7, d8);

        if (neededReach < maxRobotReach) {
          if (i == 1) {
            //note.html(note.innerHTML + rPZ10_Pick_Type + "RPZ-10: Standard Setup. ";
            notes[9] = 1;
          } else if (i == 2) {
            //note.html(note.innerHTML + rPZ10_Pick_Type + 'RPZ-10: Same Layer Approach Needed. ';
            notes[10] = 1;
          } else if (i == 3) {
            //note.html(note.innerHTML + rPZ10_Pick_Type + 'RPZ-10: Same Layer Approach Needed, Y Approach Reduced to ' + app_Y_Offset + '". ';
            notes[10] = 1;
            notes[11] = 1;
          } else if (i == 4) {
            //note.html(note.innerHTML + rPZ10_Pick_Type + 'RPZ-10: Same Layer Approach Needed, Y Approach Reduced to ' + app_Y_Offset + '" AND Z Approach Reduced to ' + app_Z_Offset + '". ';
            notes[10] = 1;
            notes[11] = 1;
            notes[12] = 1;
          } else if (i == 5) {
            //note.html(note.innerHTML + rPZ10_Pick_Type + 'RPZ-10: Same Layer Approach Needed, Y Approach Reduced to ' + app_Y_Offset + '" AND Z Approach Reduced to ' + app_Z_Offset + '" AND EoAT Y Offset Increased to ' + eoAT_Y_Offset + '". ';
            notes[10] = 1;
            notes[11] = 1;
            notes[12] = 1;
            notes[13] = 1;
            rPZ10SystemNotes[6] = eoAT_Y_Offset;
          }
          break;
        } else {
          if (i == 5) {
            //note.html(note.innerHTML + 'RPZ-10: Further review of Pallet Pattern is required. ' + 'Needed Reach: ' + parseFloat(neededReach).toFixed(2) + '". ';
            notes[14] = 1;
            break;
          }
        }
      }

      //RPZ-10 Results:
      if (neededReach < maxRobotReach) {
        if (pickType_RPZ10 == 11 || pickType_RPZ10 == 21) {
          if (rPZ10_result.html() != '<i class="far fa-question-circle"></i>') {
            rPZ10_result.html("&#10004;");
          }
        } else if (pickType_RPZ10 == 10 || pickType_RPZ10 == 20) {
          rPZ10_result.html('<i class="far fa-question-circle"></i>');
        }
      } else {
        rPZ10_result.html('<i class="far fa-question-circle"></i>');
      }


      let notesList = [];


      //RPZ-10 Notes:
      if (notes[5] == 1) {
        notesList.push("Pick Type: Double Pick. <br>");
      }

      if (notes[6] == 1) {
        notesList.push("Pick Type: Single (Offset) Pick. <br>");
      }

      if (notes[7] == 1) {
        notesList.push("Pick Type: Single (Center) Pick. <br>");
      }

      if (notes[8] == 1) {
        notesList.push('Pick Reach is not valid (' + parseFloat(neededReachPick).toFixed(2) + '"). <br>');
      }
      if (notes[9] == 1) {
        notesList.push('Standard Setup. <br>');
      }
      if (notes[10] == 1) {
        notesList.push('Same Layer Approach Needed. <br>');
      }
      if (notes[11] == 1) {
        notesList.push('Y Approach Reduced to ' + app_Y_Offset + '". <br>');
      }
      if (notes[12] == 1) {
        notesList.push('Z Approach Reduced to ' + app_Z_Offset + '". <br>');
      }
      if (notes[13] == 1) {
        notesList.push('EoAT Y Offset Increased to ' + eoAT_Y_Offset + '". <br>');
      }
      if (notes[14] == 1) {
        notesList.push('Further review of Pallet Pattern is required. ' + 'Needed Reach: ' + parseFloat(neededReach).toFixed(2) + '". <br>');
      }
      if (notes[15] == 1) {
        notesList.push('Single Pick Rate is Borderline (Case Weight too Heavy for Double Pick) for Standard System. <br>');
      }
      if (notes[16] == 1) {
        notesList.push('Single Pick Rate is Borderline (Case Length too Long for Double Pick) for Standard System. <br>');
      }
      if (notes[17] == 1) {
        notesList.push('Double Pick Rate is Borderline for Standard System. <br>');
      }
      if (notes[18] == 1) {
        notesList.push('Modified SpiderPik EoAT would be needed to accomodate Single Center Pick (Case too Short for Standard). <br>');
      }
      if (notes[19] == 1) {
        notesList.push('Case is too Long for Standard System, Extended Guarding Required. <br>');
      }
      if (notes[20] == 1) {
        notesList.push('Case is too narrow for Standard SpiderPik EoAT, Custom EoAT Required. <br>');
      }
      if (notes[21] == 1) {
        notesList.push('Case Rate is too Fast for Single Pick, and Case is too Long for a Double Pick Standard System, Extended Guarding Required. <br>');
      }

      //System Notes (RPZ-10)
      if (conveyorWidth > 0) {
        rPZ10Systemnote.html('&#8226; System will need a(n) ' + conveyorWidth + '"BF Conveyor. <br>');
      } else {
        rPZ10Systemnote.html('&#8226; Cases too wide for Standard Conveyor');
      }
      if (rPZ10SystemNotes[1] == 1) {
        rPZ10Systemnote.html(rPZ10SystemNote.html() + '&#8226; System will need a ' + palletSpacerWidth + '" Pallet Spacer. <br>');
      }
      if (rPZ10SystemNotes[2] == 1) {
        rPZ10Systemnote.html(rPZ10SystemNote.html() + '&#8226; System will need a ' + maxOverhangY + '" Conveyor Space. <br>');
      }
      if (rPZ10SystemNotes[4] == 1) {
        rPZ10Systemnote.html(rPZ10SystemNote.html() + '&#8226; Extended Guarding Required for Longer Cases. <br>');
      }
      if (rPZ10SystemNotes[5] == 1) {
        rPZ10Systemnote.html(rPZ10SystemNote.html() + '&#8226; Custom EoAT Required for Narrow Cases. <br>');
      }

      if (rPZ10SystemNotes[6] > 0) {
        rPZ10Systemnote.html(rPZ10SystemNote.html() + '&#8226; Custom EoAT Required (Y Offset: ' + rPZ10SystemNotes[6] + '"). <br>');
      }

      note.html(notesList.join(""));

    });

    rPZ_MAX_Check();
  };

  //Utulity functions
  let log = function (value) {
    if (typeof console === "undefined" || typeof console.log === "undefined") {

    } else {
      console.log(value);
    }
  }

  $(document).ready(function () {
    log("READY");

    let caseTableContainer = $("#case-table-container");

    // Add new Row to Case Scope Table:
    $("#add-row").on("click", function () {

      let caseTable = caseTableContainer.find(".casetable:first");
      let newRow = caseTable.clone();

      //Clear all values
      $('input', newRow).not(".ignore").val("");

      //Clear all notes
      $('.row-notes', newRow).html("");

      //Show remove row button on new rows:
      $('.remove-row', newRow).attr("style", "");

      caseTableContainer.append(newRow);

    });

    //Live function for remove row button
    $("body").on("click", "a.remove-row", function (e) {
      e.preventDefault();
      var el = $(this);
      RemoveRow(el);
    });

    //Calculate Feasibility for all rows in table
    $("#calculate").on("click", function () {
      RunCalculations();
    });

  });

})(jQuery);
