export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
        path: '/bai-tap-1',
        name: 'Bài tập 1',
        icon: 'TableOutlined',
        component: './Product',
    },
	{
        path: '/th1',
        name: 'TH1 bài1',
		icon: 'TableOutlined',
        component: 'BAI1TH1' ,   
    },
	{
        path: '/th2',
        name: 'TH1 bài2',
		icon: 'TableOutlined',
        component: 'BAI2TH1' ,   
    },
	{
        path: '/thuc-hanh-1',
        name: 'TH2 bài1',
		icon: 'TableOutlined',
        component: './BAI1TH2' ,   
    },
	{
        path: '/thuc-hanh-2',
        name: 'TH2 bài2',
		icon: 'TableOutlined',
        component: './BAI2TH2' ,   
    },
	{
        path: '/thuc-hanh-3',
        name: 'TH3',
		icon: 'TableOutlined',
        component: './TH3' ,   
    },
	{
        path: '/thuc-hanh-4',
        name: 'TH4',
		icon: 'TableOutlined',

        component: './TH4' ,   
    },
	{
        path: '/thuc-hanh-5',
        name: 'TH5',
		icon: 'TableOutlined',
        component: './TH5' ,   
    },
	{
        path: '/thuc-hanh-6',
        name: 'TH6',
		icon: 'TableOutlined',
        component: './TH6' ,   
    },
	{
        path: '/KTGK',
        name: 'KTGK',
		icon: 'TableOutlined',
        component: './KTGK' ,   
    },
	{
        path: '/thuc-hanh-7',
        name: 'TH7',
		icon: 'TableOutlined',
        component: './TH7' ,   
    },
	{
        path: '/thuc-hanh-8',
        name: 'TH8',
		icon: 'TableOutlined',
        component: './TH8' ,   
    },
	{
        path: '/thuc-hanh-9',
        name: 'TH9',
		icon: 'TableOutlined',
        component: './TH9' ,   
    },
	


	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];