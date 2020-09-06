<?php
/**
 *
 * phpBB Gallery Add-on: Quick Image Posting. An extension for the phpBB Forum Software package.
 *
 * @copyright (c) 2018, Jakub Senko
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 */

namespace minty\imageupload\event;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class main_listener implements EventSubscriberInterface
{
	static public function getSubscribedEvents()
	{
		return array(
			'core.page_header_after'	=> 'assign_template_vars',
		);
	}

	protected $db;
	protected $user;
	protected $helper;
	protected $template;
	protected $gallery_users_table;
	public function __construct(\phpbb\db\driver\driver_interface $db, \phpbb\user $user, \phpbb\controller\helper $helper, \phpbb\template\template $template, $gallery_users_table)
	{
		$this->db = $db;
		$this->user = $user;
		$this->helper = $helper;
		$this->template = $template;
		$this->gallery_users_table = $gallery_users_table;
	}

	public function assign_template_vars()
	{
		if (!$this->user->data['is_registered'])
		{
			return;
		}

		$sql = 'SELECT personal_album_id
			FROM ' . $this->gallery_users_table . '
			WHERE user_id = ' . $this->user->data['user_id'];
		$result = $this->db->sql_query($sql);
		$personal_album_id = $this->db->sql_fetchfield('personal_album_id');
		$this->db->sql_freeresult($result);

		$this->template->assign_vars([
			'U_minty_imageupload_URL'	=> $this->helper->route('minty_imageupload_controller', ['album_id' => 0]),
			'U_minty_imageupload_START'	=> $personal_album_id ? $this->helper->route('minty_imageupload_controller', ['album_id' => $personal_album_id]) : false,
		]);
	}
}
