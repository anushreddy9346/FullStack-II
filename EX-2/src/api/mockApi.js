// Simulated asynchronous REST API layer for Redux thunks

const initialPlatforms = [
  {
    id: "tw",
    name: "Twitter / X",
    handle: "@brand_official",
    iconKey: "Twitter",
    color: "#1DA1F2",
    charLimit: 280,
    connected: true,
    followers: 45200,
    engagement: "4.8%"
  },
  {
    id: "li",
    name: "LinkedIn",
    handle: "Company Page",
    iconKey: "Linkedin",
    color: "#0A66C2",
    charLimit: 3000,
    connected: true,
    followers: 18900,
    engagement: "6.2%"
  },
  {
    id: "ig",
    name: "Instagram",
    handle: "@brand.visuals",
    iconKey: "Instagram",
    color: "#E4405F",
    charLimit: 2200,
    connected: true,
    followers: 89400,
    engagement: "8.1%"
  },
  {
    id: "fb",
    name: "Facebook",
    handle: "Brand Community",
    iconKey: "Facebook",
    color: "#1877F2",
    charLimit: 5000,
    connected: false,
    followers: 32100,
    engagement: "2.4%"
  },
  {
    id: "yt",
    name: "YouTube",
    handle: "@BrandChannel",
    iconKey: "Youtube",
    color: "#FF0000",
    charLimit: 1000,
    connected: true,
    followers: 120000,
    engagement: "11.5%"
  }
];

const initialPosts = [
  {
    id: "post-101",
    title: "🚀 Redux Toolkit State Normalization",
    content: "Mastering state normalization with createEntityAdapter! Normalizing posts by ID reduces redundant data, eliminates prop drilling, and simplifies scalable state operations.",
    platforms: ["tw", "li"],
    status: "Published",
    tags: ["ReduxToolkit", "StateManagement", "React"],
    likes: 342,
    shares: 89,
    comments: 45,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "post-102",
    title: "⚡ Async Thunks & Centralized Data Flow",
    content: "Handling asynchronous operations cleanly with createAsyncThunk. Effortlessly manage pending, fulfilled, and rejected promise states across your entire web application.",
    platforms: ["li", "tw", "ig"],
    status: "Scheduled",
    tags: ["AsyncThunk", "WebDev", "Frontend"],
    likes: 120,
    shares: 34,
    comments: 12,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "post-103",
    title: "🎨 Cross-Platform Content Automation",
    content: "Managing multi-channel distribution from a single source of truth. Standardize posts, monitor character constraints per network, and track global state changes.",
    platforms: ["ig", "fb", "yt"],
    status: "Draft",
    tags: ["ContentStrategy", "DesignSystem", "UI"],
    likes: 0,
    shares: 0,
    comments: 0,
    createdAt: new Date().toISOString()
  }
];

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async fetchInitialData() {
    await delay(600);
    return {
      posts: initialPosts,
      platforms: initialPlatforms
    };
  },

  async addPost(postData) {
    await delay(500);
    const newPost = {
      ...postData,
      id: `post-${Date.now().toString().slice(-4)}`,
      likes: 0,
      shares: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };
    return newPost;
  },

  async updatePost(postData) {
    await delay(450);
    return { ...postData, updatedAt: new Date().toISOString() };
  },

  async deletePost(id) {
    await delay(400);
    return id;
  },

  async publishPost(id) {
    await delay(500);
    return { id, status: "Published", publishedAt: new Date().toISOString() };
  },

  async togglePlatform(platformId, currentConnectedState) {
    await delay(400);
    return {
      id: platformId,
      connected: !currentConnectedState
    };
  }
};
