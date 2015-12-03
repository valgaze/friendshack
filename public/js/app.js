var parse_app_id = "6IE3NXx3dSlNv2OkHZbMg6753un203i7Ogws3FAn";
var parse_javascript_id = "MOpSrzLiAcu5ikSSNuAiq6JDuA4HAl0whokSGGC1";

//----Image preview from file slect
var parse_image_url,parse_image_name,parse_file_object;

$('#fileselect1').bind("change", function(e) {
    alert("abc");

    $("#artistpicture")[0].src = "../img/loading.gif"

    $("#update").prop("disabled",true);

     var fileUploadControl = $("#fileselect1")[0];
     var file = fileUploadControl.files[0];
     var name = file.name; //This does *NOT* need to be a unique name
     var parseFile = new Parse.File(name, file);

     parseFile.save().then(function() {

      parse_image_url = parseFile.url();
      parse_image_name = name;
      parse_file_object = parseFile;
      $("#artistpicture")[0].src = parse_image_url;
      $("#update").prop("disabled",false);

    }, function(error) {

      $("#update").prop("disabled",false);
      alert('Whoops, it looks like there\'s an error with the image you selected. Select a different photo and try again');


      $('#artistpicture').attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='); //This makes a base64 transparent gif, easier than resetting image

      //error handling

    });

}); //----./End Image preview from file select

