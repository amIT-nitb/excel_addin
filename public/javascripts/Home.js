    (function () {
        "use strict";

        // $(document).ready(function () {
        //     // app.initialize();
        //     $('#load-data-and-create-chart').on('click', function() {
        //       console.log('Called');
        //       callMileIQ()
        //     });
        // });


        // The initialize function must be run each time a new page is loaded
        Office.initialize = function (reason) {
            $(document).ready(function () {
                app.initialize();

              // $('#load-data-and-create-chart').on('click', loadDataAndCreateChart);
              $('#load-data-and-create-chart').on('click',handleClick);
            });
        };

		function handleClick(){
			loadDataAndCreateChart();	
			callMileIQ();			
		}
		
        // Load some sample data into the worksheet and then create a chart
        function loadDataAndCreateChart() {
			console.log("loadDataAndCreateChart enter");
            // Run a batch operation against the Excel object model
            Excel.run(function (ctx) {

                // Create a proxy object for the active worksheet
                var sheet = ctx.workbook.worksheets.getActiveWorksheet();

                //Queue commands to set the report title in the worksheet
                sheet.getRange("A1").values = "Quarterly Sales Report";
                sheet.getRange("A1").format.font.name = "Century";
                sheet.getRange("A1").format.font.size = 26;

                //Create an array containing sample data
                var values = [["Product", "Qtr1", "Qtr2", "Qtr3", "Qtr4"],
                              ["Frames", 5000, 7000, 6544, 4377],
                              ["Saddles", 400, 323, 276, 651],
                              ["Brake levers", 12000, 8766, 8456, 9812],
                              ["Chains", 1550, 1088, 692, 853],
                              ["Mirrors", 225, 600, 923, 544],
                              ["Spokes", 6005, 7634, 4589, 8765]];

                //Queue a command to write the sample data to the specified range
                //in the worksheet and bold the header row
                var range = sheet.getRange("A2:E8");
                range.values = values;
                sheet.getRange("A2:E2").format.font.bold = true;

                //Queue a command to add a new chart
                var chart = sheet.charts.add("ColumnClustered", range, "auto");

                //Queue commands to set the properties and format the chart
                chart.setPosition("G1", "L10");
                chart.title.text = "Quarterly sales chart";
                chart.legend.position = "right"
                chart.legend.format.fill.setSolidColor("white");
                chart.dataLabels.format.font.size = 15;
                chart.dataLabels.format.font.color = "black";
                var points = chart.series.getItemAt(0).points;
                points.getItemAt(0).format.fill.setSolidColor("pink");
                points.getItemAt(1).format.fill.setSolidColor('indigo');

                //Run the queued commands, and return a promise to indicate task completion
                return ctx.sync();
            })
              .then(function () {
                  app.showNotification("Success Notification");
                  console.log("Success Notification! ");
              })
            .catch(function (error) {
                // Always be sure to catch any accumulated errors that bubble up from the Excel.run execution
                app.showNotification("Error: " + error);
                console.log("Error: " + error);
                if (error instanceof OfficeExtension.Error) {
                    console.log("Debug info: " + JSON.stringify(error.debugInfo));
                }
            });
			      callMileIQ();
        }

function logResults(json){
  console.log(json);
  alert('Success');
}
		//place rest call and display the same in a text box
		function callMileIQ(){
      app.showNotification("Success Notification callMileIQ", "description");
      console.log("callMileIQ enter");
		  $.ajax({
          url: 'https://miqapi-staging.herokuapp.com/1/classes/Vehicle',
          type: 'GET',
          dataType: 'jsonp',
          jsonpCallback: "logResults"
        //  beforeSend: setHeader
        });
      }

	  function setHeader(xhr) {
        xhr.setRequestHeader('X-MileIQ-Application-Id', 'E7EC264F-F470-4C7C-95AF-4B5D08C57346');
        xhr.setRequestHeader('X-MileIQ-API-Key', 'A521B923-43EE-4243-89B8-A3B9BC885D39');
		    xhr.setRequestHeader('X-MileIQ-Session-Token', '8ch0uckxYGp0sEBiaWf96ivDh');
		    xhr.setRequestHeader('X-MileIQ-Device-Type', '1:android:237');
      }

    })();
