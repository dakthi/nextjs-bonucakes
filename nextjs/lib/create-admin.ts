import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@bonucakes.com'
  const password = process.env.ADMIN_PASSWORD || 'changeme123'
  const name = process.env.ADMIN_NAME || 'Admin User'

  try {
    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('❌ Admin user already exists with email:', email)
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Find or create admin role
    let adminRole = await prisma.role.findUnique({
      where: { name: 'admin' }
    })

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: {
          name: 'admin',
          description: 'Administrator with full access'
        }
      })
    }

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: {
          connect: { id: adminRole.id }
        },
        active: true,
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('⚠️  Please change the password after first login!')
    console.log('\nYou can now login at: http://localhost:3000/admin/login')

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
