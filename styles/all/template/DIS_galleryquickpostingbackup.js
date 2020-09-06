$(function() {
	$('#minty_imageupload_button').on('click', function(e) {
		e.stopPropagation();

		$.get(window.minty_imageupload_start, function(response) {
			$('#minty_imageupload_container').html(response);
			$('#minty_imageupload_bg').show();
		});
	});

	$('#minty_imageupload_container').on('change', '#galleries', function() {
		var new_url = window.minty_imageupload_url.replace('0', this.value);
		$.get(new_url, function(response) {
			window.minty_imageupload_start = new_url;
			$('#minty_imageupload_container').html(response);
		});
	});

	// close on background and X click
	$('#minty_imageupload_bg, #minty_imageupload_x').on('click', function(e) {
		if (e.target !== this) return;
		e.preventDefault();

		$('#minty_imageupload_bg').hide();
	});

	// Upload Image button
	$(document).on('change', '#minty_imageupload_file', function(e) {
		var form_data = new FormData();
		form_data.append('files[]', $('#minty_imageupload_file')[0].files[0]);

		$.ajax({
			url: e.target.dataset.url,
			type: 'POST',
			data: form_data,
			cache: false,
			contentType: false,
			processData: false,
			success: function(data) {
				if (typeof data.S_USER_NOTICE !== 'undefined') {
					$('#minty_imageupload_bg').hide();
					phpbb.alert(data.MESSAGE_TITLE, data.MESSAGE_TEXT);
				} else if (typeof data.files !== 'undefined' && data.files.length) {
					var img_split = data.files[0].url.split('/');
					var img_id = img_split[img_split.length - 1];
					insert_gallery_image(img_id);
				}
			}
		});
	});

	// pagination
	$(document).on('click', '#minty_imageupload_container .topic-actions .pagination a', function(e) {
		e.preventDefault();

		var url_parts = e.currentTarget.href.split('/');
		var page = url_parts[url_parts.length - 2] == 'page' ? url_parts[url_parts.length - 1] : 1;
		$.get(window.minty_imageupload_start + '/' + page, function(response) {
			$('#minty_imageupload_container').html(response);
		});
	});

	// click on image
	$(document).on('click', '#minty_imageupload_container img', function(e) {
		insert_gallery_image(e.target.dataset.id);
	});

	function insert_gallery_image(id) {
		insert_text('[url=' + window.board_url + 'app.php/gallery/image/' + id + '][img]' + window.board_url + 'app.php/gallery/image/' + id + '/medium[/img][/url]');
		$('#minty_imageupload_bg').hide();
	}
});
