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
        component: './TH1' ,   
        component: './BAI1TH1' ,   
    },
	{
        path: '/th2',
        name: 'TH1 bài2',  
		icon: 'TableOutlined',
        component: './BAI2TH1' ,  
    },
	{
        path: '/thuc-hanh-1',
        name: 'TH2 bài1',
        component: './BAI1TH2' ,   
    },
	{
        path: '/thuc-hanh-2',
        name: 'TH2 bài2',
        component: './BAI2TH2' ,   
    },
	{
        path: '/thuc-hanh-3',
        name: 'TH3',
        component: './TH3' ,   
    },
	{
        path: '/thuc-hanh-4',
        name: 'TH4',
        component: './TH4' ,   
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
