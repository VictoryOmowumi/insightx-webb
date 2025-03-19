export const mockActivityTypes = [
  {
    id: '1',
    name: 'Event',
    description: 'Physical or virtual events',
    formSchema: {
      venue: { type: 'text', label: 'Venue Name' },
      capacity: { type: 'number', label: 'Maximum Capacity' },
      format: { type: 'text', label: 'Event Format' }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Campaign',
    description: 'Marketing campaigns',
    formSchema: {
      channels: { type: 'text', label: 'Marketing Channels' },
      targetAudience: { type: 'text', label: 'Target Audience' },
      goals: { type: 'textarea', label: 'Campaign Goals' }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Product Activation',
    description: 'Product launches and activations',
    formSchema: {
      product: { type: 'text', label: 'Product Name' },
      launchDate: { type: 'date', label: 'Launch Date' },
      activationType: { type: 'text', label: 'Activation Type' }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

];


export const mockActivities = [
  {
    id: "1",
    typeId: "2",
    title: "Pepsi Football Challenge",
    description: "An interactive football challenge across key stadiums to engage fans and boost brand awareness.",
    status: "completed",
    startDate: "2024-12-21T15:40:15.603822Z",
    endDate: "2025-06-30T11:39:37.603822Z",
    budget: 5000000,
    location: "Teslim Balogun Stadium, Lagos",
    data: {
      channels: "Instagram, Twitter, Facebook",
      targetAudience: "15-40",
      goals: "Enhance brand loyalty through sports engagement"
    },
    kpiData: {
      registrations: 5000,
      attendance: 4800,
      satisfaction: 4.7,
      engagement: 85
    },
    createdBy: "marketing_team",
    createdAt: "2024-11-01T13:39:57.603822Z",
    updatedAt: "2025-06-27T10:41:48.603822Z"
  },
  {
    id: "2",
    typeId: "1",
    title: "7Up Summer Music Tour",
    description: "A nationwide music tour featuring top Nigerian artists, celebrating youth culture and brand identity.",
    status: "active",
    startDate: "2024-11-15T11:31:31.603822Z",
    endDate: "2025-07-09T09:30:36.603822Z",
    budget: 8500000,
    location: "Nationwide",
    data: {
      channels: "YouTube, Instagram, TikTok",
      targetAudience: "18-35",
      goals: "Increase market penetration among Gen Z and Millennials"
    },
    kpiData: {
      registrations: 12000,
      attendance: 10000,
      satisfaction: 4.9,
      engagement: 95
    },
    createdBy: "brand_team",
    createdAt: "2024-10-01T15:12:30.603822Z",
    updatedAt: "2025-03-28T06:11:47.603822Z"
  },
  {
    id: "3",
    typeId: "2",
    title: "Mirinda Campus Activation",
    description: "A fun and engaging activation in universities promoting Mirinda's new flavors.",
    status: "paused",
    startDate: "2024-12-17T20:36:22.603822Z",
    endDate: "2025-02-16T23:16:59.603822Z",
    budget: 3500000,
    location: "University of Lagos, UI, UNN",
    data: {
      venue: "Campus Grounds",
      capacity: 10000,
      format: "On-Site Experience"
    },
    kpiData: {
      registrations: 8000,
      attendance: 7600,
      satisfaction: 4.6,
      engagement: 90
    },
    createdBy: "field_marketing_team",
    createdAt: "2024-12-01T05:59:09.603822Z",
    updatedAt: "2025-02-10T14:02:31.603822Z"
  },
  {
    id: "4",
    typeId: "1",
    title: "Pepsi Influencer Challenge",
    description: "Social media campaign challenging influencers to create unique Pepsi content.",
    status: "active",
    startDate: "2025-01-01T05:36:52.603822Z",
    endDate: "2025-06-06T23:40:33.603822Z",
    budget: 6000000,
    location: "Online",
    data: {
      channels: "Instagram, TikTok, Twitter",
      targetAudience: "18-35",
      goals: "Drive online engagement and brand advocacy"
    },
    kpiData: {
      registrations: 20000,
      attendance: 15000,
      satisfaction: 4.8,
      engagement: 98
    },
    createdBy: "social_media_team",
    createdAt: "2024-12-01T12:36:18.603822Z",
    updatedAt: "2025-05-16T18:09:40.603822Z"
  },
  {
    id: "5",
    typeId: "2",
    title: "Aquafina Health & Wellness Campaign",
    description: "A CSR initiative promoting hydration and wellness in corporate offices and universities.",
    status: "completed",
    startDate: "2025-02-01T00:57:55.603822Z",
    endDate: "2025-05-27T10:06:41.603822Z",
    budget: 4500000,
    location: "Lagos, Abuja, Port Harcourt",
    data: {
      venue: "Corporate Offices, Campuses",
      capacity: 7000,
      format: "Workshops & Fitness Challenges"
    },
    kpiData: {
      registrations: 6000,
      attendance: 5500,
      satisfaction: 4.5,
      engagement: 88
    },
    createdBy: "csr_team",
    createdAt: "2024-12-12T17:12:57.603822Z",
    updatedAt: "2025-02-22T13:05:46.603822Z"
  },
  {
    id: "6",
    typeId: "1",
    title: "Mountain Dew eSports Tournament",
    description: "A gaming competition targeting young gamers and promoting Mountain Dew’s bold identity.",
    status: "active",
    startDate: "2025-03-15T03:41:11.603822Z",
    endDate: "2025-07-25T12:08:42.603822Z",
    budget: 7200000,
    location: "Online & Physical Finals at Landmark Event Center",
    data: {
      channels: "YouTube Gaming, Twitch, Facebook Gaming",
      targetAudience: "15-35",
      goals: "Position Mountain Dew as the drink of choice for gamers"
    },
    kpiData: {
      registrations: 15000,
      attendance: 13500,
      satisfaction: 4.7,
      engagement: 92
    },
    createdBy: "gaming_team",
    createdAt: "2025-02-01T22:33:13.603822Z",
    updatedAt: "2025-06-19T08:41:26.603822Z"
  },
  {
    id: "7",
    typeId: "2",
    title: "Pepsi Independence Mega Concert",
    description: "A major concert featuring top Nigerian artists to celebrate Independence Day.",
    status: "completed",
    startDate: "2024-09-30T08:17:57.603822Z",
    endDate: "2024-10-02T06:33:51.603822Z",
    budget: 10000000,
    location: "Eko Atlantic, Lagos",
    data: {
      venue: "Open-Air Concert Arena",
      capacity: 50000,
      format: "Live Event & Livestream"
    },
    kpiData: {
      registrations: 45000,
      attendance: 48000,
      satisfaction: 4.9,
      engagement: 99
    },
    createdBy: "event_marketing_team",
    createdAt: "2024-08-01T16:16:42.603822Z",
    updatedAt: "2024-10-05T16:11:22.603822Z"
  },
  {
    id: "8",
    typeId: "1",
    title: "7Up Street Football League",
    description: "A grassroots football competition to engage local communities and identify new talent.",
    status: "paused",
    startDate: "2024-07-10T06:45:09.603822Z",
    endDate: "2024-12-29T04:40:06.603822Z",
    budget: 4000000,
    location: "Various Cities in Nigeria",
    data: {
      venue: "Street Pitches & Community Fields",
      capacity: 8000,
      format: "In-Person"
    },
    kpiData: {
      registrations: 6000,
      attendance: 5500,
      satisfaction: 4.3,
      engagement: 75
    },
    createdBy: "grassroots_team",
    createdAt: "2024-06-01T20:19:44.603822Z",
    updatedAt: "2024-11-21T11:12:22.603822Z"
  }
];


export const mockComments = [
  {
    "id": "1",
    "activityId": "3",
    "userId": "user1",
    "content": "Comment 1 content",
    "createdAt": "2024-11-16T15:53:26.603822Z",
    "updatedAt": "2025-01-26T01:27:25.603822Z"
  },
  {
    "id": "2",
    "activityId": "3",
    "userId": "user2",
    "content": "Comment 2 content",
    "createdAt": "2024-10-18T23:49:23.603822Z",
    "updatedAt": "2025-02-12T11:33:59.603822Z"
  },
  {
    "id": "3",
    "activityId": "4",
    "userId": "user1",
    "content": "Comment 3 content",
    "createdAt": "2024-07-28T13:34:56.603822Z",
    "updatedAt": "2025-02-17T09:04:23.603822Z"
  },
  {
    "id": "4",
    "activityId": "6",
    "userId": "user5",
    "content": "Comment 4 content",
    "createdAt": "2024-10-27T06:03:09.603822Z",
    "updatedAt": "2025-06-04T22:41:00.603822Z"
  },
  {
    "id": "5",
    "activityId": "3",
    "userId": "user4",
    "content": "Comment 5 content",
    "createdAt": "2024-09-10T12:02:42.603822Z",
    "updatedAt": "2025-05-03T22:51:29.603822Z"
  },
  {
    "id": "6",
    "activityId": "7",
    "userId": "user3",
    "content": "Comment 6 content",
    "createdAt": "2024-08-18T01:45:04.603822Z",
    "updatedAt": "2025-02-11T05:49:34.603822Z"
  },
  {
    "id": "7",
    "activityId": "4",
    "userId": "user1",
    "content": "Comment 7 content",
    "createdAt": "2024-10-08T04:29:43.603822Z",
    "updatedAt": "2025-05-07T10:59:38.603822Z"
  },
  {
    "id": "8",
    "activityId": "3",
    "userId": "user5",
    "content": "Comment 8 content",
    "createdAt": "2024-08-02T09:52:01.603822Z",
    "updatedAt": "2025-06-04T09:30:42.603822Z"
  },
  {
    "id": "9",
    "activityId": "8",
    "userId": "user2",
    "content": "Comment 9 content",
    "createdAt": "2024-07-18T08:27:30.603822Z",
    "updatedAt": "2025-01-29T18:06:01.603822Z"
  },
  {
    "id": "10",
    "activityId": "1",
    "userId": "user1",
    "content": "What updates are available for this activity?",
    "createdAt": "2024-11-26T11:45:52.603822Z",
    "updatedAt": "2025-03-07T12:18:21.603822Z"
  }
];

export const mockFeedback = [
  {
    "id": "1",
    "activityId": "8",
    "responseData": {
      "rating": 1,
      "comments": "Feedback 1 comments"
    },
    "respondentEmail": "user1@example.com",
    "createdAt": "2024-10-13T14:34:11.603822Z"
  },
  {
    "id": "2",
    "activityId": "10",
    "responseData": {
      "rating": 1,
      "comments": "Feedback 2 comments"
    },
    "respondentEmail": "user2@example.com",
    "createdAt": "2024-09-30T12:55:11.603822Z"
  },
  {
    "id": "3",
    "activityId": "6",
    "responseData": {
      "rating": 4,
      "comments": "Feedback 3 comments"
    },
    "respondentEmail": "user3@example.com",
    "createdAt": "2024-11-18T18:15:31.603822Z"
  },
  {
    "id": "4",
    "activityId": "7",
    "responseData": {
      "rating": 4,
      "comments": "Feedback 4 comments"
    },
    "respondentEmail": "user4@example.com",
    "createdAt": "2024-09-08T13:56:27.603822Z"
  },
  {
    "id": "5",
    "activityId": "7",
    "responseData": {
      "rating": 5,
      "comments": "Feedback 5 comments"
    },
    "respondentEmail": "user5@example.com",
    "createdAt": "2024-09-01T02:17:28.603822Z"
  }
];

export const mockActivity = [
  {
    id: '1',
    title: "Pepsi Football Challenge",
    description: "An interactive football challenge across key stadiums to engage fans and boost brand awareness.",
    status: "In-Progress",
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    budget: 5000000,
    location: "Teslim Balogun Stadium, Lagos",
    kpis: [
      { id: '1', name: 'Registrations', value: 5000 },
      { id: '2', name: 'Attendance', value: 4800 },
      { id: '3', name: 'Satisfaction', value: 4.7 },
      { id: '4', name: 'Engagement', value: 85 },

    ],
    targetAudience: '15-40',
    goals: 'Enhance brand loyalty through sports engagement',


    chat: [
      { id: '1', user: 'Ademola Adetunji', message: 'Let’s aim to hit 80% by next week.', timestamp: '2025-01-14 10:00 AM' },
      { id: '2', user: 'Juliet Romeo', message: 'I’ll follow up with the sales team.', timestamp: '2024-01-14 10:15 AM' },
      { id: '3', user: 'Emeka Jude', message: 'Great progress so far!', timestamp: '2025-02-11 11:00 AM' },
      { id: '4', user: 'You', message: 'What updates are available for this activity?', timestamp: '2025-02-11 11:00 AM' }
    ],
    feedback: [
      { id: '1', user: 'Admin', comment: 'Great progress so far!', timestamp: '2025-02-14 11:00 AM' },
    ],
    form: {
      id: 2,
      title: 'Lead Generation Form',
      description: 'Form to capture leads for follow-up',
      url: 'https://insightx/form/lead-generation',
      assignedAgents: [
        { id: '1', name: 'Olakunle Omikunle', phone: '08012345678', totalSubmissions: 20, lastSubmission: '2025-02-14 09:00 AM' },
        { id: '2', name: 'Chidi Okafor', phone: '08012345678', totalSubmissions: 15, lastSubmission: '2025-02-14 09:30 AM' },
        { id: '3', name: 'Bola Akindele', phone: '08012345678', totalSubmissions: 10, lastSubmission: '2025-02-14 10:00 AM' },
      ],

      submissions: [
        { id: '1', user: 'Alice Johnson', submittedAt: '2025-02-14 09:00 AM', responses: { name: 'Alice', email: 'alice@example.com' } },
        { id: '2', user: 'Bob Brown', submittedAt: '2025-02-14 09:30 AM', responses: { name: 'Bob', email: 'bob@example.com' } },
      ],
    },
  },
];