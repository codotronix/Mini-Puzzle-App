$(function(){
	//console.log("ready");
	
	// NOTE: I have started the Cell Array from 1... Hence the 0th location is blank

	var imageWidth = 480	//	$('#puzzleImg').height(); Since I have decided to take only 240x240 size image, So can be hard coded
	var cells = [];			//an array of cell bojects to hold information about all the cells
	var m = 3; 				// say it is a m x m square puzzle
	var diffFactor = imageWidth/m; 	//total width of teh borad divided by number of cell in each line i.e 231/3 = 77
	var blankCellId;
	var totalMove = 0; 
	var totalTime = 0;
	var timerOn = false;
	var imageUrl = 'images/1.jpg';
	
	
	//set height and width of all necessary components
	$('#imageHolder').css({
		height: imageWidth + 'px',
		width: imageWidth + 'px'
	});
	$('#board1').css({
		height: imageWidth + 'px',
		width: imageWidth + 'px'
	});
    	
	$('#boardContainer').css({
		height: imageWidth + 'px',
		width: imageWidth +'px'
	});
	

	//console.log(diffFactor);
	$('.cell').css({
		height: diffFactor + 'px',
		width: diffFactor + 'px'
	});

	function initBoard() {		
		var cellNo = 0;
		cells = [];			//new cells array
		top=0, 				//top and left will temporarily hold the css top and left of a cell
		left=0;

		//add cells to the blank board
		for (var i=0; i<m; i++) {
			for (var j=0; j<m; j++) {
				cellNo++;
				cells[cellNo] = {};
				cells[cellNo].id = 'cell_'+cellNo;
				cells[cellNo].top = i*diffFactor;
				cells[cellNo].left = j*diffFactor;					
				
				$('<div class="cell" id="' + cells[cellNo].id + '" data-win-bind="style.backgroundImage: urlToImage;"></div>').appendTo('#board1');
				$('#'+cells[cellNo].id).css({
					top : cells[cellNo].top + 'px',
					left : cells[cellNo].left + 'px',
					background: "url(" + imageUrl + ") no-repeat -" + cells[cellNo].left + "px -" + cells[cellNo].top + "px"
				});
			}
		}

		//Now that we have Cells, we set their height and width
		$('.cell').css({
			height: diffFactor + 'px',
			width: diffFactor + 'px'
		});

		//now clear the background image of the last cell, so that i shows a blank space
		blankCellId = cells[cellNo].id;
		$('#'+blankCellId).css('background-image','none');
	}	

	function init() {		
		totalMove = 0;
		$('#totalMove').html(totalMove);
		timerOn = false;
		totalTime = 0;
		$('#totalTime').html(totalTime);
		initBoard();
	}

	//Swap the cell with the blank cell, if it is allowable
	function swapIfSwappable (cellID) {
		var swapSuccessful = false;
		var thisLeft = parseInt($('#'+cellID).css('left'));
		var thisTop = parseInt($('#'+cellID).css('top'));
		var blankLeft = parseInt($('#'+blankCellId).css('left'));
		var blankTop = parseInt($('#'+blankCellId).css('top'));
		//console.log(thisLeft);
		if((thisLeft === blankLeft && Math.abs(thisTop - blankTop) === diffFactor) || (thisTop === blankTop && Math.abs(thisLeft - blankLeft) === diffFactor)) {
			//console.log('swappable');
			$('#'+cellID).css('left', $('#'+blankCellId).css('left'));
			$('#'+cellID).css('top', $('#'+blankCellId).css('top'));
			$('#'+blankCellId).css('left', thisLeft+'px');
			$('#'+blankCellId).css('top', thisTop+'px');
			swapSuccessful = true;
			totalMove++;
		}
		else {
			//console.log('this is a non swappable block...');
		}

		return(swapSuccessful);
	}

	function shuffleUp () {
		//totalMove = 0;
		var maxCellIndex = cells.length-1;
		var swapCount = 0;
		while (swapCount < 300)	{
			var randomCellIndex = Math.floor(Math.random() * maxCellIndex) + 1;
			if(swapIfSwappable('cell_'+randomCellIndex)) {
				swapCount++;
			}
		}
		//$('#totalMove').html(totalMove);
	}

	function increaseTime () {
		totalTime = $('#totalTime').html();
		if(timerOn) {
			totalTime++;
			$('#totalTime').html(totalTime);
			setTimeout(increaseTime, 1000);
		}				
	}  


	//Initiate the puzzle board
	init();

	/*********************** ALL THE CLICK EVENTS ******************************/

	//Solve button is clicked
	$('#Solve').click(function(){
		$('#board1').html('');
		initBoard();
	});

	//Shuffle button is clicked
	$('#Shuffle').click(function(){
		shuffleUp();
		totalMove = 0;
	});

	//Reset Counter button is pressed
	$('#resetCounter').click(function () {
		totalMove = 0;
		timerOn = false;
		totalTime = 0;
		$('#totalMove').html(totalMove);
		$('#totalTime').html(totalTime);
	});

	//Clicking on Start Timer
	$('#startTimer').click(function () {
		if(!timerOn) {
			timerOn = true;
			setTimeout(increaseTime, 1000);				
		}		
	});

	$('#stopTimer').click(function () {
		timerOn = false;
	});

	//CLICKING ON A CELL
	$('#board1').on('click', '.cell', function() {
		//Swap this cell with blank cell if this cell is swappable...		
		swapIfSwappable($(this).attr('id'));
		$('#totalMove').html(totalMove);
	});

	//doneOptions button is clicked
	$('#selectLevel input[type=radio]').on('change', function () {
	    m = parseInt($('#selectLevel input[type=radio]:checked').val());
	    $('#levelDesc').html("( LEVEL " + (m-2) + " )");
		diffFactor = imageWidth/m;
		$('#board1').html('');
		init();
	})

	//
	$('#selectImage li img').on('click', function () {
		//console.log($(this).attr('src'));
		imageUrl = $(this).attr('src');
		$('#imageHolder img').attr('src', imageUrl);
		$('#board1').html('');
		init();
	});

	//#optionsPanel is clicked
	$('#optionsPanel').click(function (e) {
		e.stopPropagation();
		$('#AllOptions').toggle();
	});

	$('html').click(function () {
		//console.log('body clicked');
		$('#AllOptions').hide();
		$('#imageHolder img').hide();
		$('#imageHolder span').show();
	});

	//imageHolder is clicked
	$('#imageHolder').click(function (e) {
		e.stopPropagation();
		$('#imageHolder img').toggle();
		$('#imageHolder span').toggle();
	});

    //upload image button is clicked
	$('#uploadImg').on('click', function () {
	    pickSinglePhoto();
	});

});


