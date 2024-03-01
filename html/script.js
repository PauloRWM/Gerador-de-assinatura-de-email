$('#drop').on('click', function() {
    $('#fileUpload').trigger('click');

});

$('#fileUpload').on('change', function(e) {
    addImage(e.target);

});

$("#drop").on("dragover", function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).addClass('dragging');

});

$("#drop").on("dragleave", function(e) {
    $(this).removeClass('dragging');

});

$("#drop").on("drop", function(e) {
    e.preventDefault();
    e.stopPropagation();
    var data = e.dataTransfer || e.originalEvent.dataTransfer;
    addImage(data);

});

function addImage(data) {
    var file = data.files[0];
    if (file.type.indexOf('image') === -1) {
        alert('Sorry, the file you uploaded doesn\'t appear to be an image.');
        return false;
    }
    document.getElementById("enviar").style.display="block"

    var reader = new FileReader();
    reader.onload = function(event) {
        var img = new Image();
        img.onload = function() {
            if (img.width < 200 || img.height < 200) {
                alert('Sorry, the image you uploaded doesn\'t appear to be large enough.');
                return false;
            }
            cropImage(img);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);

}

function cropImage(originalImage) {

    $(originalImage).attr('id', 'fullImage');
    $('#imageResize').html(originalImage);
    $('#sectionDragAndDrop').addClass('hidden');
    $('#sectionResize').removeClass('hidden');

    var newImage = new imageCrop('#fullImage', 200, 200);

    $('#crop').on('click', function() {
        var results = newImage.crop();
        $('#thumbnail').html(results.img);
        $('#sectionResize').addClass('hidden');
        $('#sectionThumbnail').removeClass('hidden');
document.getElementById("enviar").style.display="block"    

    });
}