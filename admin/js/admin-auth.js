document.addEventListener('DOMContentLoaded', function () {
    // Authentication temporarily disabled - frontend only version
    // Will be re-enabled when backend is added
    
    if (typeof Utils === 'undefined') {
        return;
    }

    // Create demo admin user for localStorage
    const demoAdmin = {
        id: 1,
        email: 'admin@demo.com',
        name: 'Admin User',
        role: 'admin'
    };
    
    Utils.saveToStorage('adminUser', demoAdmin);
    Utils.saveToStorage('currentUser', demoAdmin);
    
    // All admin pages are accessible without login for now
    console.log('Admin access granted (demo mode)');
});