function pickSinglePhoto() {
    // Verify that we are currently not snapped, or that we can unsnap to open the picker    
    var currentState = Windows.UI.ViewManagement.ApplicationView.value;
    if (currentState === Windows.UI.ViewManagement.ApplicationViewState.snapped && !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
        // Fail silently if we can't unsnap
        return; 
    }

    // Create the picker object and set options
    var openPicker = new Windows.Storage.Pickers.FileOpenPicker(); 
    openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail; 
    openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;

    // Users expect to have a filtered view of their folders depending on the scenario. 
    // For example, when choosing a documents folder, restrict the filetypes to documents 
    // for your application.
    openPicker.fileTypeFilter.replaceAll([".png", ".jpg", ".jpeg"]);
    // Open the picker for the user to pick a file
    openPicker.pickSingleFileAsync().done(function (file) {
        if (file) {
            // Application now has read/write access to the picked file
            var imageBlob = URL.createObjectURL(file, { oneTimeOnly: true });
            var photoObj = {};
            photoObj.urlToImage = "url('" + imageBlob + "')";
            WinJS.Binding.processAll(board1, photoObj);
            console.log("Here I am : " + $('#imageHolder').css('background-image'));
            /*var photoObj = {};
            photoObj.src = imageBlob;
            var selectImage = document.getElementById("selectImage");
            WinJS.Binding.processAll(selectImage, photoObj);imageHolder
            console.log($('#customImg').attr('src'));*/
            
            $('#localImg').attr('src', imageBlob);
            console.log($('#puzzleImg').attr('src'));
            /*$('#imageHolder').css(backgroundImage, imageBlob);*/
            //$('#optionsPanel').show();
            /*$('#imageHolder').css({
                'height': '200px',
                'width': '200px',
                'display':'block',
                'background-image': imageBlob
            });
            console.log($('#imageHolder').css('background-image'));*/
        } else { 
            // The picker was dismissed with no selected file 
        }
    });
}