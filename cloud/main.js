
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


// /** Aggressive filter **/

// Parse.Cloud.beforeSave("image_of_the_day", function(request, response) {
//     var item = request.object;
//     var Image = require("parse-image");
//     Parse.Cloud.httpRequest({
//         url: item.get("mainimage").url()

//     }).then(function(response) {
//         var Image = require("parse-image");

//         var image = new Image();
//         return image.setData(response.buffer);



//     }).then(function(image) {

//         var theImageWidth = image.width();
//         var theImageHeight = image.height();

//         if (theImageHeight > 300 || theImageHeight > 300) {
//             response.error("how could you do this?? I thought we were friends!!");
//         } else {
//             response.success();
//         }
//     });

// });




/*** Gentle filter ***/

Parse.Cloud.beforeSave("image_of_the_day", function(request, response) {
var safeInput = function(input){ var sanitizedInput = []; var badContent = false; if (input){ for (var i = 0; i < input.length; i++){ var currentChar = input[i]; if (currentChar === " "){ sanitizedInput[i] = "&#32;"; badContent = true; } if (currentChar === "<"){ sanitizedInput[i] = "&#60;"; badContent = true; } if (currentChar === ">"){ sanitizedInput[i] = "&#62;"; badContent = true; } if (currentChar === "$"){ sanitizedInput[i] = "&#36;"; badContent = true; } if (!badContent){ sanitizedInput[i] = input[i]; } badContent = false; } } return sanitizedInput.join(""); };
           


           console.log("starting thumbnail generation");
         

                  var Image = require("parse-image");
                 
                  var item = request.object;
                  
                  if (item.get("caption") !== undefined){
                    item.set("caption", safeInput(item.get("caption")));
                  }

                    if(item.get("mainimage") === undefined){
                      response.error();
                    }else{
                      doImageResize();
                    }

                
                 

           function doImageResize(){

                        Parse.Cloud.httpRequest({
                          url: item.get("mainimage").url()
                       
                        }).then(function(response) {
                          var image = new Image();
                          return image.setData(response.buffer);
                       
                        }).then(function(image) {

                          var theImageWidth = image.width();
                          var maxWidth = 300;

                          var theImageHeight = image.height();
                          var maxHeight = 300;

                          //Trying this guy's method: http://stackoverflow.com/questions/170624/javascript-image-resize
                          function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

                            var ratio = [maxWidth / srcWidth, maxHeight / srcHeight ];
                            ratio = Math.min(ratio[0], ratio[1]);

                            return { width:srcWidth*ratio, height:srcHeight*ratio };
                        }

                        var resizeObject = calculateAspectRatioFit(theImageWidth,theImageHeight,maxWidth,maxHeight);

                          console.log("The Dimensions are " + theImageWidth + " by " + theImageHeight);
                          
                          return image.scale({ width: resizeObject.width, height: resizeObject.height });
                       
                        }).then(function(image) {
                          // Make sure it's a JPEG to save disk space and bandwidth.
                          return image.setFormat("JPEG");
                       
                        }).then(function(image) {
                          // Get the image data in a Buffer.
                          return image.data();
                       
                        }).then(function(buffer) {
                          // Save the image into a new file.
                          var base64 = buffer.toString("base64");
                          var cropped = new Parse.File("thumbnail.jpg", { base64: base64 });
                          return cropped.save();
                       
                        }).then(function(cropped) {
                          // Attach the image file to the original object.
                          item.set("mainimage", cropped);
                          //item.save();
                          console.log("IT SAVED")
                       
                        }).then(function(result) {
                          response.success();
                        }, function(error) {
                          response.error(error);
                          console.log(error);
                        });

                      /* FINISH THUMBNAIL MAKER */
           } //end doImageWrapper

}); //end beforeSave


