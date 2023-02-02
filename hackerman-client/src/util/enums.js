export const EVENT_TYPES = [
    {
        display_name: 'Register',
        event_name: 'register',
        event_data: [
            {
                display_name: 'Username',
                name: 'username',
                type: 'text',
                required: true,
                debug_placeholder: 'H_rtz',
            },
            {
                display_name: 'Password',
                name: 'password',
                type: 'text',
                required: true,
                debug_placeholder: 'Coolkid69420blazeit',
            }
        ]
    },
    {
        display_name: 'Login',
        event_name: 'login',
        event_data: [
            {
                display_name: 'Username',
                name: 'username',
                type: 'text',
                required: true,
                debug_placeholder: '',
            },
            {
                display_name: 'Password',
                name: 'password',
                type: 'text',
                required: true,
                debug_placeholder: '',
            }
        ]
    },
    {
        display_name: 'Command',
        event_name: 'command',
        event_data: [
            {
                display_name: 'Command',
                name: 'cmd',
                type: 'text',
                required: true,
                debug_placeholder: '',
            }
        ]
    },
    {
        display_name: 'Logout',
        event_name: 'logout',
        event_data: []
    }
];