<?php
/**
 *
 * Advertisement management. An extension for the phpBB Forum Software package.
 *
 * @copyright (c) 2017 phpBB Limited <https://www.phpbb.com>
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 */

namespace minty\imageupload\controller;

class main
{
	protected $template;
	protected $album;
	protected $album_controller;
	protected $gallery_albums_table;
	public function __construct(\phpbb\template\template $template, \phpbbgallery\core\album\album $album, \phpbbgallery\core\controller\album $album_controller, $gallery_albums_table)
	{
		$this->template = $template;
		$this->album = $album;
		$this->album_controller = $album_controller;
		$this->gallery_albums_table = $gallery_albums_table;
	}

	public function handle($album_id, $page = 1)
	{
		$this->template->assign_vars([
			'S_ALBUMBOX'	=> $this->album->get_albumbox(false, 'galleries', $album_id, 'i_view', false, \phpbbgallery\core\block::PUBLIC_ALBUM, 1),
		]);

		return $this->album_controller->base($album_id, $page);
	}
}
