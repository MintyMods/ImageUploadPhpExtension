$(function(){
    var vault = null;
    var stash = null;
    var cropper = null;
    $('#minty_imageupload_button').on('click',function(e){
        e.stopPropagation();
        $('#minty_imageupload_bg').show();
        
        vault = new dhx.Vault('minty_imageupload_container', {
            mode: "grid",
            toolbar: true,
            uploader: {
                autosend: false,
                target: "/vault/backend/upload"
            }
        });
        vault.toolbar.data.update("add", {icon: "fa fa-plus" });
        vault.toolbar.data.update("upload", {icon: "fa fa-cloud-upload-alt" });
        vault.toolbar.data.update("remove-all", {icon: "fa fa-trash" });
       
        $('.dhx_widget').on('paste', handlePaste);

        vault.events.on("Change", function(id,status,file){
            if (isImageType(file)) {
                setTimeout(function(){ 
                    var container = $(".dhx-file-grid-item[dhx_id='" + id + "']");
                    if (!container.data('wrapped')) {
                        container.on('click', function(){
                            wrapImageCropper(id, file);
                        });
                        container.data('wrapped', true);
                    }
               }, 10);
            }
        });
        assignCropperToolBarClickHandlers();
        // vault.events.on("BeforeAdd", function(item){
        //     var allowedSize = 12345; // your choice
        //     return (item.file.type.match(/image.*/)) && item.file.size <= allowedSize;
        // });
    });

    
    function handlePaste(e) {
        e.stopPropagation();
        e.preventDefault();
        
        var event = e.originalEvent;
        var clipboardData = event.clipboardData || window.clipboardData;
        var items = clipboardData.items;
        var files = clipboardData.files;
        var found = false;
        
        for (var i = 0; i < items.length; i++) {
            if (!isImageType(items[i])) continue;
            var blob = items[i].getAsFile();
            var img = new Image();
            img.onload = function(){
                dhtmlx.message("Image loaded");
                var image  = { 
                    id: 'todo',
                    name: blob.name, 
                    size: blob.size,
                    type:blob.type,
                    image: img, //- (string) an HTML Canvas image for preview in the grid
                    status:"queue",
                    progress:0,
                };
                vault.data.add(image);
                dhtmlx.message("Clipboard image item found");
                console.log("ItemBlob", blob);
                found = true;
            };
            var URLObj = window.URL || window.webkitURL;
            img.src = URLObj.createObjectURL(blob);

        }
        // for (var i = 0; i < files.length; i++) {
        //     if (!isImageType(files[i])) continue;
        //     var blob = files[i].getAsFile();
        //     vault.data.add(blob);
        //     dhtmlx.message("Clipboard image file found");
        //     console.log("FileBlob", blob);
        //     found = true;
        // }
        if (!found) {
            dhtmlx.message({ text:"No images found in pasted clipboard data.", css:"dhx_widget--bg_gray", type:"dhtmlx-notification", icon: "dxi dxi-close" });
        } else {
            dhtmlx.message({ text:"Images Added", css:"dhtmlx-notification", icon: "dxi dxi-close" });
        }
        vault.paint();
    }

    function isImageType(file) {
        if (!file) return false;
        var type = file.type ? file.type : file.file.type;
        return type.match(/image.*/);
    }

    function cloneCanvas(oldCanvas, container) {
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');
        newCanvas.width =  container.width();
        newCanvas.height = container.height();
        // newCanvas.width = oldCanvas.width;
        // newCanvas.height = oldCanvas.height;
        context.drawImage(oldCanvas, 0, 0);
        return newCanvas;
    }
        
    function wrapImageCropper(id, file) {
        var canvas = $(".dhx-file-grid-item[dhx_id='" + id + "']").closest("div").find("canvas");
        var container = $('.vault-file-grid');
        stash = container.html();
        var clone = cloneCanvas(canvas[0], container);
        container.replaceWith("<div class='minty_image_wrapper'><div id='minty_target'></div></div>");
        $('#minty_target').replaceWith(clone);
        cropper = new Cropper(clone, getCropperOptions());
        addCropperToolBar();
    }

    function getCropperOptions() {
        return {
                dragMode: 'move',
                viewMode: 1,
                // autoCropArea: 1,
          };
    }

    function addVaultToolBar() {
        vault.toolbar.data.add({
            type: "iconButton",
            id: "add",
            tooltip: "Add Image(s)",
            icon: "fa fa-plus" 
        }, 0);
        vault.toolbar.data.add({
            type: "iconButton",
            id: "upload",
            tooltip: "Upload Image(s)",
            icon: "fa fa-cloud-upload-alt" 
        }, 2);
        vault.toolbar.data.add({
            type: "iconButton",
            id: "remove-all",
            tooltip: "Clear All Images",
            icon: "fa fa-trash" 
        }, 20);
    }
    
    function removeVaultToolBar() {
        vault.toolbar.data.remove("add");
        vault.toolbar.data.remove("upload");
        vault.toolbar.data.remove("remove-all");
    }

    function removeCropperToolBar() {
        vault.toolbar.data.remove("move");
        vault.toolbar.data.remove("crop");
        vault.toolbar.data.remove("zoom-in");
        vault.toolbar.data.remove("zoom-out");
        vault.toolbar.data.remove("flip-h");
        vault.toolbar.data.remove("flip-v");
        vault.toolbar.data.remove("rotate-right");
        vault.toolbar.data.remove("rotate-left");
        vault.toolbar.data.remove("cancel");
        vault.toolbar.data.remove("save");
        addVaultToolBar();
    }

    function addCropperToolBar() {
        removeVaultToolBar();
        var index = 0;
        vault.toolbar.data.add({
            type: "iconButton",
            id: "move",
            tooltip: "Move",
            icon: "fa fa-arrows" 
        }, index);
        vault.toolbar.data.add({
            type: "iconButton",
            id: "crop",
            tooltip: "Crop",
            icon: "fa fa-crop" 
        }, index);
        vault.toolbar.data.add({
            type: "iconButton",
            id: "zoom-in",
            tooltip: "Zoom In",
            icon: "fa fa-search-plus" 
        }, index);
        vault.toolbar.data.add({
            type: "iconButton",
            id: "zoom-out",
            tooltip: "Zoom Out",
            icon: "fa fa-search-minus" 
        }, index);
        vault.toolbar.data.add({
            type: "iconButton",
            id: "flip-h",
            tooltip: "Flip Horizontally",
            icon: "fa fa-arrows-h" 
        }, index);
        vault.toolbar.data.add({
            type: "iconButton",
            id: "flip-v",
            tooltip: "Flip Vertically",
            icon: "fa fa-arrows-v" 
        }, index);
        vault.toolbar.data.add({
            type: "iconButton",
            id: "rotate-right",
            tooltip: "Rotate Right",
            icon: "fa fa-rotate-right" 
        }, index);
        vault.toolbar.data.add({
            type: "iconButton",
            id: "rotate-left",
            tooltip: "Rotate Left",
            icon: "fa fa-rotate-left" 
        }, index);
        vault.toolbar.data.add({
            type: "iconButton",
            id: "cancel",
            tooltip: "Cancel",
            icon: "fa fa-times-circle" 
        }, 20);
        vault.toolbar.data.add({
            type: "iconButton",
            id: "save",
            tooltip: "Save Changes",
            icon: "fa fa-save" 
        }, 0);

    }
    
    function closeCropperView() {
        var container = $('.minty_image_wrapper');
        removeCropperToolBar();
        cropper.destroy();
        container.replaceWith(stash);
        vault.paint();
    }

    function saveCropperImage() {
        alert('not implemented');
    }

    function assignCropperToolBarClickHandlers() {
        vault.toolbar.events.on("click", function(id) {
            if (id === "cancel") {
                closeCropperView();
            } else if (id === "save") {
                saveCropperImage();
            } else if (id === "crop") {
                cropper.setDragMode("crop");
            } else if (id === "zoom-in") {
                cropper.zoom(0.1);
            } else if (id === "zoom-out") {
                cropper.zoom(-0.1);
            } else if (id === "rotate-left") {
                cropper.rotate(-45);
            } else if (id === "rotate-right") {
                cropper.rotate(45);
            } else if (id === "move") {
                cropper.setDragMode("move");
            } else if (id === "flip-h") {
                cropper.scaleX(-1);
            } else if (id === "flip-v") {
                cropper.scaleY(-1);
            } 
        });
    
    }



    // $('#minty_imageupload_container').on('change','#galleries',function(){
    //     var new_url=window.minty_imageupload_url.replace('0',this.value);
    //     $.get(new_url,function(response){
    //         window.minty_imageupload_start=new_url;
    //         $('#minty_imageupload_container').html(response);
    //     });
    // });
    // $('#minty_imageupload_bg, #minty_imageupload_x').on('click',function(e){
    //     if(e.target!==this)return;
    //     e.preventDefault();
    //     $('#minty_imageupload_bg').hide();
    // });
    // $(document).on('change','#minty_imageupload_file',function(e){
    //     var form_data=new FormData();
    //     form_data.append('files[]',$('#minty_imageupload_file')[0].files[0]);
    //     $.ajax({
    //         url:e.target.dataset.url,type:'POST',data:form_data,cache:false,contentType:false,processData:false,success:function(data){
    //             if(typeof data.S_USER_NOTICE!=='undefined'){
    //                 $('#minty_imageupload_bg').hide();
    //                 phpbb.alert(data.MESSAGE_TITLE,data.MESSAGE_TEXT);
    //             }else if(typeof data.files!=='undefined'&&data.files.length){
    //                 var img_split=data.files[0].url.split('/');
    //                 var img_id=img_split[img_split.length-1];
    //                 insert_gallery_image(img_id);
    //             }}
    //         });
    //     });
    //     $(document).on('click','#minty_imageupload_container .topic-actions .pagination a',function(e){
    //         e.preventDefault();
    //         var url_parts=e.currentTarget.href.split('/');
    //         var page=url_parts[url_parts.length-2]=='page'?url_parts[url_parts.length-1]:1;
    //         $.get(window.minty_imageupload_start+'/'+page,function(response){
    //             $('#minty_imageupload_container').html(response);
    //         });
    //     });
    //     $(document).on('click','#minty_imageupload_container img',function(e){
    //         insert_gallery_image(e.target.dataset.id);
    //     });
    //     function insert_gallery_image(id){
    //             insert_text('[url='+window.board_url+'app.php/gallery/image/'+id+'][img]'+window.board_url+'app.php/gallery/image/'+id+'/medium[/img][/url]');
    //             $('#minty_imageupload_bg').hide();
    //     }

});