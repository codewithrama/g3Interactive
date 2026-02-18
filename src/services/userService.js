// Mock user data service
let users = [
  {
    id: 1,
    name: 'Travis Scott',
    email: 'travis.scott@example.com',
    initials: 'TS',
    phone: '0412345678',
    role: 'Admin',
    status: 'Active',
    title: 'Admin',
    image: null,
    responsibilities: ['User Management', 'Content Management'],
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john.doe@example.com',
    initials: 'JD',
    phone: '0412345679',
    role: 'Manager',
    status: 'Active',
    title: 'Manager',
    website: '',
    designation: 'Production Manager',
    image: null,
    responsibilities: ['Content Management'],
  },
  {
    id: 3,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    initials: 'JS',
    phone: '0412345680',
    role: 'User',
    status: 'Inactive',
    title: 'Developer',
    image: null,
    responsibilities: ['Development'],
  },
  {
    id: 4,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    initials: 'AJ',
    phone: '0412345681',
    role: 'Manager',
    status: 'Active',
    title: 'Team Lead',
    image: null,
    responsibilities: ['Team Management', 'Content Management'],
  },
  {
    id: 5,
    name: 'Bob Williams',
    email: 'bob.williams@example.com',
    initials: 'BW',
    phone: '0412345682',
    role: 'User',
    status: 'Active',
    title: 'Designer',
    image: null,
    responsibilities: ['Design'],
  },
  {
    id: 6,
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    initials: 'CB',
    phone: '0412345683',
    role: 'Admin',
    status: 'Inactive',
    title: 'Admin',
    image: null,
    responsibilities: ['User Management'],
  },
  {
    id: 7,
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    initials: 'DP',
    phone: '0412345684',
    role: 'Manager',
    status: 'Active',
    title: 'Product Manager',
    image: null,
    responsibilities: ['Product Management', 'Content Management'],
  },
  {
    id: 8,
    name: 'Edward Norton',
    email: 'edward.norton@example.com',
    initials: 'EN',
    phone: '0412345685',
    role: 'User',
    status: 'Active',
    title: 'Developer',
    image: null,
    responsibilities: ['Development'],
  },
  {
    id: 9,
    name: 'Fiona Apple',
    email: 'fiona.apple@example.com',
    initials: 'FA',
    phone: '0412345686',
    role: 'Manager',
    status: 'Inactive',
    title: 'Marketing Manager',
    image: null,
    responsibilities: ['Marketing'],
  },
  {
    id: 10,
    name: 'George Lucas',
    email: 'george.lucas@example.com',
    initials: 'GL',
    phone: '0412345687',
    role: 'Admin',
    status: 'Active',
    title: 'Admin',
    image: null,
    responsibilities: ['User Management', 'Content Management'],
  },
  {
    id: 11,
    name: 'Helen Mirren',
    email: 'helen.mirren@example.com',
    initials: 'HM',
    phone: '0412345688',
    role: 'User',
    status: 'Active',
    title: 'Designer',
    image: null,
    responsibilities: ['Design'],
  },
  {
    id: 12,
    name: 'Ian McKellen',
    email: 'ian.mckellen@example.com',
    initials: 'IM',
    phone: '0412345689',
    role: 'Manager',
    status: 'Active',
    title: 'Operations Manager',
    image: null,
    responsibilities: ['Operations'],
  },
  {
    id: 13,
    name: 'Julia Roberts',
    email: 'julia.roberts@example.com',
    initials: 'JR',
    phone: '0412345690',
    role: 'User',
    status: 'Inactive',
    title: 'Analyst',
    image: null,
    responsibilities: ['Analysis'],
  },
  {
    id: 14,
    name: 'Kevin Spacey',
    email: 'kevin.spacey@example.com',
    initials: 'KS',
    phone: '0412345691',
    role: 'Admin',
    status: 'Active',
    title: 'Admin',
    image: null,
    responsibilities: ['User Management'],
  },
  {
    id: 15,
    name: 'Laura Dern',
    email: 'laura.dern@example.com',
    initials: 'LD',
    phone: '0412345692',
    role: 'Manager',
    status: 'Active',
    title: 'HR Manager',
    image: null,
    responsibilities: ['HR Management'],
  },
]

let nextId = 16

export const userService = {
  async getUsers(page = 1, pageSize = 10, search = '', statusFilter = '') {
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filtered = [...users]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower),
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((u) => u.status === statusFilter)
    }

    const total = filtered.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginated = filtered.slice(start, end)

    return {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  },

  async getUserById(id) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const user = users.find((u) => u.id === parseInt(id))
    if (!user) throw new Error('User not found')
    return { ...user }
  },

  async createUser(userData) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newUser = {
      id: nextId++,
      ...userData,
      status: userData.status || 'Active',
    }
    users.push(newUser)
    return newUser
  },

  async updateUser(id, userData) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = users.findIndex((u) => u.id === parseInt(id))
    if (index === -1) throw new Error('User not found')
    users[index] = { ...users[index], ...userData }
    return users[index]
  },

  async deleteUser(id) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = users.findIndex((u) => u.id === parseInt(id))
    if (index === -1) throw new Error('User not found')
    users.splice(index, 1)
    return true
  },

  async toggleUserStatus(id) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const user = users.find((u) => u.id === parseInt(id))
    if (!user) throw new Error('User not found')
    user.status = user.status === 'Active' ? 'Inactive' : 'Active'
    return user
  },
}
