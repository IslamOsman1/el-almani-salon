const dashboardConfig = {
  websiteType: 'salon',
  enabledModules: ['services', 'gallery', 'team', 'contact', 'socialLinks'],
  modules: [
    {
      key: 'services',
      title: 'Services',
      titleAr: 'الخدمات',
      icon: 'briefcase',
      route: 'ServicesScreen',
      api: '/api/services',
      actions: ['list', 'create', 'update', 'delete'],
    },
    {
      key: 'gallery',
      title: 'Gallery',
      titleAr: 'المعرض',
      icon: 'image',
      route: 'GalleryScreen',
      api: '/api/team/:id/works',
      actions: ['list', 'create', 'update', 'delete'],
    },
    {
      key: 'team',
      title: 'Team',
      titleAr: 'الفريق',
      icon: 'users',
      route: 'TeamScreen',
      api: '/api/team',
      actions: ['list', 'create', 'update', 'delete'],
    },
    {
      key: 'contact',
      title: 'Contact Settings',
      titleAr: 'بيانات التواصل',
      icon: 'phone',
      route: 'ContactScreen',
      api: '/api/settings',
      actions: ['read', 'update'],
    },
    {
      key: 'socialLinks',
      title: 'Social Links',
      titleAr: 'روابط السوشيال',
      icon: 'share',
      route: 'SocialLinksScreen',
      api: '/api/settings',
      actions: ['read', 'update'],
    },
  ],
};

export default dashboardConfig;
