require('dotenv').config();
const { initializeDatabase, Organisation, User, Employee, Team, EmployeeTeam } = require('../models');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    await initializeDatabase();

    // Create test organisation
    const org = await Organisation.create({
      name: 'Acme Corporation',
    });
    console.log('✓ Created organisation: Acme Corporation');

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      organisation_id: org.id,
      email: 'admin@acme.com',
      password_hash: passwordHash,
      name: 'Admin User',
    });
    console.log('✓ Created admin user: admin@acme.com (password: admin123)');

    // Create sample employees
    const employees = await Employee.bulkCreate([
      {
        organisation_id: org.id,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@acme.com',
        phone: '+1234567890',
        position: 'Software Engineer',
        department: 'Engineering',
      },
      {
        organisation_id: org.id,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@acme.com',
        phone: '+1234567891',
        position: 'Product Manager',
        department: 'Product',
      },
      {
        organisation_id: org.id,
        first_name: 'Bob',
        last_name: 'Johnson',
        email: 'bob.johnson@acme.com',
        phone: '+1234567892',
        position: 'UX Designer',
        department: 'Design',
      },
      {
        organisation_id: org.id,
        first_name: 'Alice',
        last_name: 'Williams',
        email: 'alice.williams@acme.com',
        phone: '+1234567893',
        position: 'DevOps Engineer',
        department: 'Engineering',
      },
    ]);
    console.log(`✓ Created ${employees.length} sample employees`);

    // Create sample teams
    const teams = await Team.bulkCreate([
      {
        organisation_id: org.id,
        name: 'Backend Team',
        description: 'Responsible for backend services and APIs',
      },
      {
        organisation_id: org.id,
        name: 'Frontend Team',
        description: 'Responsible for UI/UX development',
      },
      {
        organisation_id: org.id,
        name: 'DevOps Team',
        description: 'Responsible for infrastructure and deployment',
      },
    ]);
    console.log(`✓ Created ${teams.length} sample teams`);

    // Assign employees to teams
    await EmployeeTeam.bulkCreate([
      { employee_id: employees[0].id, team_id: teams[0].id }, // John -> Backend
      { employee_id: employees[0].id, team_id: teams[2].id }, // John -> DevOps
      { employee_id: employees[1].id, team_id: teams[1].id }, // Jane -> Frontend
      { employee_id: employees[2].id, team_id: teams[1].id }, // Bob -> Frontend
      { employee_id: employees[3].id, team_id: teams[2].id }, // Alice -> DevOps
    ]);
    console.log('✓ Assigned employees to teams');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('You can now login with:');
    console.log('  Email: admin@acme.com');
    console.log('  Password: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
