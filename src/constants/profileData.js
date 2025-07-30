export const profileSections = [
  {
    title: 'Account & Privacy',
    items: [
      {
        label: 'Terms & Conditions',
        icon: '📄',
        screen: 'terms-conditions',
        description: 'View app terms and legal information'
      },
      {
        label: 'About Us',
        icon: '🏢',
        screen: 'about',
        description: 'Learn about JDP Electric'
      }
    ]
  },
  {
    title: 'Support & Help',
    items: [
      {
        label: 'Contact & Support',
        icon: '❓',
        screen: 'contact-support',
        description: 'Get help and contact support'
      },
      {
        label: 'Feedback & Report Issue',
        icon: '💬',
        screen: 'feedback',
        description: 'Share feedback or report problems'
      },
      {
        label: 'How to Use',
        icon: '📖',
        screen: 'how-to-use',
        description: 'Learn how to use the app'
      }
    ]
  },
  {
    title: 'Account Actions',
    items: [
      {
        label: 'Logout',
        icon: '🚪',
        action: 'logout',
        description: 'Sign out of your account',
        dangerous: false
      },
      {
        label: 'Delete Account',
        icon: '🗑️',
        action: 'delete',
        description: 'Permanently delete your account',
        dangerous: true
      }
    ]
  }
];